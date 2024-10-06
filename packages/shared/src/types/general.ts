import { z } from "zod";

import { StatusSchema } from "@repo/shared/validation";

export interface StatusResponse extends z.infer<typeof StatusSchema> {}
