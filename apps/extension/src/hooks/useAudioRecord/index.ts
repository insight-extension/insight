import { useEffect, useRef, useState } from "react";

import { SubscriptionType } from "@repo/shared/constants";

import { ConnectionStatus } from "@/constants";
import { AudioRecordManager } from "@/services";

import { UseAudioRecord } from "./types";

export const useAudioRecord = ({
  subscriptionType,
  accessToken
}: {
  accessToken: string | null;
  subscriptionType: SubscriptionType | null;
}): UseAudioRecord => {
  const [status, setStatus] = useState<ConnectionStatus>(
    ConnectionStatus.DISCONNECTED
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcription, setTranscription] = useState<string>("");
  const [translation, setTranslation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const audioRecordManagerRef = useRef<AudioRecordManager | null>(null);

  useEffect(() => {
    if (accessToken && subscriptionType) {
      audioRecordManagerRef.current = new AudioRecordManager(
        accessToken,
        subscriptionType
      );

      audioRecordManagerRef.current.on(
        "transcription",
        (transcript: string) => {
          setTranscription((previous) => previous + ` ${transcript}`);
        }
      );
      audioRecordManagerRef.current.on("translation", (translation: string) => {
        setTranslation((previous) => previous + ` ${translation}`);
      });
      audioRecordManagerRef.current.on("status", (status: ConnectionStatus) => {
        setStatus(status);
      });
      audioRecordManagerRef.current.on("recording", (isRecording: boolean) => {
        setIsRecording(isRecording);
      });
      audioRecordManagerRef.current.on("error", (error: any) => {
        setError(error.message);
      });
    }
  }, [accessToken, subscriptionType]);

  useEffect(() => {
    return () => {
      audioRecordManagerRef.current?.destroy();
    };
  }, []);

  return {
    status,
    isRecording,
    transcription,
    translation,
    error,
    start: () => audioRecordManagerRef.current?.start(),
    resume: () => audioRecordManagerRef.current?.resume(),
    stop: () => audioRecordManagerRef.current?.stop(),
    isReady: Boolean(audioRecordManagerRef.current?.isReady)
  };
};
