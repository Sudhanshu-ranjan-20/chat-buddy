export type TClientToServerEvents = {
  JOIN_CHANNEL: (
    payload: { channelId: string },
    cb?: (res: { ok: true } | { ok: false; error: string }) => void
  ) => void;
  LEAVE_CHANNEL: (
    payload: { channelId: string },
    cb?: (res: { ok: true } | { ok: false; error: string }) => void
  ) => void;
  MESSAGE_SEND: (
    payload: {
      channelId: string;
      type: "TEXT" | "IMAGE" | "FILE";
      content: any;
      clientMsgId?: string;
    },
    cb?: (res: { ok: true } | { ok: false; error: string }) => void
  ) => void;
  TYPING_START: (
    payload: { channelId: string },
    cb?: (res: { ok: true } | { ok: false; error: string }) => void
  ) => void;
  TYPING_STOP: (
    payload: { channelId: string },
    cb?: (res: { ok: true } | { ok: false; error: string }) => void
  ) => void;
};

export type TServerToClientEvents = {
  MESSAGE_NEW: (paylaod: {
    id: string;
    channelId: string;
    authorId: string;
    authorUsername: string;
    type: "TEXT" | "IMAGE" | "FILE";
    content: any;
    createdAt: string;
    clientMsgId?: string;
  }) => void;

  TYPING: (payload: {
    channelId: string;
    userId: string;
    username: string;
    isTyping: boolean;
  }) => void;
};
