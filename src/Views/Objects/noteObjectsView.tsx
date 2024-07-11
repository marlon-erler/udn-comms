import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { translation } from "../../translations";

export function NoteObjectsView(
  chat: Chat,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const objectConverter: React.StateItemConverter<MessageObject> = (
    messageObject
  ) => {
    const latest = chat.getMostRecentContent(messageObject);

    function select() {
      selectedObject.value = messageObject;
      isShowingObjectModal.value = true;
    }

    return (
      <button class="tile" on:click={select}>
        <div>
          <b>{messageObject.title}</b>
          <span class="secondary ellipsis">
            {latest.noteContent!.split("\n")[0]}
          </span>
        </div>
      </button>
    );
  };

  const notes = new React.ListState<MessageObject>();
  chat.objects.subscribe(() => {
    notes.clear();
    chat.objects.value.forEach((messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      if (!latest.noteContent) return;

      notes.add(messageObject);
    });
  });

  const content = React.createProxyState([chat.objects], () =>
    notes.value.size == 0 ? (
      <div class="flex-column width-100 height-100 align-center justify-center secondary">
        {translation.noNotes}
      </div>
    ) : (
      <div
        class="grid gap padding"
        style="grid-template-columns: repeat(auto-fill, minmax(350px, 1fr))"
        children:prepend={[notes, objectConverter]}
      ></div>
    )
  );

  return <div class="width-100 height-100" children:set={content}></div>;
}
