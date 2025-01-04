import { ConnectionStatus } from "@/constants";

export interface UseAudioRecord {
  status: ConnectionStatus;
  isRecording: boolean;
  transcription: string;
  translation: string;
  error: string | null;
  start: () => void;
  resume: () => void;
  stop: () => void;
  isReady: boolean;
}
