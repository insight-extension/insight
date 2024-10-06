import { z } from "zod";

const STATUS = ["success"] as const;

export const StatusSchema = z.object({
  status: z.enum(STATUS),
});
