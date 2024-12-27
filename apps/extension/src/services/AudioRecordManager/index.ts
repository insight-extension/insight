import { io, Socket } from "socket.io-client";
import { tryCatch } from "fp-ts/lib/Either";
import { match, P } from "ts-pattern";

import { SubscriptionType } from "@repo/ui/constants";

import {
  AudioProcessingError,
  AccessTokenRequiredError,
  MessageError,
  UnexpectedMessageTypeError,
  CaptureAudioStreamError,
  ConnectionError,
} from "./errors";
import {
  ConnectionStatus,
  EmitMessageType,
  MessageType,
  PCM_PROCESSOR_MODULE,
  SAMPLE_RATE,
  SocketEvent,
} from "./constants";
import { MessageCodec } from "./validation";

export class RecordAudioManager {
  private socketClient: Socket | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private pcmProcessor: AudioWorkletNode | null = null;
  private capturedStream: MediaStream | null = null;

  private _status: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private _recording: boolean = false;
  private _transcription: string = "";
  private _translation: string = "";

  constructor(
    private accessToken: string | null,
    private subscriptionType: SubscriptionType
  ) {}

  public async setupSocketConnection(): Promise<void> {
    this.status = ConnectionStatus.CONNECTING;
    //TODO:REVIEW IT
    // this.transcription = "";
    // this.translation = "";

    match(this.accessToken)
      .with(P.string, () => {
        this.socketClient = io(
          process.env.PLASMO_PUBLIC_WEBSOCKET_URL as string,
          {
            transports: ["websocket"],
            extraHeaders: {
              Authorization: `Bearer ${this.accessToken}`,
              Subscription: this.subscriptionType,
            },
          }
        );

        this.setupSocketEventsListeners();

        this.status = ConnectionStatus.CONNECTED;

        //TODO:REVIEW IT
        // this.recording = true;
      })
      .otherwise(() => {
        this.status = ConnectionStatus.DISCONNECTED; // or  this.cleanup();

        throw new AccessTokenRequiredError();
      });
  }

  private setupSocketEventsListeners(): void {
    if (!this.socketClient) return;

    this.socketClient.on(SocketEvent.CONNECT, () => {
      // see docs: https://sunnyzhou-1024.github.io/chrome-extension-docs/extensions/tabCapture.html
      chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
        match(stream)
          .with(P.instanceOf(MediaStream), (stream) => {
            this.capturedStream = stream;

            this.setupAudioProcessing(stream);
          })
          .otherwise(() => {
            this.cleanup();

            throw new CaptureAudioStreamError(
              chrome.runtime.lastError?.message || ""
            );
          });
      });
    });

    this.socketClient.on(SocketEvent.CONNECT_ERROR, (error) => {
      this.cleanup();

      throw new ConnectionError(error.message);
    });

    this.socketClient.on(SocketEvent.MESSAGE, (message) => {
      const validationResult = MessageCodec.decode(JSON.parse(message));

      match(validationResult)
        .with({ right: P.select() }, (message) => {
          match(message)
            .with(
              {
                type: MessageType.TRANSCRIPT,
                transcript: P.intersection(P.string, P.select()),
              },
              (transcript) => (this.transcription += ` ${transcript}`)
            )
            .with(
              {
                type: MessageType.TRANSLATION,
                translation: P.intersection(P.string, P.select()),
              },
              (translation) => (this.translation += ` ${translation}`)
            )
            .with(
              { type: MessageType.STATUS, status: P.select() },
              (status) => (this.status = status)
            )
            .otherwise(() => {
              throw new UnexpectedMessageTypeError(message.type);
            });
        })
        .with({ left: P.select() }, (errors) => {
          throw new MessageError(errors.join(", "));
        })
        .exhaustive();
    });

    this.socketClient.on(SocketEvent.DISCONNECT, () => {
      this.cleanup();
    });
  }

  public stopAudioCapture(): void {
    this.socketClient?.emit(EmitMessageType.STOP, {
      type: EmitMessageType.STOP,
    });

    this.socketClient?.disconnect();
    this.socketClient?.removeAllListeners();
    this.socketClient = null;

    this.capturedStream?.getTracks().forEach((track) => track.stop());
    this.capturedStream = null;

    this.sourceNode?.disconnect();
    this.sourceNode = null;

    this.pcmProcessor?.disconnect();
    this.pcmProcessor = null;

    this.audioContext?.close();
    this.audioContext = null;

    this.cleanup();
  }

  private setupPCMProcessorMessageListener(): void {
    if (
      !this.pcmProcessor ||
      !this.socketClient ||
      !this.socketClient.connected
    )
      return;

    this.pcmProcessor.port.onmessage = (event) => {
      const audioData = new Uint8Array(event.data);

      this.socketClient!.emit(EmitMessageType.AUDIO_DATA, audioData);
    };
  }

  private async setupAudioProcessing(stream: MediaStream): Promise<void> {
    tryCatch(
      async () => {
        this.audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });

        await this.audioContext.audioWorklet.addModule(
          PCM_PROCESSOR_MODULE.source
        );

        this.sourceNode = this.audioContext.createMediaStreamSource(stream);

        this.pcmProcessor = new AudioWorkletNode(
          this.audioContext,
          PCM_PROCESSOR_MODULE.name
        );

        this.audioContext.resume();

        this.sourceNode.connect(this.audioContext.destination);
        this.sourceNode.connect(this.pcmProcessor);

        this.setupPCMProcessorMessageListener();
      },
      (error: any) => {
        this.cleanup();

        throw new AudioProcessingError(error.message);
      }
    );
  }

  private cleanup(): void {
    this.recording = false;
    this.status = ConnectionStatus.DISCONNECTED;
  }

  public get status(): ConnectionStatus {
    return this._status;
  }

  private set status(value: ConnectionStatus) {
    this._status = value;
  }

  public get recording(): boolean {
    return this._recording;
  }

  private set recording(value: boolean) {
    this._recording = value;
  }

  public get transcription(): string {
    return this._transcription;
  }

  private set transcription(value: string) {
    this._transcription = value;
  }

  public get translation(): string {
    return this._translation;
  }

  private set translation(value: string) {
    this._translation = value;
  }
}

// todo: complete class and refactor App component
// reuse in Shared package
// remove extra files

//READ
// https://www.reddit.com/r/typescript/comments/16w3iwn/opinions_about_effectts_do_you_recommend_using_it/
// When I say it's extremely powerful, I mean EXTREMELY powerful. here is a non exhaustive list of tools I dropped entirely thanks to effect making them redundant, inadequate, or useless. (All are great tools btw, not dissing them)

// lodash/ramda/remeda/fp-ts/similar

// express/koa/h3/other servers

// react-query

// redux/xstate/jotai/zustand/other state management

// rxjs

// purify-ts

// date-fns and similar

// inversify

// zod/typebox/yup/joi/and so on

// all stream related libs

// axios/got/ky/superagent/similar

// I think you've misunderstood the library. You're not meant to use what you don't like or need. Effect provides a lot and people just assume you have to use all of it or none of it. That is wrong. BTW, effect is "effectively" now just fp-ts, since they have already joined projects and forces. You can't say effect is too much abstract when tons of projects need and use something like fp-ts. I initially started using Effect just to get a Result type (Either, later Effect) I liked. Nothing more nothing less. And it's tree shakeable because everything is just composed of small functions, so no need to worry that effect is "big". It's as big as you want it to be.
