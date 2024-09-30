// pcm-processor.js

class PCMProcessor extends AudioWorkletProcessor {
    constructor() {
      super();
    }
  
    process(inputs, outputs, parameters) {
      const input = inputs[0];
      if (input.length > 0) {
        const channelData = input[0]; // Моно звук
        // Преобразуем Float32Array в Int16Array (PCM S16 LE)
        const int16Buffer = new Int16Array(channelData.length);
        for (let i = 0; i < channelData.length; i++) {
          let s = Math.max(-1, Math.min(1, channelData[i]));
          int16Buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        // Отправляем данные в основной поток
        this.port.postMessage(int16Buffer.buffer, [int16Buffer.buffer]);
      }
      return true;
    }
  }

  registerProcessor('pcm-processor', PCMProcessor);
  