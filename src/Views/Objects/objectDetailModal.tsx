import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { translation } from "../../translations";

export function ObjectDetailModal(
  chat: Chat,
  messageObject: MessageObject,
  isPresented: React.State<boolean>
) {
  function closeModal() {
    isPresented.value = false;
  }

  function saveAndClose() {
    messageObject.title = editingTitle.value;
    chat.updateObject(messageObject.id, {});
    closeModal();
  }

  function deleteAndClose() {
    chat.deleteObject(messageObject);
    closeModal();
  }

  const editingTitle = new React.State(messageObject.title);

  return (
    <div class="modal" toggle:open={isPresented}>
      <div>
        <main>
          <h2>{messageObject.title}</h2>

          <div>
            <label class="tile">
              <span class="icon">label</span>
              <div>
                <span>{translation.objectTitle}</span>
                <input
                  bind:value={editingTitle}
                  placeholder={translation.objectTitlePlaceholder}
                ></input>
              </div>
            </label>
          </div>

          <hr></hr>

          <button class="danger" on:click={deleteAndClose}>
            {translation.deleteObject}
            <span class="icon">delete</span>
          </button>
        </main>

        <div class="flex-row">
          <button class="flex-1 width-100 danger" on:click={closeModal}>
            {translation.discard}
          </button>
          <button class="flex-1 width-100 primary" on:click={saveAndClose}>
            {translation.save}
            <span class="icon">save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
