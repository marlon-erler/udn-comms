import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";

export function ObjectGridView(
  chat: Chat,
  messageObjects:
    | React.ListState<MessageObject>
    | React.MapState<MessageObject>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>,
  placeholderText: string
) {
  const objectConverter: React.StateItemConverter<MessageObject> = (
    messageObject
  ) => {
    return ObjectEntryView(
      chat,
      messageObject,
      selectedObject,
      isShowingObjectModal
    );
  };

  return messageObjects.value.size == 0 ? (
    <div class="flex-column width-100 height-100 align-center justify-center secondary">
      {placeholderText}
    </div>
  ) : (
    <div
      class="width-100 grid gap padding scroll-v"
      style="grid-template-columns: repeat(auto-fill, minmax(170px, 1fr))"
      children:prepend={[messageObjects, objectConverter]}
    ></div>
  );
}
