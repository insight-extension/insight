declare class AudioWorkletProcessor {
    constructor();
    process(
      inputs: Float32Array[][],
      outputs: Float32Array[][],
      parameters: Record<string, Float32Array>
    ): boolean;
    readonly port: MessagePort;
  }
  
  declare function registerProcessor(name: string, processorCtor: typeof AudioWorkletProcessor): void;
  