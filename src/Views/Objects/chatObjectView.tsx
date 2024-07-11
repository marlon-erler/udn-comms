import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectDetailModal } from "./objectDetailModal";
import { ObjectListEntry } from "./objectListEntry";
import { translation } from "../../translations";

export function ChatObjectView(chat: Chat) {
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

  function createObject() {
    const newObject = chat.createObjectFromTitle(translation.untitledObject);
    chat.addObjectAndSend(newObject);
    selectedObject.value = newObject;
    isShowingObjectModal.value = true;
  }

  const objectConverter: React.StateItemConverter<MessageObject> = (
    messageObject
  ) => {
    function select() {
      selectedObject.value = messageObject;
      isShowingObjectModal.value = true;
    }

    return ObjectListEntry(messageObject, select);
  };

  return (
    <div class="chat-object-view flex-column">
      <div class="flex-row align-center scroll-h border-bottom">
        <button
          class="primary"
          on:click={createObject}
          aria-label={translation.createObject}
        >
          <span class="icon">add</span>
        </button>
      </div>

      <div
        class="grid gap padding"
        style="grid-template-columns: repeat(auto-fill, minmax(250px, 1fr))"
        children:prepend={[chat.objects, objectConverter]}
      ></div>

      <div children:set={objectModal}></div>
    </div>
  );
}
