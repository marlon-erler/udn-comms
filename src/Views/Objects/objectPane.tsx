import * as React from "bloatless-react";

import {
  Chat,
  MessageObject,
  MessageObjectWithIndex,
} from "../../Model/chatModel";
import { getRawObjectIndex, stringToOptionTag } from "../../utility";
import { objectFilterInput, previousObjectSearches } from "../../Model/model";

import { AllObjectsView } from "./allObjectsView";
import { CalendarView } from "./calendarView";
import { KanbanView } from "./kanbanView";
import { NoteObjectsView } from "./noteObjectsView";
import { ObjectDetailModal } from "./objectDetailModal";
import { ObjectGridView } from "./objectGridView";
import { StatusView } from "./statusView";
import { icons } from "../../icons";
import { translation } from "../../translations";

export const viewTypes = {
  all: [translation.viewAll, "grid_view"],
  notes: [translation.viewNotes, icons.noteContent],
  calendar: [translation.viewCalendar, icons.date],
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
  const appliedFilter = new React.State("");
  const resultCount = new React.State(0);
  const resultText = React.createProxyState([appliedFilter, resultCount], () =>
    translation.searchTitleText(appliedFilter.value, resultCount.value)
  );
  const visibleMessageObjects = new React.MapState<MessageObjectWithIndex>();
  const isFilterEmpty = React.createProxyState(
    [appliedFilter],
    () => appliedFilter.value == ""
  );

  function resetFilter() {
    objectFilterInput.value = "";
    applyFilter();
  }

  function applyFilter() {
    appliedFilter.value = objectFilterInput.value;
    if (!previousObjectSearches.value.has(appliedFilter.value))
      previousObjectSearches.add(appliedFilter.value);

    const allObjects = [...chat.objects.value.values()];
    allObjects.forEach((messageObject, i) => {
      const doesMatch = checkIfMatchesFilter(messageObject);
      if (doesMatch) {
        visibleMessageObjects.set(messageObject.id, new MessageObjectWithIndex(messageObject));
      } else {
        visibleMessageObjects.remove(messageObject.id);
      }
    });
    resultCount.value = visibleMessageObjects.value.size;
  }

  chat.objects.handleAddition((messageObject) => {
    if (checkIfMatchesFilter(messageObject) == false) return;
    visibleMessageObjects.set(messageObject.id, new MessageObjectWithIndex(messageObject));
    chat.objects.handleRemoval(messageObject, () => {
      visibleMessageObjects.remove(messageObject.id);
    });
  });

  function checkIfMatchesFilter(messageObject: MessageObject) {
    if (isFilterEmpty.value == true) return true;

    const stringsInObject: string[] = [];
    const objectTitle = messageObject.title || translation.untitledObject;
    stringsInObject.push(objectTitle);

    const latest = chat.getMostRecentContent(messageObject);
    if (latest) {
      Object.values(latest).forEach((value) => {
        if (typeof value != "string") return;
        stringsInObject.push(value);
      });
    }

    const wordsOfObject = stringsInObject
      .map((string) => string.toLowerCase().split(" "))
      .flat();

    const wordsOfSearchTerm = appliedFilter.value.toLowerCase().split(" ");
    for (const word of wordsOfSearchTerm) {
      if (word[0] == "-") {
        // exclusion
        const wordContent = word.substring(1);
        if (wordsOfObject.includes(wordContent)) return false;
      } else {
        return wordsOfObject.includes(word);
      }
    }

    return true;
  }

  applyFilter();

  // sorting
  visibleMessageObjects.subscribe((visibleMessageObjects) => {
    let indices = [...visibleMessageObjects.values()]
      .map((messageObject) => {
        const latest = chat.getMostRecentContent(messageObject);
        return getRawObjectIndex(latest);
      })
      .sort();

    visibleMessageObjects.forEach((messageObject) => {
      const latest = chat.getMostRecentContent(messageObject);
      messageObject.index.value = indices.indexOf(getRawObjectIndex(latest));
    });
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
        case "calendar":
          return CalendarView;
        default:
          return AllObjectsView;
      }
    }

    return getViewFunction()(
      chat,
      visibleMessageObjects,
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

      <div class="modal" toggle:open={isShowingFilterModel}>
        <div style="max-width: 2084px">
          <main class="gap">
            <h2>{translation.filterObjects}</h2>

            <div class="flex-column">
              <label class="tile">
                <span class="icon">search</span>
                <div>
                  <span>{translation.searchTitle}</span>
                  <input
                    bind:value={objectFilterInput}
                    on:enter={applyFilter}
                    placeholder={translation.searchPlaceholder}
                    list="object-searches"
                  ></input>
                  <datalist
                    hidden
                    id="object-searches"
                    children:append={[
                      previousObjectSearches,
                      stringToOptionTag,
                    ]}
                  ></datalist>
                </div>
              </label>
            </div>
            <div class="flex-row width-input">
              <button
                class="width-50 flex"
                on:click={resetFilter}
                toggle:disabled={isFilterEmpty}
              >
                {translation.reset}
              </button>
              <button class="width-50 flex primary" on:click={applyFilter}>
                {translation.search}
                <span class="icon">arrow_forward</span>
              </button>
            </div>

            <hr></hr>

            <b class="secondary" subscribe:innerText={resultText}></b>

            {ObjectGridView(
              chat,
              visibleMessageObjects,
              selectedObject,
              isShowingObjectModal
            )}
          </main>
          <button on:click={closeFilters}>
            {translation.close}
            <span class="icon">close</span>
          </button>
        </div>
      </div>
      <div children:set={objectModal}></div>
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
