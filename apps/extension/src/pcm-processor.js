class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    console.log("RATTTTTTTTTTTTTTTTTTTTTE", sampleRate);

    this.sampleRate = sampleRate;
  }

  /**
   * Processes audio input data and converts it to PCM Int16 format.
   * 
   * @param inputs - A 2D array of audio channel data. 
   *                 Each element of the outer array represents an input.
   *                 Each input is an array of Float32Array buffers, where each buffer contains audio samples for a channel.
   *                 Example: inputs[0][0] is the audio data for the first channel of the first input.
   * 
   * @param _outputs - A 2D array of Float32Array audio buffers for output (not used here).
   *                   Typically used when modifying or passing audio data downstream.
   * 
   * @param _parameters - An object containing parameter data as Float32Array values (not used here).
   *                      These are usually used for controlling the processor dynamically.
   * 
   * @returns {boolean} Returning `true` keeps the processor alive for future calls.
   */
  process(inputs, _outputs, _parameters) {
    const audioInput = inputs[0];

    if (audioInput && audioInput.length > 0) {
      const monoChannelData = audioInput[0]; // Mono audio data

      // Convert Float32Array to Int16Array (PCM S16 LE)
      const pcmInt16Buffer = new Int16Array(monoChannelData.length);

      for (let i = 0; i < monoChannelData.length; i++) {
        const clampedSample = Math.max(-1, Math.min(1, monoChannelData[i]));

        pcmInt16Buffer[i] =
          clampedSample < 0 ? clampedSample * 0x8000 : clampedSample * 0x7fff;
      }

      // Send the PCM data to the main thread
      this.port.postMessage(pcmInt16Buffer.buffer, [pcmInt16Buffer.buffer]);
    }

    return true;
  }
}

registerProcessor('pcm-processor', PCMProcessor);