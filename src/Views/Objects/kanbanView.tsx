import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { ObjectGridView } from "./objectGridView";
import { translation } from "../../translations";

interface KanbanBoard {
  title: string;
  items: MessageObject[];
}

export function KanbanView(
  chat: Chat,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const boards = new React.MapState<KanbanBoard>();

  chat.objects.subscribe(() => {
    boards.clear();
    chat.objects.value.forEach((messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      if (!latest.categoryName) return;

      const boardTitle = latest.categoryName;

      if (!boards.value.has(boardTitle))
        boards.set(boardTitle, { title: boardTitle, items: [] });

      boards.value.get(boardTitle)?.items.push(messageObject);
    });
  });

  const content = React.createProxyState([chat.objects], () => (
    <div class="flex-row large-gap width-100 height-100 scroll-v scroll-h padding">
      {...[...boards.value.values()]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((board) =>
          KanbanBoardView(chat, board, selectedObject, isShowingObjectModal)
        )}
    </div>
  ));

  return (
    <div class="width-100 height-100 scroll-no" children:set={content}></div>
  );
}

function KanbanBoardView(
  chat: Chat,
  kanbanBoard: KanbanBoard,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  function dragOver(event: DragEvent) {
    event.preventDefault();
  }

  function drop(event: DragEvent) {
    event.preventDefault();
    var id = event.dataTransfer?.getData("text");
    if (!id) return;

    const messageObject = chat.objects.value.get(id);
    if (!messageObject) return;

    const latest = chat.getMostRecentContent(messageObject);
    latest.categoryName = kanbanBoard.title;

    chat.addObjectAndSend(messageObject);
  }

  return (
    <div
      class="flex-column flex-no"
      style="min-width: 280px"
      on:dragover={dragOver}
      on:drop={drop}
    >
      <b class="flex-row width-100">{kanbanBoard.title}</b>
      <hr></hr>
      <div class="flex-column gap padding-bottom">
        {...kanbanBoard.items.map((messageObject) =>
          ObjectEntryView(
            chat,
            messageObject,
            selectedObject,
            isShowingObjectModal
          )
        )}
      </div>
    </div>
  );
}
