import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectDetailModal } from "./objectDetailModal";
import { ObjectListEntry } from "./objectListEntry";
import { translation } from "../../translations";

export function ChatToolView(chat: Chat) {
  const isShowingObjectModal = new React.State(false);
  const selectedObject = new React.State<MessageObject | undefined>(undefined);
  const objectModal = React.createProxyState(
    [chat.objects, selectedObject],
    () => {
      if (selectedObject.value == undefined) return <div></div>;

      return ObjectDetailModal(
        chat,
        selectedObject.value,
        isShowingObjectModal
      );
    }
  );

  function createItem() {
    const newObject = chat.createObjectFromTitle("New item");
    chat.addObjectAndSend(newObject);
  }

  const itemConverter: React.StateItemConverter<MessageObject> = (
    messageObject
  ) => {
    function select() {
      selectedObject.value = messageObject;
      isShowingObjectModal.value = true;
    }

    return ObjectListEntry(messageObject, select);
  };

  return (
    <div class="chat-tool-view">
      <button on:click={createItem}>+</button>
      <hr></hr>
      <div children:prepend={[chat.objects, itemConverter]}></div>

      <div children:set={objectModal}></div>
    </div>
  );
}
