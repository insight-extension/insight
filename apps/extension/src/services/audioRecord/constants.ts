export const PCM_PROCESSOR_MODULE = {
  name: "pcm-processor",
  source: "pcm-processor.js"
};

// todo: review quality of audio
export const SAMPLE_RATE = 16000; // 16kHz

export enum MessageType {
  TRANSCRIPT = "transcript",
  TRANSLATION = "translation",
  STATUS = "status",
  AUDIO_DATA = "audioData",
  STOP = "stop"
}
