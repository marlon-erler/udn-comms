import * as React from "bloatless-react";

export const storageKeys = {
  hasUnread(id: string): string {
    return id + "has-unread-messages";
  },

  primaryChannel(id: string): string {
    return id + "primary-channel";
  },

  secondaryChannels(id: string): string {
    return id + "secondary-channels";
  },

  encyptionKey(id: string): string {
    return id + "encryption-key";
  },

  messages(id: string): string {
    return id + "messages";
  },

  objects(id: string): string {
    return id + "items";
  },

  outbox(id: string): string {
    return id + "outbox";
  },

  itemOutbox(id: string): string {
    return id + "item-outbox";
  },

  composingMessage(id: string): string {
    return id + "composing-message";
  },
};

export const stringToOptionTag: React.StateItemConverter<string> = (value) => {
  return <option>{value}</option>;
};
