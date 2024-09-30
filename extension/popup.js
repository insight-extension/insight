// Retrieving UI elements
const startButton = document.getElementById("startCapture");
const stopButton = document.getElementById("stopCapture");
const statusDisplay = document.getElementById("status");
const transcriptDisplay = document.getElementById("transcriptDisplay");
const translationDisplay = document.getElementById("translationDisplay");

// Checking that all elements are found
if (!startButton || !stopButton || !statusDisplay || !transcriptDisplay) {
  console.error("Some elements were not found in popup.html");
}

// Adding event listeners
if (startButton) {
  startButton.addEventListener("click", startCapture);
}

if (stopButton) {
  stopButton.addEventListener("click", stopCapture);
}

let capturedStream = null;
let audioContext = null;
let sourceNode = null;
let websocket = null;
// const language = "en"; // Set the desired transcription language

// WebSocket URL
const SERVER_URL = "wss://176.117.185.56:8443";

// Function to start audio capture and establish WebSocket connection
async function startCapture() {
  try {
    if (!startButton || !stopButton || !statusDisplay) {
      console.error("Some UI elements are missing.");
      return;
    }

    startButton.disabled = true;
    stopButton.disabled = false;
    if (statusDisplay) {
      statusDisplay.innerText = "Status: Connecting to server...";
    } else {
      console.error("statusDisplay element not found.");
      return;
    }

    // Establishing WebSocket connection with the server
    websocket = new WebSocket(SERVER_URL);
    websocket.binaryType = 'arraybuffer';

    websocket.onopen = async function () {
      console.log("WebSocket connection to the server established.");
      statusDisplay.innerText = "Status: Connected. Starting transcription...";

      // Starting audio capture
      chrome.tabCapture.capture(
        {
          audio: true,
          video: false,
        },
        (stream) => {
          if (stream) {
            capturedStream = stream;
            // Creating AudioContext with a sample rate of 16000 Hz
            audioContext = new AudioContext({ sampleRate: 16000 });
            setupAudioProcessing(stream);
          } else {
            console.error("Failed to capture the audio stream.");
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError.message);
            }
            statusDisplay.innerText = "Status: Failed to capture audio.";
            startButton.disabled = false;
            stopButton.disabled = true;
          }
        }
      );
    };

    websocket.onmessage = function (event) {
      try {
        const message = JSON.parse(event.data);
        console.log("Message received from server:", message);
        if (message.type === "transcript") {
          const transcript = message.transcript;
          console.log("Transcript:", transcript);
          // Updating transcript UI
          updateTranscriptUI(transcript);
        } else if (message.type === "translation") {
          const translation = message.translation;
          console.log("Translation:", translation);
          // Updating translation UI
          updateTranslationUI(translation);
        } else if (message.type === "error") {
          console.error("Error from server:", message.message);
          updateTranscriptUI(`\nError: ${message.message}`);
          statusDisplay.innerText = "Status: Error in transcription.";
        } else if (message.type === "status") {
          console.log("Status from server:", message.message);
          statusDisplay.innerText = `Status: ${message.message}`;
        }
      } catch (err) {
        console.error("Error processing WebSocket message:", err);
      }
    };

    websocket.onerror = function (error) {
      console.error("WebSocket error:", error);
      statusDisplay.innerText = "Status: WebSocket error.";
      startButton.disabled = false;
      stopButton.disabled = true;
    };

    websocket.onclose = function (event) {
      console.log("WebSocket connection closed:", event);
      statusDisplay.innerText = "Status: Disconnected.";
      startButton.disabled = false;
      stopButton.disabled = true;
    };

    console.log("Audio capture request sent.");
  } catch (error) {
    console.error("Error starting audio capture:", error);
    if (statusDisplay) {
      statusDisplay.innerText = "Status: Failed to start capture.";
    }
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}

// Function to stop audio capture and close WebSocket connection
function stopCapture() {
  if (websocket && websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify({ type: "stop" }));
    websocket.close();
    websocket = null;
    console.log("StopRecognition message sent, and WebSocket closed.");
    if (statusDisplay) {
      statusDisplay.innerText = "Status: Stopped.";
    }
  }

  if (capturedStream) {
    capturedStream.getTracks().forEach((track) => track.stop());
    capturedStream = null;
    console.log("Audio capture stopped.");
  }

  if (sourceNode) {
    sourceNode.disconnect();
    sourceNode = null;
  }

  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }

  startButton.disabled = false;
  stopButton.disabled = true;
}

// Function to set up audio processing
async function setupAudioProcessing(stream) {
  try {
    // Loading AudioWorkletProcessor
    await audioContext.audioWorklet.addModule('pcm-processor.js');

    sourceNode = audioContext.createMediaStreamSource(stream);
    const pcmProcessor = new AudioWorkletNode(audioContext, 'pcm-processor');

    // Connecting audio source directly to destination for playback
    sourceNode.connect(audioContext.destination);

    // Connecting audio source to the processor for processing and sending to server
    sourceNode.connect(pcmProcessor);

    pcmProcessor.port.onmessage = (event) => {
      const audioData = event.data;
      // Sending audio data to WebSocket server as binary data
      if (websocket && websocket.readyState === WebSocket.OPEN) {
        websocket.send(audioData);
      }
    };
  } catch (error) {
    console.error("Error setting up audio processing:", error);
    if (statusDisplay) {
      statusDisplay.innerText = "Status: Audio processing error.";
    }
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}

// Function to update transcript UI
function updateTranscriptUI(transcript) {
  if (transcriptDisplay) {
    transcriptDisplay.innerText += " " + transcript + " ";
    transcriptDisplay.scrollTop = transcriptDisplay.scrollHeight;
  } else {
    console.error("transcriptDisplay element not found.");
  }
}

// Function to update translation UI
function updateTranslationUI(translation) {
  if (translationDisplay) {
    translationDisplay.innerText += " " + translation + " ";
    translationDisplay.scrollTop = translationDisplay.scrollHeight;
  } else {
    console.error("translationDisplay element not found.");
  }
}
