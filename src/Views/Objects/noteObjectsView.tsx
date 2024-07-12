import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectGridView } from "./objectGridView";

export function NoteObjectsView(
  chat: Chat,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const notes = new React.ListState<MessageObject>();
  chat.objects.handleAddition((messageObject) => {
    const latest = chat.getMostRecentContent(messageObject);
    if (!latest) return;
    if (!latest.noteContent) return;

    notes.add(messageObject);
    chat.objects.handleRemoval(messageObject, () =>
      notes.remove(messageObject)
    );
  });

  return <div class="width-100 height-100 scroll-v">
    {ObjectGridView(chat, notes, selectedObject, isShowingObjectModal)}
  </div>;
}
