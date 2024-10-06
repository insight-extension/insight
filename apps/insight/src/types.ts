export enum Connection {
  CONNECTED = "connected",
  CONNECTING = "connecting",
  DISCONNECTED = "disconnected"
}

export interface Language {
  name: string;
  flagCode: string;
}
