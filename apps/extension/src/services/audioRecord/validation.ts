import * as t from "io-ts";

import { codecFromEnum } from "@repo/shared/utils";

import { ConnectionStatus } from "@/constants";

import { MessageType } from "./constants";

export const MessageCodec = t.type({
  type: codecFromEnum<MessageType>("MessageType", MessageType),
  transcript: t.union([t.string, t.undefined]),
  translation: t.union([t.string, t.undefined]),
  status: t.union([
    codecFromEnum<ConnectionStatus>("ConnectionStatus", ConnectionStatus),
    t.undefined
  ])
});
