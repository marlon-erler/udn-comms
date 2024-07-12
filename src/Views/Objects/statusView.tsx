import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { ObjectEntryView } from "./objectEntryView";
import { RenameView } from "../renameView";

interface CategoryRow {
  category: string;
  statusColumns: React.MapState<StatusColumn>;
}

interface StatusColumn {
  status: string;
  items: React.ListState<StatusCellItem>;
}

interface StatusCellItem {
  priority: number;
  status: string;
  messageObject: MessageObject;
}

// data only
interface StatusData {
  title: string;
  items: MessageObject[];
}

export function StatusView(
  chat: Chat,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const rows = new React.MapState<CategoryRow>();
  const statuses = new React.MapState<StatusData>();
  const sortedStatuses = React.createProxyState([statuses], () =>
    [...statuses.value.values()]
      .map((statusData) => statusData.title)
      .sort((a, b) => a.localeCompare(b))
  );
  const sortedCategoryNames = React.createProxyState([rows], () =>
    [...rows.value.values()]
      .map((row) => row.category)
      .sort((a, b) => a.localeCompare(b))
  );

  chat.objects.subscribe(() => {
    rows.clear();
    statuses.clear();

    // add items
    chat.objects.value.forEach((messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      if (!latest.categoryName || !latest.status) return;

      const category = latest.categoryName;
      const status = latest.status;

      if (!statuses.value.has(status)) {
        statuses.set(status, { title: status, items: [] });
      }
      statuses.value.get(status)!.items.push(messageObject);

      if (!rows.value.has(category)) {
        rows.set(category, {
          category: category,
          statusColumns: new React.MapState(),
        });
      }
      const row = rows.value.get(category)!;

      if (!row.statusColumns.value.has(status)) {
        row.statusColumns.set(status, {
          status: status,
          items: new React.ListState(),
        });
      }
      const column = row.statusColumns.value.get(status)!;

      column.items.add({
        priority: latest.priority ?? 0,
        status,
        messageObject,
      });
    });

    // add status placeholders
    statuses.value.forEach((statusItemList) => {
      rows.value.forEach((row) => {
        if (row.statusColumns.value.has(statusItemList.title)) return;
        row.statusColumns.set(statusItemList.title, {
          status: statusItemList.title,
          items: new React.ListState(),
        });
      });
    });
  });

  const statusDataToHeaderView: React.StateItemConverter<StatusData> = (
    statusData
  ) => {
    const view = StatusHeaderView(chat, statusData);
    sortedStatuses.subscribe(
      () => (view.style.order = sortedStatuses.value.indexOf(statusData.title))
    );
    return view;
  };

  const categoryRowToView: React.StateItemConverter<CategoryRow> = (row) => {
    const view = KanbanRowView(
      chat,
      row,
      sortedStatuses,
      selectedObject,
      isShowingObjectModal
    );
    sortedCategoryNames.subscribe(
      () => (view.style.order = sortedCategoryNames.value.indexOf(row.category))
    );
    return view;
  };

  return (
    <div class="flex-column large-gap width-100 height-100 scroll-v scroll-h padding">
      <div class="flex-row large-gap">
        <div class="flex-column object-entry-wide"></div>
        <div
          class="flex-row large-gap"
          children:append={[statuses, statusDataToHeaderView]}
        ></div>
      </div>
      <div
        class="flex-column large-gap"
        children:append={[rows, categoryRowToView]}
      ></div>
    </div>
  );
}

function StatusHeaderView(chat: Chat, status: StatusData) {
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
  kanbanRow: CategoryRow,
  sortedStatuses: React.State<string[]>,
  selectedObject: React.State<MessageObject | undefined>,
  isShowingObjectModal: React.State<boolean>
) {
  const editingCategory = new React.State(kanbanRow.category);

  function renameCategory() {
    kanbanRow.statusColumns.value.forEach((statusColumns) => {
      statusColumns.items.value.forEach((statusCellItem) => {
        const { messageObject } = statusCellItem;
        const latest = chat.getMostRecentContent(messageObject);
        latest.categoryName = editingCategory.value;
        chat.addObjectAndSend(messageObject);
      });
    });
  }

  const statusColumnToEntryView: React.StateItemConverter<StatusColumn> = (
    statusColumn
  ) => {
    const view = StatusColumnView(
      chat,
      statusColumn.items,
      kanbanRow.category,
      statusColumn.status,
      selectedObject,
      isShowingObjectModal
    );
    sortedStatuses.subscribe(
      () =>
        (view.style.order = sortedStatuses.value.indexOf(statusColumn.status))
    );
    return view;
  };
  return (
    <div class="flex-row flex-no large-gap">
      <div class="flex-row align-start">
        {RenameView(editingCategory, kanbanRow.category, renameCategory)}
      </div>

      <div
        class="flex-row large-gap"
        children:append={[kanbanRow.statusColumns, statusColumnToEntryView]}
      ></div>
    </div>
  );
}

function StatusColumnView(
  chat: Chat,
  items: React.ListState<StatusCellItem>,
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

  const cellItemToEntryView: React.StateItemConverter<StatusCellItem> = (
    cellItem
  ) =>
    ObjectEntryView(
      chat,
      cellItem.messageObject,
      selectedObject,
      isShowingObjectModal
    );

  return (
    <div
      class="flex-column gap object-entry-wide"
      on:dragover={dragOver}
      on:drop={drop}
      children:append={[items, cellItemToEntryView]}
    ></div>
  );
}
