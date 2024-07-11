import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { translation } from "../../translations";

export function AllObjectsView(
  chat: Chat,
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

  const content = React.createProxyState([chat.objects], () =>
    chat.objects.value.size == 0 ? (
      <div class="flex-column width-100 height-100 align-center justify-center secondary">
        {translation.noObjects}
      </div>
    ) : (
      <div
        class="grid gap padding"
        style="grid-template-columns: repeat(auto-fill, minmax(350px, 1fr))"
        children:prepend={[chat.objects, objectConverter]}
      ></div>
    )
  );

  return <div class="width-100 height-100" children:set={content}></div>;
}
