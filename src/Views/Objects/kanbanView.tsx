import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { ObjectGridView } from "./objectGridView";
import { PlaceholderView } from "./placeholderView";
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

  const content = React.createProxyState([chat.objects], () =>
    boards.value.size == 0 ? (
      PlaceholderView()
    ) : (
      <div class="flex-row large-gap width-100 height-100 scroll-v scroll-h padding">
        {...[...boards.value.values()]
          .sort((a, b) => a.title.localeCompare(b.title))
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
  const editingBoardTitle = new React.State(kanbanBoard.title);
  const isEditing = new React.State(false);
  const cannotRename = React.createProxyState(
    [editingBoardTitle],
    () =>
      editingBoardTitle.value == kanbanBoard.title ||
      editingBoardTitle.value == ""
  );

  function renameBoard() {
    kanbanBoard.items.forEach((messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      latest.categoryName = editingBoardTitle.value;
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
    latest.categoryName = kanbanBoard.title;
    chat.addObjectAndSend(messageObject);
  }

  const titleInput = (
    <input bind:value={editingBoardTitle} on:enter={renameBoard}></input>
  );

  return (
    <div
      class="flex-column flex-no"
      style="min-width: 280px"
      on:dragover={dragOver}
      on:drop={drop}
    >
      <div class="flex-row align-center justify-apart">
        {titleInput}
        <button
          class="primary"
          aria-label={translation.rename}
          on:click={renameBoard}
          toggle:disabled={cannotRename}
        >
          <span class="icon">edit</span>
        </button>
      </div>
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
