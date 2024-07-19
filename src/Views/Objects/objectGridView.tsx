import * as React from "bloatless-react";

import { Chat, MessageObject, MessageObjectWithIndex } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";

export function ObjectGridView(
  chat: Chat,
  messageObjects:
    | React.ListState<MessageObjectWithIndex>
    | React.MapState<MessageObjectWithIndex>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const objectConverter: React.StateItemConverter<MessageObjectWithIndex> = (
    messageObject
  ) => {
    return ObjectEntryView(
      chat,
      messageObject,
      selectedObject,
      isShowingObjectModal
    );
  };

  return (
    <div
      class="grid gap"
      style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));"
      children:prepend={[messageObjects, objectConverter]}
    ></div>
  );
}
