import { SubscriptionType } from "@repo/shared/constants";

import { ConnectionStatus } from "@/constants";

export interface UseAudioRecordProps {
  accessToken: string | null;
  subscriptionType: SubscriptionType | null;
}

export interface UseAudioRecord {
  status: ConnectionStatus;
  isRecording: boolean;
  transcription: string;
  translation: string;
  error: any;
  start: () => void;
  resume: () => void;
  stop: () => void;
  restart: () => void;
  isReady: boolean;
}
