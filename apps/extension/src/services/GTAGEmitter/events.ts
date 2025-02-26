export const GTAG_EVENTS = {
  START_TRANSLATION: "start_translation",
  RESUME_TRANSLATION: "resume_translation",
  STOP_TRANSLATION: "stop_translation",
  RETRY_TRANSLATION: "retry_translation"
} as const;

export type GTAGEvent = (typeof GTAG_EVENTS)[keyof typeof GTAG_EVENTS];
