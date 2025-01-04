export class QueringTabError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "QueringTabError";
  }
}

export class InvalidTabIdError extends Error {
  constructor() {
    super();

    this.name = "InvalidTabIdError";
  }
}

export class OpeningSidePanelError extends Error {
  constructor(message: string) {
    super(message);

    this.name = "OpeningSidePanelError";
  }
}
