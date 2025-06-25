import { useCallback, useEffect, useRef, useState } from "react";
import ArrowsIcon from "react:@/assets/arrows.svg";
import CircleIcon from "react:@/assets/circle-arrows.svg";
import PlayIcon from "react:@/assets/play.svg";
import StopIcon from "react:@/assets/stop.svg";
import SwitchVerticalIcon from "react:@/assets/switch-vertical.svg";
import VolumeIcon from "react:@/assets/volume-max.svg";
import VolumeGradientIcon from "react:@/assets/volume-max-gradient.svg";

import { useAppContext } from "@/app/AppContext";
import { LanguageSelector } from "@/components/features";
import { GA_EVENTS, gaEmitter } from "@/services";
import { Language } from "@/types";
import { cn } from "@repo/ui/lib";

export const HomePage = () => {
  const {
    isSidebar,
    isRecording,
    sourceLanguage,
    targetLanguage,
    setSourceLanguage,
    setTargetLanguage,
    transcription,
    translation,
    isReady,
    accessToken,
    balance,
    subscriptionType,
    setShouldUpdateBalance,
    stop,
    start,
    resume
  } = useAppContext();

  const { getMessage } = chrome.i18n;

  const transcriptionRef = useRef<HTMLDivElement>(null);
  const translationRef = useRef<HTMLDivElement>(null);

  const [rotation, setRotation] = useState(-110);
  const [volume, setVolume] = useState(50);

  const [isBlocksSwapped, setIsBlocksSwapped] = useState(false);

  const handleSourceLanguageChange = useCallback((language: Language) => {
    setSourceLanguage(language);
    chrome.storage.sync.set({ sourceLanguage: language });
  }, [setSourceLanguage]);

  const handleTargetLanguageChange = useCallback((language: Language) => {
    setTargetLanguage(language);
    chrome.storage.sync.set({ targetLanguage: language });
  }, [setTargetLanguage]);

  const handleSwap = () => {
      setRotation((prev) => prev - 180);
      setSourceLanguage(targetLanguage);
      setTargetLanguage(sourceLanguage);
  };

  const handleSwapPosition = () => {
    setIsBlocksSwapped((prev) => !prev);
  }

  const handleStartRecording = async () => {
    await gaEmitter.emitEvent(
      isReady ? GA_EVENTS.RESUME_TRANSLATION : GA_EVENTS.START_TRANSLATION,
      {
        source_language: sourceLanguage.alpha2,
        target_language: targetLanguage.alpha2,
        subscription_type: subscriptionType
      }
    );

    setShouldUpdateBalance(false);

    isReady ? resume() : start();
  };

  const handleStopRecording = async () => {
    await gaEmitter.emitEvent(GA_EVENTS.STOP_TRANSLATION);

    stop();

    setShouldUpdateBalance(true);
  };

  useEffect(() => {
    chrome.storage.sync.get(['sourceLanguage', 'targetLanguage'], (result) => {
      if (result.sourceLanguage) setSourceLanguage(result.sourceLanguage);
      if (result.targetLanguage) setTargetLanguage(result.targetLanguage);
    });
  }, [setSourceLanguage, setTargetLanguage]);

  useEffect(() => {
    if (transcriptionRef.current) {
      const container = transcriptionRef.current;
      container.scrollTop = container.scrollHeight;    
    }
  }, [transcription]);

  useEffect(() => {
    if (translation && translationRef.current) {
      const container = translationRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [translation]);

  return (
    <div className="flex flex-col gap-2 overflow-hidden grow">
      <div className="flex gap-2 items-center px-2">
        <div className="flex-1">
          <LanguageSelector
            disabled={isRecording}
            current={sourceLanguage}
            exclude={targetLanguage}
            onChange={handleSourceLanguageChange} 
          />
        </div>
        <button
          className="w-5 h-5 transition-transform duration-500 ease-in-out"
          onClick={handleSwap}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <CircleIcon className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <LanguageSelector
            disabled={isRecording}
            current={targetLanguage}
            exclude={sourceLanguage}
            onChange={handleTargetLanguageChange}
          />
        </div>
      </div>
      <div className="relative flex flex-col gap-1 overflow-hidden flex-1">
        <div className={cn("flex-1 flex flex-col gap-2 overflow-hidden pt-2 px-3 pb-4 bg-blue-100 rounded-[17px] dark:bg-blue-600", isBlocksSwapped && "order-2")}>
          <div className="flex items-center gap-2 text-grey-400 dark:text-white-100/70 text-xs">
            <VolumeGradientIcon className="w-4 h-4" />
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="range-input"
            />
            {sourceLanguage.name}
          </div>
          <div className={cn("dark:text-white-100/90 text-sm text-dark-200 overflow-auto", !isSidebar && 'max-h-40 h-full')} ref={transcriptionRef}>
            {transcription}
          </div>
        </div>
        <div className={cn("flex-1 flex flex-col gap-2 overflow-hidden pt-2 px-3 pb-4 bg-blue-100 rounded-[17px] dark:bg-blue-600", !isBlocksSwapped && "order-2")}>
          <div className="flex items-center gap-2 text-grey-400 dark:text-white-100/70 text-xs">
            <VolumeIcon className="w-4 h-4" />
            {targetLanguage.name}
          </div>
          <div className={cn("dark:text-white-100/90 text-sm text-dark-200 overflow-auto", !isSidebar && 'max-h-40 h-full')} ref={translationRef}>
            {translation}
          </div>
        </div>
        <button
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] flex justify-center items-center bg-white dark:bg-dark-100 rounded-full"
          onClick={handleSwapPosition}
        >
          <SwitchVerticalIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="w-full px-2">
        {isRecording ? (
          <button
            className="flex w-full bg-red-400 justify-between items-center p-1 rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStopRecording}
            disabled={!accessToken}
          >
            <div className="w-[31px] h-[31px] flex justify-center items-center rounded-full bg-white text-red-400 dark:bg-dark-100">
              <StopIcon className="w-[17px] h-[17px]" />
            </div>
            <div className="font-medium text-base dark:text-dark-100 text-white">
              {getMessage("stop")}
            </div>
            <div className="pr-2">
              <ArrowsIcon className="dark:text-dark-100 text-white w-5" />
            </div>
          </button>
        ) : (
          <button
            className="flex w-full bg-blue-300 justify-between items-center p-1 rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleStartRecording}
            disabled={!accessToken || typeof balance !== "number"}
          >
            <div className="w-[31px] h-[31px] flex justify-center items-center rounded-full bg-white text-blue-300 dark:bg-dark-100">
              <PlayIcon className="w-[17px] h-[17px]" />
            </div>
            <div className="font-medium text-base dark:text-dark-100 text-white">
              {isReady ? getMessage("resume") : getMessage("start")}
            </div>
            <div className="pr-2">
              <ArrowsIcon className="dark:text-dark-100 text-white w-5" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
