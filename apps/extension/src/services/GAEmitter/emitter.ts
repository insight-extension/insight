import { MINUTE } from "@repo/shared/constants";

import { GAEvent } from "./events";

const SESSION_EXPIRATION_IN_MIN = 30; // todo: review that value

const STORAGE_KEY = "sessionData";

class GAEmitter {
  private readonly GA_ENDPOINT: string;
  private readonly DEFAULT_ENGAGEMENT_TIME_IN_MSEC: number;
  private readonly MEASUREMENT_ID: string | undefined;
  private readonly API_SECRET: string | undefined;

  constructor() {
    this.GA_ENDPOINT = "https://www.google-analytics.com/mp/collect";
    this.DEFAULT_ENGAGEMENT_TIME_IN_MSEC = 100;
    this.MEASUREMENT_ID = process.env.PLASMO_PUBLIC_MEASUREMENT_ID;
    this.API_SECRET = process.env.PLASMO_PUBLIC_API_SECRET;
  }

  public async emitEvent(event: GAEvent, data?: any) {
    try {
      await fetch(
        `${this.GA_ENDPOINT}?measurement_id=${this.MEASUREMENT_ID}&api_secret=${this.API_SECRET}`,
        {
          method: "POST",
          body: JSON.stringify({
            client_id: await this.getOrCreateClientId(),
            events: [
              {
                name: event,
                params: {
                  session_id: await this.getOrCreateSessionId(),
                  engagement_time_msec: this.DEFAULT_ENGAGEMENT_TIME_IN_MSEC,
                  ...data
                }
              }
            ]
          })
        }
      );
    } catch {
      // dont need to handle error, it's not critical
    }
  }

  private async getOrCreateSessionId() {
    let { sessionData } = await chrome.storage.session.get(STORAGE_KEY);

    const currentTimeInMs = Date.now();

    if (sessionData && sessionData.timestamp) {
      const durationInMin = (currentTimeInMs - sessionData.timestamp) / MINUTE;

      if (durationInMin > SESSION_EXPIRATION_IN_MIN) {
        sessionData = null;
      } else {
        sessionData.timestamp = currentTimeInMs;
        await chrome.storage.session.set({ sessionData });
      }
    }

    if (!sessionData) {
      sessionData = {
        session_id: currentTimeInMs.toString(),
        timestamp: currentTimeInMs.toString()
      };

      await chrome.storage.session.set({ sessionData });
    }

    return sessionData.session_id;
  }

  private async getOrCreateClientId() {
    // todo: change to plasmo storage
    const result = await chrome.storage.local.get("clientId");

    let clientId = result.clientId;

    if (!clientId) {
      clientId = self.crypto.randomUUID();

      await chrome.storage.local.set({ clientId });
    }

    return clientId;
  }
}

export const gaEmitter = new GAEmitter();
