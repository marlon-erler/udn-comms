import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ChatOptionModal } from "./chatOptionModal";
import { ItemDetailModal } from "./itemDetailModal";
import { translation } from "../../translations";

export function ChatToolView(chat: Chat) {
  const isShowingObjectModal = new React.State(false);
  const selectedObject = new React.State<MessageObject | undefined>(undefined);
  const objectModal = React.createProxyState([selectedObject], () => {
    if (selectedObject.value == undefined) return <div></div>;

    return ItemDetailModal(chat, selectedObject.value, isShowingObjectModal);
  });

  function createItem() {
    chat.addObjectAndSend({
      id: React.UUID(),
      title: "new item",
    });
  }

  const itemConverter: React.StateItemConverter<MessageObject> = (object) => {
    function select() {
      selectedObject.value = object;
      isShowingObjectModal.value = true;
    }

    return <button on:click={select}>{object.title}</button>;
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
