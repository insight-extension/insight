class PCMPlaybackProcessor extends AudioWorkletProcessor {
  buffer = [];
  MAX_BUFFER_SIZE = 65536;
  MIN_BUFFER_BEFORE_PLAY = 2048; // Minimum buffer size before playback starts

  constructor() {
    super();
    this.port.onmessage = (event) => {
      const int16 = new Int16Array(event.data);
      const float32 = Array.from(int16).map((v) => v / 32768);
      this.buffer.push(...float32);

      // Overflow protection
      if (this.buffer.length > this.MAX_BUFFER_SIZE) {
        this.buffer.splice(0, this.buffer.length - this.MAX_BUFFER_SIZE);
      }
    };
  }

  process(_inputs, outputs) {
    const output = outputs[0];
    const channel = output[0]; // mono

    // If the buffer is not yet filled enough, fill with silence
    if (this.buffer.length < this.MIN_BUFFER_BEFORE_PLAY) {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = 0;
      }
      return true;
    }

    for (let i = 0; i < channel.length; i++) {
      channel[i] = this.buffer.length > 0 ? this.buffer.shift() : 0;
    }

    return true;
  }
}

registerProcessor("pcm-playback-processor", PCMPlaybackProcessor);
