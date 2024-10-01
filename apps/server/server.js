// server.js
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import express from "express";
import https from "https";
import { WebSocketServer } from "ws";
import mongoose from "mongoose";
import pkg from "speechmatics";
import OpenAI from "openai";
import sbd from "sbd";
import { fileURLToPath } from "url";
import { dirname } from "path";

import User from "./models/User.js"; // Import user model

const { RealtimeSession } = pkg;
dotenv.config();

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const PORT = process.env.PORT || 8443;
const SPEECHMATICS_API_KEY = process.env.SPEECHMATICS_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CERT_PATH = process.env.CERT_PATH || "./server.crt";
const KEY_PATH = process.env.KEY_PATH || "./server.key";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/your_database_name";
const YOUR_PUBLIC_KEY =
  process.env.YOUR_PUBLIC_KEY || "9JxVGS9skLMRcgq5tdaGsRZSxSdAXvHkCyr2ZFTkHzbw";

// Check for required API keys
if (!SPEECHMATICS_API_KEY) {
  console.error(
    "Speechmatics API key is not set in the environment variables."
  );
  process.exit(1);
}

if (!OPENAI_API_KEY) {
  console.error("OpenAI API key is not set in the environment variables.");
  process.exit(1);
}

// Connecting to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Create a pool of Speechmatics API keys
const speechmaticsKeys = SPEECHMATICS_API_KEY.split(",").map((key) => ({
  key: key.trim(),
  activeStreams: 0,
}));

// Function to get an available API key
function getAvailableSpeechmaticsKey() {
  for (let keyObj of speechmaticsKeys) {
    if (keyObj.activeStreams < 2) {
      keyObj.activeStreams += 1;
      return keyObj.key;
    }
  }
  return null; // No available keys
}

// Function to release an API key
function releaseSpeechmaticsKey(apiKey) {
  for (let keyObj of speechmaticsKeys) {
    if (keyObj.key === apiKey) {
      if (keyObj.activeStreams > 0) {
        keyObj.activeStreams -= 1;
      }
      break;
    }
  }
}

// Load certificates
const serverOptions = {
  cert: fs.readFileSync(path.resolve(__dirname, CERT_PATH)),
  key: fs.readFileSync(path.resolve(__dirname, KEY_PATH)),
};

// Initialize Express, HTTPS server, and WebSocket server
const app = express();
app.use(express.json());
const server = https.createServer(serverOptions, app);
const wss = new WebSocketServer({ server });

// Session store (in a real application, use a database or Redis)
const sessionStore = {};

// OpenAI setup
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Function to split buffer into sentences
function extractSentences(buffer) {
  // Use the sbd library to accurately split sentences
  const sentences = sbd.sentences(buffer, { newline_boundaries: true });
  if (sentences.length > 0) {
    // Collect all found sentences
    const completeSentences = sentences.join(" ").trim();
    // Find the last completed sentence index
    const lastSentenceEnd = buffer.lastIndexOf(sentences[sentences.length - 1]);
    // Leave only incomplete fragments in the buffer
    const remainingBuffer = buffer.slice(
      lastSentenceEnd + sentences[sentences.length - 1].length
    );
    return { completeSentences, remainingBuffer };
  }
  return { completeSentences: null, remainingBuffer: buffer };
}

// Function to stream text translation using OpenAI
async function translateTextStream(text, sourceLang = "en", targetLang = "ua") {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use the appropriate model name
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate text from ${sourceLang} to ${targetLang}, considering the context and themes related to the Solana ecosystem.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      stream: true,
    });

    let translation = "";
    for await (const part of stream) {
      translation += part.choices[0]?.delta?.content || "";
    }
    return translation;
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    throw error;
  }
}

// API to store user's public key
app.post("/api/store-public-key", async (req, res) => {
  const { sessionId, userPublicKey } = req.body;

  if (sessionId && userPublicKey) {
    // Save the sessionId and public key mapping
    sessionStore[sessionId] = {
      publicKey: userPublicKey,
      timestamp: Date.now(),
    };

    try {
      // Check if the user exists
      let user = await User.findOne({ publicKey: userPublicKey });
      if (!user) {
        // Create a new user
        user = new User({ publicKey: userPublicKey });
        await user.save();
        console.log("New user created:", userPublicKey);
      } else {
        console.log("User already exists:", userPublicKey);
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error saving user to the database:", error);
      res.status(500).json({ error: "Server error" });
    }
  } else {
    res.status(400).json({ error: "Missing sessionId or userPublicKey" });
  }
});

// API to retrieve public key by sessionId
app.post("/api/get-public-key", (req, res) => {
  const { sessionId } = req.body;

  const session = sessionStore[sessionId];

  if (session && Date.now() - session.timestamp < 5 * 60 * 1000) {
    // Valid for 5 minutes
    res.json({ success: true, userPublicKey: session.publicKey });
  } else {
    res.status(400).json({ error: "Invalid or expired sessionId" });
  }
});

// API for confirming payments and updating user's balance
import { Connection, clusterApiUrl } from "@solana/web3.js";

app.post("/api/confirm-payment", async (req, res) => {
  const { userPublicKey, transactionSignature, amount } = req.body;

  try {
    // Connecting to Solana blockchain
    const connection = new Connection(clusterApiUrl("mainnet-beta"));
    const transaction = await connection.getTransaction(transactionSignature);

    // Verify that the transaction is valid and funds were sent to your account
    if (transaction && transaction.meta && transaction.meta.err === null) {
      const toPublicKey = YOUR_PUBLIC_KEY; // Your public key
      // Check that the transaction includes a transfer to your address
      const isPaymentValid = transaction.transaction.message.accountKeys.some(
        (key) => key.toString() === toPublicKey
      );

      if (isPaymentValid) {
        // Update the user's balance
        let user = await User.findOne({ publicKey: userPublicKey });
        if (user) {
          user.balance += amount;
          await user.save();
          res.json({ success: true });
        } else {
          res.status(400).json({ error: "User not found" });
        }
        user.transactions.push({
          type: "deposit",
          amount: amount,
          details: "Balance replenishment via deposit",
        });
        await user.save();
      } else {
        res.status(400).json({
          error: "Transaction does not include a transfer to your address",
        });
      }
    } else {
      res.status(400).json({ error: "Invalid transaction" });
    }
  } catch (error) {
    console.error("Error checking transaction:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// API to get the user's balance
app.post("/api/get-balance", async (req, res) => {
  const { publicKey } = req.body;

  if (!publicKey) {
    return res.status(400).json({ error: "Public key not provided" });
  }

  try {
    const user = await User.findOne({ publicKey });
    if (user) {
      res.json({ success: true, balance: user.balance });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error getting user balance:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Function to get user by public key
async function getUserByPublicKey(publicKey) {
  try {
    const user = await User.findOne({ publicKey });
    return user;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

// Function to charge the user
async function chargeUser(publicKey, amount) {
  try {
    const user = await User.findOne({ publicKey });
    if (user) {
      user.balance -= amount;
      user.transactions.push({
        type: "charge",
        amount: amount,
        details: "Charge for transcription and translation",
      });
      await user.save();
      console.log(
        `Charged ${amount} from user ${publicKey}. New balance: ${user.balance}`
      );
    } else {
      console.error("User not found for charging");
    }
  } catch (error) {
    console.error("Error charging user:", error);
  }
}

// Handle WebSocket connections from the extension
wss.on("connection", async (wsClient) => {
  console.log("Extension connected to server");

  // Variables to store user information
  let userPublicKey = null;
  let assignedKey = null;

  // Buffer to accumulate transcriptions
  let transcriptBuffer = "";

  // Variables to store language settings
  let sourceLang = "en";
  let targetLang = "ua";

  // Handle messages from the client
  wsClient.on("message", async (data) => {
    // Check if the message is binary (audio data) or text (JSON)
    if (typeof data === "string") {
      const message = JSON.parse(data);

      if (message.type === "authentication") {
        userPublicKey = message.userPublicKey;

        // Get user from the database
        const user = await getUserByPublicKey(userPublicKey);

        if (user && user.balance > 0) {
          wsClient.send(JSON.stringify({ type: "authentication_success" }));

          // Get an available API key
          assignedKey = getAvailableSpeechmaticsKey();

          if (!assignedKey) {
            console.error(
              "No available Speechmatics API keys to handle a new connection."
            );
            wsClient.send(
              JSON.stringify({
                type: "error",
                message: "Server is busy. Please try again later.",
              })
            );
            wsClient.close();
            return;
          }

          // Create a RealtimeSession for interacting with Speechmatics
          const session = new RealtimeSession(assignedKey);

          // RealtimeSession event handlers
          session.addListener("RecognitionStarted", () => {
            console.log("RecognitionStarted");
            wsClient.send(
              JSON.stringify({ type: "status", message: "RecognitionStarted" })
            );
          });

          session.addListener("Error", (error) => {
            console.error("Session error:", error);
            wsClient.send(
              JSON.stringify({ type: "error", message: error.message })
            );
          });

          session.addListener("AddTranscript", async (message) => {
            const transcript = message.metadata.transcript;
            console.log("AddTranscript:", transcript);
            wsClient.send(JSON.stringify({ type: "transcript", transcript }));

            // Add transcription to the buffer
            transcriptBuffer += " " + transcript;

            // Extract completed sentences from the buffer
            const { completeSentences, remainingBuffer } =
              extractSentences(transcriptBuffer);

            if (completeSentences) {
              wsClient.send(
                JSON.stringify({
                  type: "translation_status",
                  message: "Translating...",
                })
              );

              try {
                const translatedText = await translateTextStream(
                  completeSentences.trim(),
                  sourceLang,
                  targetLang
                );
                console.log("Translation:", translatedText);
                wsClient.send(
                  JSON.stringify({
                    type: "translation",
                    translation: translatedText,
                  })
                );

                wsClient.send(
                  JSON.stringify({
                    type: "translation_status",
                    message: "Translation complete",
                  })
                );

                // Update buffer with incomplete fragments
                transcriptBuffer = remainingBuffer.trim();

                // Charge for translation (e.g., 0.01 units)
                await chargeUser(userPublicKey, 0.02);
              } catch (error) {
                console.error("Error translating transcript:", error);
                wsClient.send(
                  JSON.stringify({
                    type: "error",
                    message: "Failed to translate transcript",
                  })
                );
              }
            }
          });

          session.addListener("EndOfTranscript", async () => {
            console.log("EndOfTranscript");
            wsClient.send(
              JSON.stringify({ type: "status", message: "EndOfTranscript" })
            );

            // Translate the remaining buffer
            if (transcriptBuffer.trim().length > 0) {
              wsClient.send(
                JSON.stringify({
                  type: "translation_status",
                  message: "Translating...",
                })
              );

              try {
                const translatedText = await translateTextStream(
                  transcriptBuffer.trim(),
                  sourceLang,
                  targetLang
                );
                console.log("Translation:", translatedText);
                wsClient.send(
                  JSON.stringify({
                    type: "translation",
                    translation: translatedText,
                  })
                );

                wsClient.send(
                  JSON.stringify({
                    type: "translation_status",
                    message: "Translation complete",
                  })
                );

                // Clear the buffer
                transcriptBuffer = "";

                // Charge for translation
                await chargeUser(userPublicKey, 0.02);
              } catch (error) {
                console.error("Error translating transcript:", error);
                wsClient.send(
                  JSON.stringify({
                    type: "error",
                    message: "Failed to translate transcript",
                  })
                );
              }
            }
          });

          // Start transcription session
          try {
            await session.start({
              transcription_config: {
                language: sourceLang,
                operating_point: "enhanced",
                enable_partials: true,
                max_delay: 2,
              },
              audio_format: {
                type: "raw",
                encoding: "pcm_s16le",
                sample_rate: 16000,
              },
            });
            console.log("Transcription session started");
          } catch (error) {
            console.error("Error starting transcription session:", error);
            wsClient.send(
              JSON.stringify({
                type: "error",
                message: "Failed to start transcription session",
              })
            );
            wsClient.close();
            releaseSpeechmaticsKey(assignedKey);
            return;
          }

          // Save session in the client for further use
          wsClient.session = session;
        } else {
          wsClient.send(
            JSON.stringify({
              type: "error",
              message: "Insufficient balance or user not found",
            })
          );
          wsClient.close();
        }
      } else if (message.type === "language_settings") {
        sourceLang = message.sourceLanguage || "en";
        targetLang = message.targetLanguage || "ua";
        console.log(
          `Languages set: source - ${sourceLang}, target - ${targetLang}`
        );
      } else {
        // Handle other message types
      }
    } else {
      // Handle audio data
      if (wsClient.session) {
        try {
          wsClient.session.sendAudio(data);
        } catch (error) {
          console.error("Error sending audio:", error);
          wsClient.send(
            JSON.stringify({
              type: "error",
              message: "Failed to send audio data",
            })
          );
        }
      }
    }
  });

  // Handle connection close
  wsClient.on("close", async () => {
    console.log("Extension disconnected");

    if (wsClient.session) {
      // Stop transcription session
      await wsClient.session
        .stop()
        .then(() => {
          console.log("Transcription session stopped");
          // Release API key
          releaseSpeechmaticsKey(assignedKey);
        })
        .catch((error) => {
          console.error("Error stopping transcription session:", error);
          // Release API key even in case of error
          releaseSpeechmaticsKey(assignedKey);
        });
    }
  });

  // Handle WebSocket connection errors
  wsClient.on("error", async (error) => {
    console.error("WebSocket connection error with the extension:", error);

    if (wsClient.session) {
      // Stop transcription session
      await wsClient.session
        .stop()
        .then(() => {
          console.log("Transcription session stopped after error");
          // Release API key
          releaseSpeechmaticsKey(assignedKey);
        })
        .catch((err) => {
          console.error(
            "Error stopping transcription session after error:",
            err
          );
          // Release API key even in case of error
          releaseSpeechmaticsKey(assignedKey);
        });
    }
  });
});

// Start HTTPS server
server.listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`);
});
