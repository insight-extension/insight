import { left, mapLeft, tryCatch } from "fp-ts/lib/TaskEither";
import { pipe } from "fp-ts/lib/function";
import { Socket, io } from "socket.io-client";
import { P, match } from "ts-pattern";

import { generateBearerToken } from "@repo/shared/api";
import { SubscriptionType } from "@repo/shared/constants";
import { Observable, isTokenExpired } from "@repo/shared/utils";

import { ConnectionStatus, WEBSOCKET_URL } from "@/constants";

import { MessageType, PCM_PROCESSOR_MODULE, SAMPLE_RATE } from "./constants";
import {
  AccessTokenRequiredError,
  AudioProcessingError,
  CaptureAudioStreamError,
  ConnectionError,
  InvalidAudioDataError,
  MessageError,
  ResumeAudioProcessingError,
  UnexpectedMessageTypeError,
  WebSocketError
} from "./errors";
import type {
  ObservableEventCallbackMap,
  WebSocketEventCallbackMap
} from "./types";
import { MessageCodec } from "./validation";

export class AudioRecordManager extends Observable<ObservableEventCallbackMap> {
  private webSocket: Socket<WebSocketEventCallbackMap> | null = null;
  private audioContext: AudioContext | null = null;
  private streamSourceNode: MediaStreamAudioSourceNode | null = null;
  private pcmProcessor: AudioWorkletNode | null = null;
  private capturedStream: MediaStream | null = null;

  private paused: boolean = false;

  constructor() {
    super();
  }

  public get isReady(): boolean {
    return Boolean(
      this.capturedStream?.active &&
        this.audioContext &&
        this.streamSourceNode &&
        this.pcmProcessor
    );
  }

  private get isPaused(): boolean {
    return this.paused;
  }

  private set isPaused(value: boolean) {
    this.paused = value;
  }

  private handleWebSocketMessage = (message: any): void => {
    if (this.isPaused) return;

    const validationResult = MessageCodec.decode(JSON.parse(message));

    match(validationResult)
      .with({ right: P.select() }, (message) => {
        match(message)
          .with(
            {
              type: MessageType.TRANSCRIPT,
              transcript: P.intersection(P.string, P.select())
            },
            (transcription: string): void => {
              this.emit("transcription", transcription);
            }
          )
          .with(
            {
              type: MessageType.TRANSLATION,
              translation: P.intersection(P.string, P.select())
            },
            (translation: string): void => {
              this.emit("translation", translation);
            }
          )
          .with(
            {
              type: MessageType.STATUS,
              status: P.intersection(P.nonNullable, P.select())
            },
            (status: ConnectionStatus): void => {
              this.emit("status", status);
            }
          )
          .with(
            {
              type: MessageType.STATUS,
              status: P.intersection(P.nonNullable, P.select())
            },
            (status: ConnectionStatus): void => {
              this.emit("status", status);
            }
          )
          .otherwise(({ type }) =>
            this.handleException(new UnexpectedMessageTypeError(type))
          );
      })
      .with({ left: P.select() }, (errors) => {
        this.emit(
          "error",
          new MessageError(errors.map((error) => error.message).join(", "))
        );
      });
  };

  private handleWebSocketConnection = (): void => {
    this.emit("status", ConnectionStatus.CONNECTED);

    match(this.isReady)
      .with(true, () => {
        this.streamSourceNode!.connect(this.pcmProcessor!);

        this.pcmProcessor!.connect(this.audioContext!.destination);

        this.emit("recording", true);
        this.emit("status", ConnectionStatus.CONNECTED);

        this.isPaused = false;
      })
      .otherwise(this.captureStream);
  };

  private handleException = (error: any): void => {
    this.emit("error", error);

    // todo: review logic
    this.stop();
    // this.reset();
  };

  private handlePCMModuleMessage = (event: any): void => {
    const webSocket = this.webSocket;

    if (!webSocket || !webSocket.connected || this.isPaused) return;

    match(event.data)
      .with(P.instanceOf(ArrayBuffer), (audioData) => {
        webSocket.emit(MessageType.AUDIO_DATA, audioData);
      })
      .otherwise(() =>
        this.handleException(new InvalidAudioDataError(event.data))
      );
  };

  public handleDisconnect(): void {
    // todo: complete logic
  }

  private captureStream = (): void => {
    // todo: complete logic for different tabs
    chrome.tabCapture.capture({ audio: true, video: false }, (stream) => {
      match(stream)
        .with(P.instanceOf(MediaStream), (stream) => {
          this.capturedStream = stream;

          this.initProcessing(stream);
        })
        .otherwise(() =>
          this.handleException(
            new CaptureAudioStreamError(chrome.runtime.lastError?.message ?? "")
          )
        );
    });
  };

  private initWebSocketConnection(
    accessToken: string,
    subscriptionType: SubscriptionType
  ): void {
    if (
      accessToken &&
      isTokenExpired({
        token: accessToken
      })
    ) {
      //todo: review logic
      this.emit("refreshToken");

      return;
    }

    this.webSocket = io(WEBSOCKET_URL, {
      transports: ["polling", "websocket"],
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: generateBearerToken(accessToken),
            Subscription: subscriptionType,
            "Accept-Language": "en-US" // todo: dynamic language
          }
        }
      }
    });

    this.webSocket.on("connect", this.handleWebSocketConnection);
    this.webSocket.on("connect_error", (error) =>
      this.handleException(new ConnectionError(error.message))
    );
    this.webSocket.on("message", this.handleWebSocketMessage);
    this.webSocket.on("disconnect", this.handleDisconnect);
    this.webSocket.on("error", (error) => {
      this.handleException(new WebSocketError(error.message));
    });
  }

  private initProcessing(stream: MediaStream): void {
    pipe(
      tryCatch(
        async () => {
          this.audioContext = new AudioContext({
            sampleRate: SAMPLE_RATE
          });

          await this.audioContext.audioWorklet.addModule(
            PCM_PROCESSOR_MODULE.source
          );

          this.pcmProcessor = new AudioWorkletNode(
            this.audioContext,
            PCM_PROCESSOR_MODULE.name
          );
          this.pcmProcessor.port.onmessage = this.handlePCMModuleMessage;

          this.streamSourceNode =
            this.audioContext.createMediaStreamSource(stream);

          this.streamSourceNode.connect(this.audioContext.destination);
          this.streamSourceNode.connect(this.pcmProcessor);

          this.emit("recording", true);
        },
        (error: any) => left(new AudioProcessingError(error.message))
      ),
      mapLeft(this.handleException)
    )();
  }

  public stop(): void {
    // todo: review usage
    this.webSocket?.emit("stop", {
      type: MessageType.STOP
    });

    this.webSocket?.disconnect();

    this.pcmProcessor?.disconnect();

    this.emit("recording", false);
    this.emit("status", ConnectionStatus.DISCONNECTED);

    this.isPaused = true;
  }

  public destroy(): void {
    this.stop();

    this.capturedStream?.getTracks().forEach((track) => track.stop());
    this.streamSourceNode?.disconnect();
    this.audioContext?.close();
  }

  // todo: review usage
  private reset(): void {
    this.destroy();

    this.audioContext = null;
    this.streamSourceNode = null;
    this.pcmProcessor = null;
    this.capturedStream = null;
  }

  public start(
    accessToken: string | null,
    subscriptionType: SubscriptionType
  ): void {
    if (!accessToken) {
      this.emit("error", new AccessTokenRequiredError());

      return;
    }

    this.emit("status", ConnectionStatus.CONNECTING);

    this.initWebSocketConnection(accessToken, subscriptionType);
  }

  // todo: use for restart after error handling
  // public restart(): void {
  //   this.emit("status", ConnectionStatus.CONNECTING);
  //   this.emit("error", null);

  //   this.initWebSocketConnection();
  // }

  public resume(
    accessToken: string | null,
    subscriptionType: SubscriptionType
  ): void {
    if (!accessToken) {
      this.emit("error", new AccessTokenRequiredError());

      return;
    }

    this.emit("error", null);
    this.emit("status", ConnectionStatus.CONNECTING);

    this.initWebSocketConnection(accessToken, subscriptionType);

    match(this.isReady)
      .with(true, () => {
        this.streamSourceNode!.connect(this.pcmProcessor!);

        this.pcmProcessor!.connect(this.audioContext!.destination);

        this.emit("recording", true);
        this.emit("status", ConnectionStatus.CONNECTED);

        this.isPaused = false;
      })
      .otherwise(() => this.handleException(new ResumeAudioProcessingError()));
  }
}
