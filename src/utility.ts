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

  composingMessage(id: string): string {
    return id + "composing-message";
  },
};
