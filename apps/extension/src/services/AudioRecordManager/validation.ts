import * as t from "io-ts";

import { codecFromEnum } from "@repo/shared/utils";

import { ConnectionStatus, MessageType } from "./constants";

export const MessageCodec = t.type({
  type: codecFromEnum<MessageType>("MessageType", MessageType),
  transcript: t.union([t.string, t.undefined]),
  translation: t.union([t.string, t.undefined]),
  status: codecFromEnum<ConnectionStatus>("ConnectionStatus", ConnectionStatus),
});
