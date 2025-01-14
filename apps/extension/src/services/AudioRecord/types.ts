import { ConnectionStatus } from "@/constants";

export type ObservableEventCallbackMap = {
  transcription: (transcription: string) => void;
  translation: (translation: string) => void;
  status: (status: ConnectionStatus) => void;
  recording: (recording: boolean) => void;
  error: (error: any) => void;
};

export type WebSocketEventCallbackMap = {
  connect: () => void;
  connect_error: (error: any) => void;
  message: (message: any) => void;
  disconnect: () => void;
  audioData: (data: any) => void;
  stop: (payload: any) => void;
};
