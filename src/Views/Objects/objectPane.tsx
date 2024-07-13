import * as React from "bloatless-react";

import { Chat, MessageObject } from "../../Model/chatModel";

import { AllObjectsView } from "./allObjectsView";
import { KanbanView } from "./kanbanView";
import { NoteObjectsView } from "./noteObjectsView";
import { ObjectDetailModal } from "./objectDetailModal";
import { StatusView } from "./statusView";
import { icons } from "../../icons";
import { translation } from "../../translations";

export const viewTypes = {
  all: [translation.viewAll, "grid_view"],
  notes: [translation.viewNotes, icons.noteContent],
  kanban: [translation.viewKanban, "view_kanban"],
  status: [translation.viewStatus, icons.status],
};

export function ObjectPane(chat: Chat) {
  // selection and modal
  const isShowingObjectModal = new React.State(false);
  const isShowingFilterModel = new React.State(false);

  const selectedObject = new React.State<MessageObject | undefined>(undefined);

  // methods
  function createObject() {
    const newObject = chat.createObjectFromTitle("");
    chat.addObjectAndSend(newObject);
    selectedObject.value = newObject;
    isShowingObjectModal.value = true;
  }

  function showFilters() {
    isShowingFilterModel.value = true;
  }

  function closeFilters() {
    isShowingFilterModel.value = false;
  }

  // filter
  const filterInput = new React.State("");
  const appliedFilter = new React.State("");
  const resultCount = new React.State(0);
  const resultText = React.createProxyState([appliedFilter, resultCount], () =>
    translation.searchTitleText(appliedFilter.value, resultCount.value)
  );
  const messageObjects = new React.MapState<MessageObject>();
  const cannotReset = React.createProxyState(
    [appliedFilter],
    () => appliedFilter.value == ""
  );

  function resetFilter() {
    filterInput.value = "";
    applyFilter();
  }
  function applyFilter() {
    appliedFilter.value = filterInput.value;
  }

  appliedFilter.subscribe((filterTerm) => {
    const allObjects = [...chat.objects.value.entries()];
    const matchingObjects = allObjects.filter(
      (entry) => entry[1].title.indexOf(filterTerm) != -1
    );
    resultCount.value = matchingObjects.length;
    messageObjects.clear();
    matchingObjects.forEach((entry) => messageObjects.set(...entry));
  });

  // view
  const objectModal = React.createProxyState(
    [chat.objects, selectedObject],
    () => {
      if (selectedObject.value == undefined) return <div></div>;

      return ObjectDetailModal(
        chat,
        selectedObject.value,
        isShowingObjectModal
      );
    }
  );

  const mainView = React.createProxyState([chat.viewType], () => {
    function getViewFunction() {
      switch (chat.viewType.value) {
        case "notes":
          return NoteObjectsView;
        case "kanban":
          return KanbanView;
        case "status":
          return StatusView;
        default:
          return AllObjectsView;
      }
    }

    return getViewFunction()(
      chat,
      messageObjects,
      selectedObject,
      isShowingObjectModal
    );
  });

  return (
    <div class="chat-object-view flex-column scroll-no padding-0">
      <div class="flex-row align-center border-bottom">
        <button
          class="primary height-100"
          on:click={createObject}
          aria-label={translation.createObject}
        >
          <span class="icon">add</span>
        </button>

        <div class="padding-sm flex flex-row gap justify-center scroll-h width-100">
          {...Object.keys(viewTypes).map((key: any) =>
            ViewTypeToggle(key, chat.viewType)
          )}
        </div>

        <button
          class="height-100"
          aria-label={translation.filterObjects}
          on:click={showFilters}
        >
          <span class="icon">filter_list</span>
        </button>
      </div>

      <div
        class="object-content width-100 height-100 flex scroll-no"
        children:set={mainView}
      ></div>

      <div children:set={objectModal}></div>
      <div class="modal" toggle:open={isShowingFilterModel}>
        <div>
          <main>
            <h2>{translation.filterObjects}</h2>

            <label class="tile">
              <span class="icon">search</span>
              <div>
                <span>{translation.searchByTitle}</span>
                <input
                  bind:value={filterInput}
                  on:enter={applyFilter}
                  placeholder={translation.searchByTitlePlaceholder}
                ></input>
              </div>
            </label>
            <div class="flex-row width-input">
              <button
                class="width-50 flex"
                on:click={resetFilter}
                toggle:disabled={cannotReset}
              >
                {translation.reset}
              </button>
              <button class="width-50 flex primary" on:click={applyFilter}>
                {translation.search}
                <span class="icon">arrow_forward</span>
              </button>
            </div>

            <hr></hr>

            <span class="secondary" subscribe:innerText={resultText}></span>
          </main>
          <button on:click={closeFilters}>
            {translation.close}
            <span class="icon">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewTypeToggle(
  key: keyof typeof viewTypes,
  selection: React.State<keyof typeof viewTypes>
) {
  const [label, icon] = viewTypes[key];

  function select() {
    selection.value = key;
  }

  const isSelected = React.createProxyState(
    [selection],
    () => selection.value == key
  );

  return (
    <button aria-label={label} on:click={select} toggle:selected={isSelected}>
      <span class="icon">{icon}</span>
    </button>
  );
}
