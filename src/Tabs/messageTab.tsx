import * as React from "bloatless-react";

import { closeChatView, isShowingObjects, selectedChat, toggleChatTools } from "../Model/model";

import { ChatObjectView } from "../Views/Objects/chatObjectView";
import { ChatOptionModal } from "../Views/Chat/chatOptionModal";
import { MessageComposer } from "../Views/Chat/messageComposer";
import { ThreadView } from "../Views/Chat/threadView";
import { translation } from "../translations";

export function MessageTab() {
  const messageTabContent = React.createProxyState([selectedChat], () => {
    if (selectedChat.value == undefined)
      return (
        <div class="width-100 height-100 flex-column align-center justify-center">
          <span class="secondary">{translation.noChatSelected}</span>
        </div>
      );

    const chat = selectedChat.value;
    const isShowingOptions = new React.State(false);

    function showOptions() {
      isShowingOptions.value = true;
    }

    return [
      <header class="padding-0">
        <span class="flex-row align-center">
          <button aria-label={translation.back} on:click={closeChatView}>
            <span class="icon">arrow_back</span>
          </button>

          <span subscribe:innerText={chat.primaryChannel}></span>
        </span>
        <span>
          <button
            aria-label={translation.showObjects}
            on:click={toggleChatTools}
            toggle:selected={isShowingObjects}
          >
            <span class="icon">deployed_code</span>
          </button>
          <button
            aria-label={translation.showChatOptions}
            on:click={showOptions}
          >
            <span class="icon">tune</span>
          </button>
        </span>
      </header>,

      ChatObjectView(chat),
      ThreadView(chat),

      <footer>{MessageComposer(chat)}</footer>,

      ChatOptionModal(chat, isShowingOptions),
    ];
  });

  return (
    <article
      toggle:showingchattools={isShowingObjects}
      id="message-tab"
      children:set={messageTabContent}
    ></article>
  );
}
