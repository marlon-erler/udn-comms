import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectGridView } from "./objectGridView";
import { translation } from "../../translations";

export function AllObjectsView(
  chat: Chat,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const objectCount = React.createProxyState(
    [chat.objects],
    () => chat.objects.value.size
  );

  return (
    <div class="width-100 height-100 scroll-v padding-top">
      <b class="secondary padding">
        {translation.objectsInTotal}{" "}
        <span subscribe:innerText={objectCount}></span>
      </b>
      {ObjectGridView(chat, chat.objects, selectedObject, isShowingObjectModal)}
    </div>
  );
}
