import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectGridView } from "./objectGridView";
import { translation } from "../../translations";

export function NoteObjectsView(
  chat: Chat,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
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
    ObjectGridView(
      chat,
      notes,
      selectedObject,
      isShowingObjectModal,
      translation.noNotes
    )
  );

  return <div class="width-100 height-100" children:set={content}></div>;
}
