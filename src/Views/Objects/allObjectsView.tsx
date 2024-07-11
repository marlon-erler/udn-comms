import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectGridView } from "./objectGridView";
import { translation } from "../../translations";

export function AllObjectsView(
  chat: Chat,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const content = React.createProxyState([chat.objects], () =>
    ObjectGridView(
      chat,
      chat.objects,
      selectedObject,
      isShowingObjectModal
    )
  );

  return <div class="width-100 height-100" children:set={content}></div>;
}
