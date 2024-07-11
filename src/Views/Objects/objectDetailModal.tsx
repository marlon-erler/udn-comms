import * as React from "bloatless-react";

import {
  Chat,
  MessageObject,
  MessageObjectContent,
} from "../../Model/chatModel";

import { translation } from "../../translations";

export function ObjectDetailModal(
  chat: Chat,
  messageObject: MessageObject,
  isPresented: React.State<boolean>
) {
  // state
  const editingTitle = new React.State(messageObject.title);
  const selectedMessageObject = new React.State<MessageObjectContent>(
    chat.getLatestObjectContent(messageObject)
  );

  // methods
  function closeModal() {
    isPresented.value = false;
  }

  function saveAndClose() {
    messageObject.title = editingTitle.value;
    chat.updateObject(messageObject.id, {
      isoDateVersionCreated: new Date().toISOString(),
    });
    closeModal();
  }

  function deleteAndClose() {
    chat.deleteObject(messageObject);
    closeModal();
  }

  return (
    <div class="modal" toggle:open={isPresented}>
      <div>
        <main>
          <h2>{messageObject.title}</h2>
          <span class="secondary">{messageObject.id}</span>

          <hr></hr>

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

          <hr></hr>

          <label class="tile">
            <span class="icon">history</span>
            <div>
              <span>{translation.objectVersion}</span>
              <select>
                {...messageObject.contentVersions.map((content) => (
                  <option>
                    {new Date(content.isoDateVersionCreated).toLocaleString()}
                  </option>
                ))}
              </select>
              <span class="icon">arrow_drop_down</span>
            </div>
          </label>

          <hr></hr>

          <button class="danger width-input" on:click={deleteAndClose}>
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
