/// <reference path="../types/audio-worklet.d.ts" />

import { PCMProcessor } from "./pcm";

// Регистрируем процессор
registerProcessor("pcm-processor", PCMProcessor as any);