import { useEffect, useRef, useState } from "react";

import { ConnectionStatus } from "@/constants";
import { AudioRecordManager } from "@/services";
import { sessionManager } from "@/session/manager";

import { UseAudioRecord, UseAudioRecordProps } from "./types";

export const useAudioRecord = ({
  subscriptionType,
  accessToken
}: UseAudioRecordProps): UseAudioRecord => {
  const [status, setStatus] = useState<UseAudioRecord["status"]>(
    ConnectionStatus.DISCONNECTED
  );
  const [isRecording, setIsRecording] =
    useState<UseAudioRecord["isRecording"]>(false);
  const [transcription, setTranscription] =
    useState<UseAudioRecord["transcription"]>("");
  const [translation, setTranslation] =
    useState<UseAudioRecord["translation"]>("");
  const [error, setError] = useState<UseAudioRecord["error"] | null>(null);
  const [shouldRefreshToken, setShouldRefreshToken] = useState<boolean>(false);

  const audioRecordManagerRef = useRef<AudioRecordManager | null>(null);

  // todo: add immer
  useEffect(() => {
    if (accessToken && subscriptionType) {
      audioRecordManagerRef.current = new AudioRecordManager(
        accessToken,
        subscriptionType
      );

      audioRecordManagerRef.current.on(
        "transcription",
        (transcript: UseAudioRecord["transcription"]) => {
          setTranscription((previous) => previous + ` ${transcript}`);
        }
      );
      audioRecordManagerRef.current.on(
        "translation",
        (translation: UseAudioRecord["translation"]) => {
          setTranslation((previous) => previous + ` ${translation}`);
        }
      );
      audioRecordManagerRef.current.on(
        "status",
        (status: UseAudioRecord["status"]) => {
          setStatus(status);
        }
      );
      audioRecordManagerRef.current.on(
        "recording",
        (isRecording: UseAudioRecord["isRecording"]) => {
          setIsRecording(isRecording);
        }
      );
      audioRecordManagerRef.current.on(
        "error",
        (error: UseAudioRecord["error"]) => {
          setError(error);
        }
      );

      audioRecordManagerRef.current.on("refreshToken", () => {
        setShouldRefreshToken(true);
      });
    }
  }, [accessToken, subscriptionType]);

  useEffect(() => {
    if (accessToken && shouldRefreshToken) {
      sessionManager.refreshToken(accessToken);

      audioRecordManagerRef.current?.resume();
    }
  }, [shouldRefreshToken]);

  useEffect(() => {
    return () => {
      audioRecordManagerRef.current?.destroy();
      audioRecordManagerRef.current?.clear();
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
    restart: () => audioRecordManagerRef.current?.restart(),
    isReady: Boolean(audioRecordManagerRef.current?.isReady)
  };
};
