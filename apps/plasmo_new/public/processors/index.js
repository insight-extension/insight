/// <reference path="../types/audio-worklet.d.ts" />
import { PCMProcessor } from "./pcm";
// Регистрируем процессор
registerProcessor("pcm-processor", PCMProcessor);
// class PcmProcessor extends AudioWorkletProcessor {
//     process(inputs, outputs, parameters) {
//       // Обработка аудио данных
//       // Отправка данных через port.postMessage
//       return true;
//     }
//   }
//   registerProcessor('pcm-processor', PcmProcessor);
