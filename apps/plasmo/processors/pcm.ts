class PCMProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
  }

  process(
    inputs: Float32Array[][],
    _outputs: Float32Array[][],
    _parameters: Record<string, Float32Array>
  ): boolean {
    const audioInput = inputs[0]

    if (audioInput && audioInput.length > 0) {
      const monoChannelData = audioInput[0] // Mono audio data

      // Convert Float32Array to Int16Array (PCM S16 LE)
      const pcmInt16Buffer = new Int16Array(monoChannelData.length)

      for (let i = 0; i < monoChannelData.length; i++) {
        const clampedSample = Math.max(-1, Math.min(1, monoChannelData[i]))

        pcmInt16Buffer[i] =
          clampedSample < 0 ? clampedSample * 0x8000 : clampedSample * 0x7fff
      }

      // Send the PCM data to the main thread
      this.port.postMessage(pcmInt16Buffer.buffer, [pcmInt16Buffer.buffer])
    }

    return true
  }
}

registerProcessor("pcm-processor", PCMProcessor)
