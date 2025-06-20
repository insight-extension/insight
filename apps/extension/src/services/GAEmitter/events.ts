export const GA_EVENTS = {
  START_TRANSLATION: "start_translation",
  RESUME_TRANSLATION: "resume_translation",
  STOP_TRANSLATION: "stop_translation",
  RETRY_TRANSLATION: "retry_translation"
} as const;

export type GAEvent = (typeof GA_EVENTS)[keyof typeof GA_EVENTS];
