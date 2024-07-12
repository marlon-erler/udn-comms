import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { PlaceholderView } from "./placeholderView";

export function ObjectGridView(
  chat: Chat,
  messageObjects:
    | React.ListState<MessageObject>
    | React.MapState<MessageObject>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
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
    PlaceholderView()
  ) : (
    <div
      class="width-100 max-height-100 grid gap padding scroll-v"
      style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));"
      children:prepend={[messageObjects, objectConverter]}
    ></div>
  );
}
