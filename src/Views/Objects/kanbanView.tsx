import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { PlaceholderView } from "./placeholderView";
import { RenameView } from "../renameView";
import { translation } from "../../translations";

interface KanbanBoard {
  category: string;
  items: KanbanBoardItem[];
}

interface KanbanBoardItem {
  priority: number;
  messageObject: MessageObject;
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
        boards.set(boardTitle, { category: boardTitle, items: [] });

      boards.value.get(boardTitle)?.items.push({
        priority: latest.priority ?? 0,
        messageObject,
      });
    });
  });

  const content = React.createProxyState([chat.objects], () =>
    boards.value.size == 0 ? (
      PlaceholderView()
    ) : (
      <div class="flex-row large-gap width-100 height-100 scroll-v scroll-h padding">
        {...[...boards.value.values()]
          .sort((a, b) => a.category.localeCompare(b.category))
          .map((board) =>
            KanbanBoardView(chat, board, selectedObject, isShowingObjectModal)
          )}
      </div>
    )
  );

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
  const editingCategory = new React.State(kanbanBoard.category);

  function renameBoard() {
    kanbanBoard.items.forEach((kanbanBoardItem) => {
      const { messageObject } = kanbanBoardItem;
      const latest = chat.getMostRecentContent(messageObject);
      latest.categoryName = editingCategory.value;
      chat.addObjectAndSend(messageObject);
    });
  }

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
    latest.categoryName = kanbanBoard.category;
    chat.addObjectAndSend(messageObject);
  }

  return (
    <div
      class="flex-column flex-no object-entry-wide"
      on:dragover={dragOver}
      on:drop={drop}
    >
      {RenameView(editingCategory, kanbanBoard.category, renameBoard)}
      <hr></hr>
      <div class="flex-column gap padding-bottom">
        {...kanbanBoard.items
          .sort((a, b) => b.priority - a.priority)
          .map((kanbanBoardItem) =>
            ObjectEntryView(
              chat,
              kanbanBoardItem.messageObject,
              selectedObject,
              isShowingObjectModal
            )
          )}
      </div>
    </div>
  );
}
