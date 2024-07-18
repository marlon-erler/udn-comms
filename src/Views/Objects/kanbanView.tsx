import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { RenameView } from "../renameView";

interface KanbanBoard {
  category: string;
  items: React.ListState<KanbanBoardItem>;
}

interface KanbanBoardItem {
  priority: number;
  messageObject: MessageObject;
}

export function KanbanView(
  chat: Chat,
  messageObjects: React.MapState<MessageObject>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const boards = new React.MapState<KanbanBoard>();
  const sortedBoardNames = React.createProxyState([boards], () =>
    [...boards.value.values()]
      .map((board) => board.category)
      .sort((a, b) => a.localeCompare(b))
  );

  messageObjects.handleAddition((messageObject) => {
    const latest = chat.getMostRecentContent(messageObject);
    if (!latest.categoryName) return;

    const categoryName = latest.categoryName!;
    if (!boards.value.has(categoryName)) {
      const listState = new React.ListState<KanbanBoardItem>();
      listState.subscribeSilent(() => {
        if (listState.value.size != 0) return;
        boards.remove(categoryName);
      });

      boards.set(categoryName, {
        category: categoryName,
        items: listState,
      });
    }

    const boardItem: KanbanBoardItem = {
      priority: latest.priority ?? 0,
      messageObject,
    };
    boards.value.get(categoryName)?.items.add(boardItem);

    messageObjects.handleRemoval(messageObject, () => {
      boards.value.get(categoryName)?.items.remove(boardItem);
    });
  });

  const boardToBoardView: React.StateItemConverter<KanbanBoard> = (board) => {
    const view = KanbanBoardView(
      chat,
      board,
      selectedObject,
      isShowingObjectModal
    );
    sortedBoardNames.subscribe((sortedBoardNames) => {
      view.style.order = sortedBoardNames.indexOf(board.category);
    });
    return view;
  };

  return (
    <div
      class="flex-row large-gap width-100 height-100 scroll-v scroll-h padding"
      children:append={[boards, boardToBoardView]}
    ></div>
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
    kanbanBoard.items.value.forEach((kanbanBoardItem) => {
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

    const newContent = chat.createObjectContent();
    newContent.categoryName = kanbanBoard.category;
    chat.updateObjectContent(messageObject, newContent);
    chat.addObjectAndSend(messageObject);
  }

  const itemToViewEntry: React.StateItemConverter<KanbanBoardItem> = (
    kanbanBoardItem
  ) => {
    const view = ObjectEntryView(
      chat,
      kanbanBoardItem.messageObject,
      selectedObject,
      isShowingObjectModal
    );
    view.style.order = kanbanBoardItem.priority * -1;
    return view;
  };

  return (
    <div
      class="flex-column flex-no object-entry-wide"
      on:dragover={dragOver}
      on:drop={drop}
    >
      {RenameView(editingCategory, kanbanBoard.category, renameBoard)}
      <hr></hr>
      <div
        class="flex-column gap padding-bottom"
        children:append={[kanbanBoard.items, itemToViewEntry]}
      ></div>
    </div>
  );
}
