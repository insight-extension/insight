import { EventHandler } from "./types";

export class Observable<EVENTS extends Record<string, EventHandler>> {
  private _observers: Map<keyof EVENTS, Set<EventHandler>> = new Map();

  /**
   * Adds an event listener for the specified event.
   * @param eventName The name of the event.
   * @param handler The callback function for the event.
   */
  on<K extends keyof EVENTS>(eventName: K, handler: EVENTS[K]): void {
    if (!this._observers.has(eventName)) {
      this._observers.set(eventName, new Set());
    }

    this._observers.get(eventName)!.add(handler);
  }

  /**
   * Removes an event listener for the specified event.
   * @param eventName The name of the event.
   * @param handler The callback function to remove.
   */
  off<K extends keyof EVENTS>(eventName: K, handler: EVENTS[K]): void {
    const handlers = this._observers.get(eventName);

    if (handlers) {
      handlers.delete(handler);

      if (handlers.size === 0) {
        this._observers.delete(eventName);
      }
    }
  }

  /**
   * Triggers all listeners for the specified event.
   * @param eventName The name of the event.
   * @param args The arguments to pass to the event listeners.
   */
  emit<K extends keyof EVENTS>(
    eventName: K,
    ...args: Parameters<EVENTS[K]>
  ): void {
    const handlers = this._observers.get(eventName);

    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
  }

  /**
   * Clears all event listeners for the specified event or all events.
   * @param eventName Optional. The name of the event to clear. If omitted, all events are cleared.
   */
  clear<K extends keyof EVENTS>(eventName?: K): void {
    if (eventName) {
      this._observers.delete(eventName);
    } else {
      this._observers.clear();
    }
  }
}
