import * as React from "bloatless-react";

import { MessageObjectContent } from "./Model/chatModel";

export const storageKeys = {
  viewType(id: string): string {
    return id + "view-type";
  },

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

export function getRawObjectIndex(latest: MessageObjectContent): string {
  // date
  const dateString = latest.date || "0000-00-00";
  const [year, month, date] = dateString.split("-")

  // time
  const timeString = latest.time || "00:00";
  const [hour, minute] = timeString.split(":");

  const hourInMinutes = parseInt(hour) * 60;
  const minutesTotal = parseInt(minute) + hourInMinutes;
  const paddedMinutes = minutesTotal.toString().padStart(4, "0")

  // priority
  const priority = latest.priority ?? 0;
  const priorityInverse = 100 - priority;
  const paddedPriority = priorityInverse.toString().padStart(3, "0");

  // final
  return `${year}${month}${date}${paddedMinutes}${paddedPriority}`;
}
