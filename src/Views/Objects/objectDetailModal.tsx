import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { icons } from "../../icons";
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

  // properties
  const didEditContent = new React.State(false);
  const editingNoteContent = React.createProxyState(
    [selectedMessageObject],
    () => selectedMessageObject.value.noteContent ?? ""
  );
  const editingCategory = React.createProxyState(
    [selectedMessageObject],
    () => selectedMessageObject.value.categoryName ?? ""
  );
  const editingDate = React.createProxyState(
    [selectedMessageObject],
    () => selectedMessageObject.value.date ?? ""
  );
  const editingTime = React.createProxyState(
    [selectedMessageObject],
    () => selectedMessageObject.value.time ?? ""
  );
  const editingPriority = React.createProxyState(
    [selectedMessageObject],
    () => selectedMessageObject.value.priority ?? 0
  );
  React.bulkSubscribe(
    [
      editingNoteContent,
      editingCategory,
      editingDate,
      editingTime,
      editingPriority,
    ],
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
        priority: editingPriority.value,
        categoryName: editingCategory.value,
        date: editingDate.value,
        time: editingTime.value,
      });
    }

    chat.addObjectAndSend(messageObject);
    closeModal();
  }

  function deleteAndClose() {
    chat.deleteObject(messageObject);
    closeModal();
  }

  const input = (
    <input
      bind:value={editingTitle}
      placeholder={translation.objectTitlePlaceholder}
    ></input>
  );
  isPresented.subscribe(() => setTimeout(() => input.focus(), 100));

  return (
    <div class="modal" toggle:open={isPresented} on:keydown={handleKeyDown}>
      <div>
        <main>
          <h2>{chat.getObjectTitle(messageObject)}</h2>
          <span class="secondary">{messageObject.id}</span>

          <hr></hr>

          <div class="flex-column gap">
            <label class="tile">
              <span class="icon">{icons.objectTitle}</span>
              <div>
                <span>{translation.objectTitle}</span>
                {input}
              </div>
            </label>

            <hr></hr>

            <label class="tile">
              <span class="icon">{icons.objectHistory}</span>
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

            <hr></hr>

            <label class="tile">
              <span class="icon">{icons.noteContent}</span>
              <div>
                <span>{translation.note}</span>
                <textarea
                  rows="5"
                  bind:value={editingNoteContent}
                  placeholder={translation.noteContentPlaceholder}
                ></textarea>
              </div>
            </label>

            <label class="tile">
              <span class="icon">{icons.categoryName}</span>
              <div>
                <span>{translation.category}</span>
                <input
                  bind:value={editingCategory}
                  placeholder={translation.categoryPlaceholder}
                ></input>
              </div>
            </label>

            <label class="tile">
              <span class="icon">{icons.priority}</span>
              <div>
                <span>{translation.priority}</span>
                <input
                  type="number"
                  bind:value={editingPriority}
                  placeholder={translation.priorityPlaceholder}
                ></input>
              </div>
            </label>

            <hr></hr>

            <label class="tile">
              <span class="icon">{icons.date}</span>
              <div>
                <span>{translation.date}</span>
                <input type="date" bind:value={editingDate}></input>
              </div>
            </label>

            <label class="tile">
              <span class="icon">{icons.time}</span>
              <div>
                <span>{translation.time}</span>
                <input type="time" bind:value={editingTime}></input>
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
