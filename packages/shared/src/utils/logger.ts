/* eslint-disable no-console */

class ConsoleLogger {
  private static instance: ConsoleLogger;

  private isEnabled: boolean = true;

  public static getInstance(): ConsoleLogger {
    if (!ConsoleLogger.instance) {
      ConsoleLogger.instance = new ConsoleLogger();
    }

    return ConsoleLogger.instance;
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
  }

  public log(name: string, value: any): void {
    if (!this.isEnabled) {
      return;
    }

    console.log(`[${name}]`, value);
  }

  public trace(name: string, value: any): void {
    if (!this.isEnabled) {
      return;
    }

    console.trace(`[${name}]`, value);
  }

  public table(name: string, data: any): void {
    if (!this.isEnabled) {
      return;
    }

    console.table(data, [`[${name}]`]);
  }

  public error(name: string, error: Error | unknown): void {
    if (!this.isEnabled) {
      return;
    }

    console.error(`[${name}]`, error);
  }

  public warn(name: string, message: string): void {
    if (!this.isEnabled) {
      return;
    }

    console.warn(`[${name}]`, message);
  }

  public info(name: string, message: string): void {
    if (!this.isEnabled) {
      return;
    }

    console.info(`[${name}]`, message);
  }

  public group(name: string): void {
    if (!this.isEnabled) {
      return;
    }

    console.group(`[${name}]`);
  }

  public groupEnd(): void {
    if (!this.isEnabled) {
      return;
    }

    console.groupEnd();
  }

  public time(name: string): void {
    if (!this.isEnabled) {
      return;
    }

    console.time(`[${name}]`);
  }

  public timeEnd(name: string): void {
    if (!this.isEnabled) {
      return;
    }

    console.timeEnd(`[${name}]`);
  }
}

export const consoleLogger = Object.freeze(ConsoleLogger.getInstance());
