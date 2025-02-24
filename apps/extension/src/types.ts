export enum Connection {
  CONNECTED = "connected",
  CONNECTING = "connecting",
  DISCONNECTED = "disconnected"
}

export interface Language {
  name: string;
  alpha2: string;
  countryCode: string;
}
