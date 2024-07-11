import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { AllObjectsView } from "./allObjectsView";
import { NoteObjectsView } from "./noteObjectsView";
import { ObjectDetailModal } from "./objectDetailModal";
import { translation } from "../../translations";

export const viewTypes = {
  all: [translation.viewAll, "grid_view"],
  notes: [translation.viewNotes, "sticky_note_2"],
};

export function ChatObjectView(chat: Chat) {
  // selection and modal
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

  // view type
  const selectedViewType = new React.State<keyof typeof viewTypes>("all");
  const mainView = React.createProxyState([selectedViewType], () => {
    function getViewFunction() {
      switch (selectedViewType.value) {
        case "notes":
          return NoteObjectsView;
        default:
          return AllObjectsView;
      }
    }

    return getViewFunction()(chat, selectedObject, isShowingObjectModal);
  });

  // methods
  function createObject() {
    const newObject = chat.createObjectFromTitle(translation.untitledObject);
    chat.addObjectAndSend(newObject);
    selectedObject.value = newObject;
    isShowingObjectModal.value = true;
  }

  return (
    <div class="chat-object-view flex-column">
      <div class="flex-row align-center border-bottom">
        <button
          class="primary height-100"
          on:click={createObject}
          aria-label={translation.createObject}
        >
          <span class="icon">add</span>
        </button>

        <div class="padding-sm flex flex-row gap justify-center scroll-h width-100">
          {...Object.keys(viewTypes).map((key: any) =>
            ViewTypeToggle(key, selectedViewType)
          )}
        </div>

        <button
          class="height-100"
          on:click={createObject}
          aria-label={translation.createObject}
        >
          <span class="icon">visibility</span>
        </button>
      </div>

      <div
        class="width-100 height-100 flex-1 scroll-h"
        children:set={mainView}
      ></div>

      <div children:set={objectModal}></div>
    </div>
  );
}

function ViewTypeToggle(
  key: keyof typeof viewTypes,
  selection: React.State<keyof typeof viewTypes>
) {
  const [label, icon] = viewTypes[key];

  function select() {
    selection.value = key;
  }

  const isSelected = React.createProxyState(
    [selection],
    () => selection.value == key
  );

  return (
    <button aria-label={label} on:click={select} toggle:selected={isSelected}>
      <span class="icon">{icon}</span>
    </button>
  );
}
