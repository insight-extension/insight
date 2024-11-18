import React, { useState, useEffect, useRef } from 'react';
import { ChevronsUpDown, CircleX, Languages, Play, Square, Sidebar } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { TextBlock } from "~/components/ui/textBlock";
import { Connection, type Language } from "~/types";

import "~global.css";

import Logo from "~/components/logo";

// Define connection status types
enum ConnectionStatus {
  CONNECTED = "Connected",
  CONNECTING = "Connecting",
  DISCONNECTED = "Disconnected"
}

// URL WebSocket server
const SERVER_URL = "wss://example.com";

// List of supported languages
const supportedLanguages: Language[] = [
  { name: "English", flagCode: "US" },
  { name: "Українська", flagCode: "UA" },
  { name: "Français", flagCode: "FR" }
  // Add other languages if necessary
];

function IndexPopup() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(supportedLanguages[0]);
  const [balance, setBalance] = useState<number>(0);
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [recording, setRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");

  const websocketRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const pcmProcessorRef = useRef<AudioWorkletNode | null>(null);
  const capturedStreamRef = useRef<MediaStream | null>(null);

  const { getMessage } = chrome.i18n;

// Functions for retrieving real data
  const fetchBalance = async () => {
    try {
      const response = await fetch("https://example.com/balance");
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      console.error("Error when retrieving balance:", error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch("https://example.com/status");
      const data = await response.json();
      setStatus(data.status);
    } catch (error) {
      console.error("Error when retrieving status:", error);
    }
  };

  const startCapture = async () => {
    try {
      setStatus(ConnectionStatus.CONNECTING);
      setTranscript("");
      setTranslation("");
  
      // Create WebSocket connection
      const websocket = new WebSocket(SERVER_URL);
      websocket.binaryType = "arraybuffer";
      websocketRef.current = websocket;
  
      websocket.onopen = async () => {
        console.log("WebSocket connection established.");
  
        // Requesting audio capture
        chrome.tabCapture.capture(
          { audio: true, video: false },
          (stream) => {
            if (stream) {
              capturedStreamRef.current = stream;
              setupAudioProcessing(stream);
            } else {
              console.error("Failed to capture audio stream.");
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError.message);
              }
              setStatus(ConnectionStatus.DISCONNECTED);
              setRecording(false);
            }
          }
        );
      };
  
      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("Message from server:", message);
      
          if (message.type === "transcript") {
            setTranscript((prev) => prev + " " + message.transcript);
          } else if (message.type === "translation") {
            setTranslation((prev) => prev + " " + message.translation);
          } else if (message.type === "error") {
            console.error("Error from server:", message.message);
            setTranscript((prev) => prev + `\nError: ${message.message}`);
            setStatus(ConnectionStatus.DISCONNECTED);
          } else if (message.type === "status") {

            if (message.status === "connected") {
              setStatus(ConnectionStatus.CONNECTED);
            }
          }
        } catch (err) {
          console.error("Error processing WebSocket message:", err);
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus(ConnectionStatus.DISCONNECTED);
        setRecording(false);
      };
  
      websocket.onclose = (event) => {
        console.log("WebSocket connection closed:", event);
        setStatus(ConnectionStatus.DISCONNECTED);
        setRecording(false);
      };
  
      setRecording(true);
      setStatus(ConnectionStatus.CONNECTED);
    } catch (error) {
      console.error("Error starting capture:", error);
      setStatus(ConnectionStatus.DISCONNECTED);
      setRecording(false);
    }
  };

  const stopCapture = () => {
    // Closing WebSocket connection
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ type: "stop" }));
      websocketRef.current.close();
      websocketRef.current = null;
      console.log("WebSocket connection closed by client.");
    }

    // Stopping audio capture
    if (capturedStreamRef.current) {
      capturedStreamRef.current.getTracks().forEach((track) => track.stop());
      capturedStreamRef.current = null;
      console.log("Audio capture stopped.");
    }

    // Disconnecting audio nodes
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }

    if (pcmProcessorRef.current) {
      pcmProcessorRef.current.disconnect();
      pcmProcessorRef.current = null;
    }

    // Closing AudioContext
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setRecording(false);
    setStatus(ConnectionStatus.DISCONNECTED);
  };

  const setupAudioProcessing = async (stream: MediaStream) => {
    try {
      const audioContext = new AudioContext({ sampleRate: 16000 });
  
      // Loading the AudioWorkletProcessor module
      await audioContext.audioWorklet.addModule('pcm-processor.js');
  
      const sourceNode = audioContext.createMediaStreamSource(stream);
      const pcmProcessor = new AudioWorkletNode(audioContext, 'pcm-processor');
  
      // Restoring sound in the tab
      await audioContext.resume();
      console.log("AudioContext state after resume:", audioContext.state);
  
      // Connecting the source to the processor
      sourceNode.connect(audioContext.destination);
      sourceNode.connect(pcmProcessor);
  
      pcmProcessor.port.onmessage = (event) => {
        const audioData = event.data;
  
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
          websocketRef.current.send(audioData);
          console.log("Audio data sent to WebSocket server.");
        } else {
          console.warn("WebSocket is not open. Cannot send audio data.");
        }
      };
    } catch (error) {
      console.error("Error setting up audio processing:", error);
      setStatus(ConnectionStatus.DISCONNECTED);
      setRecording(false);
    }
  };
  
  // Function to change the language
  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    chrome.storage.sync.set({ language: language });
  };

  // Function to open the Side Panel
  const openSidePanel = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      });

      if (!tab.id) {
        console.error("No active tab found.");
        return;
      }

      await chrome.sidePanel.open({ tabId: tab.id });
      await chrome.sidePanel.setOptions({
        tabId: tab.id,
        path: 'sidepanel.html', // Make sure the path corresponds to your file
        enabled: true
      });
      console.log('Sidebar opened');
    } catch (error) {
      console.error('Error opening sidebar:', error);
    }
  };

  const closeExtension = () => window.close();

  const handleSidebarClick = () => {
    openSidePanel();
    closeExtension();
  };

  // Initialization of data upon component loading
  useEffect(() => {
    fetchBalance();
    fetchStatus();

    // Updating data every 60 seconds
    const interval = setInterval(() => {
      fetchBalance();
      fetchStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-84">
      <div className="p-3 mb-2 bg-accent rounded-b-2xl">
        <div className="flex flex-row items-center justify-between mb-3 p-0 text-primary-foreground">
          <Logo />

          <div>
            {/* Button Side Panel */}
            <Button
              size="icon"
              variant="raw"
              className="bg-transparent rotate-180"
              onClick={handleSidebarClick}>
              <Sidebar
                className="text-primary-foreground hover:text-primary-foreground/80"
                size={24} />
            </Button>
            
            <Button
              size="icon"
              variant="raw"
              className="bg-transparent"
              onClick={closeExtension}>
              <CircleX
                size={24}
                className="text-primary-foreground hover:text-primary-foreground/80"
              />
            </Button>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center mb-3">
          <Button
            variant="default"
            className="w-38"
            onClick={() => {
              // Wallet connection handler
              // handleConnectWallet();
            }}>
            {getMessage("connectWallet")}
          </Button>

          <Button
            variant="default"
            className="w-38"
            onClick={() => {
              // Deposit funds handler
              // handleDepositFunds();
            }}>
            {getMessage("depositFunds")}
          </Button>
        </div>

        <div className="flex flex-row justify-between items-center mb-2">
          <div className="flex flex-row items-center h-8 w-38 bg-accent-foreground rounded">
            <p className="px-3 text-primary-foreground font-medium text-sm">
              {`${getMessage("balance")}: ${balance}`}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row justify-between items-center h-8 w-38 gap-2 text-primary bg-secondary px-3 rounded">
              <div className="flex flex-row items-center gap-2">
                <Languages size={16} />

                <span className="text-sm">{currentLanguage.name}</span>
              </div>

              <ChevronsUpDown size={12} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="max-h-40 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-thumb]:bg-gray-300">
              {supportedLanguages.map(({ flagCode, name: language }) => (
                <DropdownMenuItem
                  key={flagCode}
                  className="cursor-pointer w-36"
                  onClick={() =>
                    handleLanguageChange({ flagCode, name: language })
                  }>
                  <ReactCountryFlag
                    countryCode={flagCode}
                    svg
                    cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
                    cdnSuffix="svg"
                    title={language}
                    style={{ cursor: "pointer" }}
                    className="mr-2"
                  />
                  {language}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="px-3 text-primary-foreground font-medium text-sm">
          {`${getMessage("status")}: `}
          <span
            className={
              status === ConnectionStatus.CONNECTED
                ? "text-green-500"
                : status === ConnectionStatus.CONNECTING
                ? "text-yellow-500"
                : "text-red-500"
            }>
            {status}
          </span>
        </p>

      </div>

      <div className="flex flex-col gap-3 px-3 py-2">
        <TextBlock className="bg-muted max-h-40 text-primary rounded-lg text-sm overflow-auto">
          <p>{transcript}</p>
        </TextBlock>
        
        <TextBlock className="bg-secondary-foreground max-h-44 text-primary rounded-lg text-sm overflow-auto">
          <p>{translation}</p>
        </TextBlock>

        <div className="flex flex-row gap-2">
          <Button
            size="lg"
            variant={recording ? "destructive" : "primary"}
            onClick={recording ? stopCapture : startCapture}>
            {recording ? (
              <>
                <Square className="mr-2" />
                {getMessage("stop")}
              </>
            ) : (
              <>
                <Play className="mr-2" />
                {getMessage("start")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default IndexPopup;