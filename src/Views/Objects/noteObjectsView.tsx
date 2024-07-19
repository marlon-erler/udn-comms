import * as React from "bloatless-react";

import { Chat, MessageObject, MessageObjectWithIndex } from "../../Model/chatModel";

import { ObjectGridView } from "./objectGridView";

export function NoteObjectsView(
  chat: Chat,
  messageObjects: React.MapState<MessageObjectWithIndex>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const notes = new React.ListState<MessageObject>();
  messageObjects.handleAddition((messageObject) => {
    const latest = chat.getMostRecentContent(messageObject);
    if (!latest.noteContent) return;

    notes.add(messageObject);
    messageObjects.handleRemoval(messageObject, () =>
      notes.remove(messageObject)
    );
  });

  return <div class="width-100 height-100 scroll-v padding">
    {ObjectGridView(chat, notes, selectedObject, isShowingObjectModal)}
  </div>;
}
