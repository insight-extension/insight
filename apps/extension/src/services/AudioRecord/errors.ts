export class AccessTokenRequiredError extends Error {
  constructor() {
    super();

    this.name = "AccessTokenRequiredError";
  }
}

export class CaptureAudioStreamError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "CaptureAudioStreamError";
  }
}

export class ConnectionError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "ConnectionError";
  }
}

export class MessageError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "MessageError";
  }
}

export class AudioProcessingError extends Error {
  constructor(public message: string) {
    super(message);

    this.name = "AudioProcessingError";
  }
}

export class UnexpectedMessageTypeError extends Error {
  constructor(type: string) {
    super(type);

    this.name = "UnexpectedMessageTypeError";
  }
}

export class InvalidAudioDataError extends Error {
  constructor(data: string) {
    super(data);

    this.name = "InvalidAudioDataError";
  }
}

export class ResumeAudioProcessingError extends Error {
  constructor() {
    super();

    this.name = "ResumeAudioProcessingError";
  }
}
