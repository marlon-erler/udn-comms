(() => {
  // node_modules/bloatless-react/index.ts
  function createElement(tagName, attributes = {}, ...children) {
    const element = document.createElement(tagName);
    if (attributes != null)
      Object.entries(attributes).forEach((entry) => {
        const [attributename, value] = entry;
        const [directiveKey, directiveValue] = attributename.split(":");
        switch (directiveKey) {
          case "on": {
            switch (directiveValue) {
              case "enter": {
                element.addEventListener("keydown", (e) => {
                  if (e.key != "Enter") return;
                  value();
                });
                break;
              }
              default: {
                element.addEventListener(directiveValue, value);
              }
            }
            break;
          }
          case "subscribe": {
            if (directiveValue == "children") {
              try {
                const [listState, toElement] = value;
                listState.handleAddition((newItem) => {
                  const child = toElement(newItem, listState);
                  listState.handleRemoval(
                    newItem,
                    () => child.remove()
                  );
                  element.append(child);
                });
              } catch {
                throw `error: cannot process subscribe:children directive because ListItemConverter is not defined. Usage: "subscribe:children={[list, converter]}"; you can find a more detailed example in the documentation`;
              }
            } else {
              const state = value;
              state.subscribe(
                (newValue) => element[directiveValue] = newValue
              );
            }
            break;
          }
          case "bind": {
            const state = value;
            state.subscribe(
              (newValue) => element[directiveValue] = newValue
            );
            element.addEventListener(
              "input",
              () => state.value = element[directiveValue]
            );
            break;
          }
          case "toggle": {
            const state = value;
            state.subscribe(
              (newValue) => element.toggleAttribute(directiveValue, newValue)
            );
            break;
          }
          case "set": {
            const state = value;
            state.subscribe(
              (newValue) => element.setAttribute(directiveValue, newValue)
            );
            break;
          }
          default:
            element.setAttribute(attributename, value);
        }
      });
    children.filter((x) => x).forEach((child) => element.append(child));
    return element;
  }

  // src/translations.ts
  var englishTranslations = {
    // settings
    settings: "Settings",
    // messages
    messages: "Messages"
  };
  var translations = {
    en: englishTranslations
  };
  function getText(key) {
    const language = navigator.language.substring(0, 2);
    if (translations[language]) {
      return translations[language][key];
    }
    return translations.en[key];
  }

  // src/messageTab.tsx
  function MessageTab() {
    return /* @__PURE__ */ createElement("article", { id: "message-tab" }, /* @__PURE__ */ createElement("header", null, getText("messages")));
  }

  // src/settingsTab.tsx
  function SettingsTab() {
    return /* @__PURE__ */ createElement("article", { id: "settings-tab" }, /* @__PURE__ */ createElement("header", null, getText("settings")));
  }

  // src/index.tsx
  document.body.prepend(
    /* @__PURE__ */ createElement("menu", null, /* @__PURE__ */ createElement("a", { class: "tab-link", href: "#settings-tab", active: true }, /* @__PURE__ */ createElement("span", { class: "icon" }, "settings"), getText("settings")), /* @__PURE__ */ createElement("a", { class: "tab-link", href: "#message-tab" }, /* @__PURE__ */ createElement("span", { class: "icon" }, "forum"), getText("messages")))
  );
  document.querySelector("main").append(SettingsTab(), MessageTab());
})();
