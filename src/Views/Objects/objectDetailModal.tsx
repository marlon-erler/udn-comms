import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { translation } from "../../translations";

export function ObjectDetailModal(
  chat: Chat,
  messageObject: MessageObject,
  isPresented: React.State<boolean>
) {
  // state
  const editingTitle = new React.State(messageObject.title);

  const selectedMessageObjectId = new React.State(
    chat.getMostRecentContentId(messageObject)
  );
  const selectedMessageObject = React.createProxyState(
    [selectedMessageObjectId],
    () =>
      chat.getObjectContentFromId(messageObject, selectedMessageObjectId.value)
  );

  const didEditContent = new React.State(false);
  const editingNoteContent = React.createProxyState(
    [selectedMessageObject],
    () => selectedMessageObject.value.noteContent ?? ""
  );
  React.bulkSubscribe(
    [editingNoteContent],
    () => (didEditContent.value = true)
  );

  // methods
  function handleKeyDown(e: KeyboardEvent) {
    if (!e.metaKey && !e.ctrlKey) return;

    switch (e.key) {
      case "s":
        e.preventDefault();
        saveAndClose();
        break;
    }
  }

  function closeModal() {
    isPresented.value = false;
  }

  function saveAndClose() {
    messageObject.title = editingTitle.value;

    if (didEditContent.value == true) {
      chat.addObjectContent(messageObject, {
        isoDateVersionCreated: new Date().toISOString(),
        id: React.UUID(),

        noteContent: editingNoteContent.value,
      });
    }

    chat.addObjectAndSend(messageObject);
    closeModal();
  }

  function deleteAndClose() {
    chat.deleteObject(messageObject);
    closeModal();
  }

  return (
    <div class="modal" toggle:open={isPresented} on:keydown={handleKeyDown}>
      <div>
        <main>
          <h2>{messageObject.title}</h2>
          <span class="secondary">{messageObject.id}</span>

          <hr></hr>

          <div class="flex-column gap">
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
                <select bind:value={selectedMessageObjectId}>
                  {...chat
                    .getSortedContents(messageObject)
                    .map((content) => (
                      <option value={content.id}>
                        {new Date(
                          content.isoDateVersionCreated
                        ).toLocaleString()}
                      </option>
                    ))}
                </select>
                <span class="icon">arrow_drop_down</span>
              </div>
            </label>

            <label class="tile">
              <span class="icon">sticky_note_2</span>
              <div>
                <span>{translation.noteContent}</span>
                <textarea
                  rows="5"
                  bind:value={editingNoteContent}
                  placeholder={translation.noteContentPlaceholder}
                ></textarea>
              </div>
            </label>

            <hr></hr>

            <button class="danger width-input" on:click={deleteAndClose}>
              {translation.deleteObject}
              <span class="icon">delete</span>
            </button>
          </div>
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
