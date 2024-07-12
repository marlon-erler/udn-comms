import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectGridView } from "./objectGridView";

export function AllObjectsView(
  chat: Chat,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  return (
    <div class="width-100 height-100">
      {ObjectGridView(chat, chat.objects, selectedObject, isShowingObjectModal)}
    </div>
  );
}
