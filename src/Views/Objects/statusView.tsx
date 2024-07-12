import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { PlaceholderView } from "./placeholderView";
import { RenameView } from "../renameView";
import { translation } from "../../translations";

interface KanbanRow {
  category: string;
  statusColumns: Map<string, StatusColumn>;
}

interface StatusColumn {
  title: string;
  items: StatusCellItem[];
}

interface StatusCellItem {
  priority: number;
  status: string;
  messageObject: MessageObject;
}

interface StatusItemList {
  title: string;
  items: MessageObject[];
}

export function StatusView(
  chat: Chat,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const rows = new React.MapState<KanbanRow>();
  const statuses = new Map<string, StatusItemList>();

  chat.objects.subscribe(() => {
    rows.clear();
    statuses.clear();

    // add items
    chat.objects.value.forEach((messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      if (!latest.categoryName || !latest.status) return;

      const category = latest.categoryName;
      const status = latest.status;

      if (!statuses.has(status)) {
        statuses.set(status, { title: status, items: [] });
      }
      statuses.get(status)!.items.push(messageObject);

      if (!rows.value.has(category)) {
        rows.set(category, { category: category, statusColumns: new Map() });
      }
      const row = rows.value.get(category)!;

      if (!row.statusColumns.has(status)) {
        row.statusColumns.set(status, { title: status, items: [] });
      }
      const column = row.statusColumns.get(status)!;

      column.items.push({
        priority: latest.priority ?? 0,
        status,
        messageObject,
      });
    });

    // add status placeholders
    statuses.forEach((statusItemList) => {
      rows.value.forEach((row) => {
        if (row.statusColumns.has(statusItemList.title)) return;
        row.statusColumns.set(statusItemList.title, {
          title: statusItemList.title,
          items: [],
        });
      });
    });
  });

  const content = React.createProxyState([chat.objects], () =>
    rows.value.size == 0 ? (
      PlaceholderView()
    ) : (
      <div class="flex-column large-gap width-100 height-100 scroll-v scroll-h padding">
        <div class="flex-row large-gap">
          <div class="flex-column object-entry-wide"></div>
          {...[...statuses.values()]
            .sort((a, b) => a.title.localeCompare(b.title))
            .map((status) => StatusHeaderView(chat, status))}
        </div>
        {...[...rows.value.values()]
          .sort((a, b) => a.category.localeCompare(b.category))
          .map((board) =>
            KanbanRowView(chat, board, selectedObject, isShowingObjectModal)
          )}
      </div>
    )
  );

  return (
    <div class="width-100 height-100 scroll-no" children:set={content}></div>
  );
}

function StatusHeaderView(chat: Chat, status: StatusItemList) {
  const editingStatus = new React.State(status.title);

  function rename() {
    status.items.forEach((messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      if (!latest) return;

      latest.status = editingStatus.value;
      chat.addObject(messageObject);
    });
  }

  return (
    <div class="object-entry-wide">
      {RenameView(editingStatus, status.title, rename)}
      <hr></hr>
    </div>
  );
}

function KanbanRowView(
  chat: Chat,
  kanbanRow: KanbanRow,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const editingCategory = new React.State(kanbanRow.category);

  const cellItemEntries = [...kanbanRow.statusColumns.entries()];

  function renameCategory() {
    kanbanRow.statusColumns.forEach((statusColumns) => {
      statusColumns.items.forEach((statusCellItem) => {
        const { messageObject } = statusCellItem;
        const latest = chat.getMostRecentContent(messageObject);
        latest.categoryName = editingCategory.value;
        chat.addObjectAndSend(messageObject);
      });
    });
  }

  return (
    <div class="flex-row flex-no large-gap">
      <div class="flex-row align-start">
        {RenameView(editingCategory, kanbanRow.category, renameCategory)}
      </div>

      {...cellItemEntries
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map((entry) =>
          StatusColumnView(
            chat,
            entry[1].items,
            kanbanRow.category,
            entry[1].title,
            selectedObject,
            isShowingObjectModal
          )
        )}

      <hr></hr>
    </div>
  );
}

function StatusColumnView(
  chat: Chat,
  items: StatusCellItem[],
  category: string,
  status: string,
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
    latest.status = status;
    latest.categoryName = category;
    chat.addObjectAndSend(messageObject);
  }

  return (
    <div
      class="flex-column gap object-entry-wide"
      on:dragover={dragOver}
      on:drop={drop}
    >
      {...items
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
  );
}
