export const PCM_PROCESSOR_MODULE = {
  name: "pcm-processor",
  source: "pcm-processor.js",
};

export const SAMPLE_RATE = 16000;

export enum SocketEvent {
  CONNECT = "connect",
  CONNECT_ERROR = "connect_error",
  MESSAGE = "message",
  DISCONNECT = "disconnect",
}

export enum ConnectionStatus {
  CONNECTED = "Connected",
  CONNECTING = "Connecting",
  DISCONNECTED = "Disconnected",
}

export enum MessageType {
  TRANSCRIPT = "transcript",
  TRANSLATION = "translation",
  STATUS = "status",
}

export enum EmitMessageType {
  AUDIO_DATA = "audioData",
  STOP = "stop",
}
