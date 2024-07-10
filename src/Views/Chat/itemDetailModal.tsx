import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { translation } from "../../translations";

export function ItemDetailModal(
  chat: Chat,
  object: MessageObject,
  isPresented: React.State<boolean>
) {
  function closeModal() {
    isPresented.value = false;
  }

  function saveAndClose() {
    object.title = editingTitle.value;
    chat.objects.set(object.id, object);
    closeModal();
  }

  function deleteAndClose() {
    chat.objects.remove(object.id);
    closeModal();
  }

  const editingTitle = new React.State(object.title);

  return (
    <div class="modal" toggle:open={isPresented}>
      <div>
        <main>
          <h2>{object.title}</h2>

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
