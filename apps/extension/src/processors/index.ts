/// <reference path="../types/audio-worklet.d.ts" />

import { PCMProcessor } from "./pcm";

registerProcessor("pcm-processor", PCMProcessor as any);
