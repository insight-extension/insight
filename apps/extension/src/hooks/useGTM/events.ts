export const GTM_EVENTS = {
  START_TRANSLATION: "start_translation",
  RESUME_TRANSLATION: "resume_translation",
  STOP_TRANSLATION: "stop_translation",
  RETRY_TRANSLATION: "retry_translation"
} as const;

export type GTMEvent = (typeof GTM_EVENTS)[keyof typeof GTM_EVENTS];
