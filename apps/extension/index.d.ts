declare namespace NodeJS {
  interface ProcessEnv {
    PLASMO_PUBLIC_GTAG_ID?: string;
    PLASMO_PUBLIC_API_URL?: string;
    PLASMO_PUBLIC_UI_URL?: string;
    PLASMO_PUBLIC_WEBSOCKET_URL?: string;
  }
}

interface Window {
  dataLayer: Array;
  gtag: (a: string, b: any, c?: any) => void;
}
