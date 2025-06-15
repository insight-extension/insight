class PCMPlaybackProcessor extends AudioWorkletProcessor {
  buffer = [];
  speed = 1.15;
  readIndex = 0;
  MAX_BUFFER_SIZE = 65536;
  MIN_BUFFER_BEFORE_PLAY = 4096;

  constructor() {
    super();
    this.port.onmessage = (event) => {
      const int16 = new Int16Array(event.data);
      const float32 = Array.from(int16).map((v) => v / 32768);
      this.buffer.push(...float32);

      if (this.buffer.length > this.MAX_BUFFER_SIZE) {
        this.buffer.splice(0, this.buffer.length - this.MAX_BUFFER_SIZE);
      }
    };
  }

  process(_inputs, outputs) {
    const output = outputs[0];
    const channel = output[0];

    if (this.buffer.length < this.MIN_BUFFER_BEFORE_PLAY) {
      // Заполняем тишиной
      channel.fill(0);
      return true;
    }

    for (let i = 0; i < channel.length; i++) {
      const idx = Math.floor(this.readIndex);
      if (idx < this.buffer.length) {
        channel[i] = this.buffer[idx];
      } else {
        channel[i] = 0;
      }
      this.readIndex += this.speed;
    }

    // Удаляем уже не нужные данные из начала буфера
    const safeIndex = Math.floor(this.readIndex) - 128;
    if (safeIndex > 0) {
      this.buffer.splice(0, safeIndex);
      this.readIndex -= safeIndex;
    }

    return true;
  }
}

registerProcessor("pcm-playback-processor", PCMPlaybackProcessor);
