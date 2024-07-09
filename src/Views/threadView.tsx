import * as React from "bloatless-react";

import { Chat, ChatMessage } from "../Model/chatModel";

import { translation } from "../translations";

export function ThreadView(chat: Chat) {
  const messageConverter: React.ListItemConverter<ChatMessage> = (message) => {
    function copyMessage() {
      navigator.clipboard.writeText(message.body);
    }

    function decrypt() {
      chat.decryptReceivedMessage(message);
    }

    function remove() {
      chat.deleteMessage(message);
    }

    return (
      <div class="tile width-100 flex-no padding-0">
        <div class="flex-column">
          <div class="flex-row justify-apart align-center secondary">
            <span class="padding-h ellipsis">
              <b class="info">{message.sender}</b> - {message.channel}
            </span>
            <span class="flex-row">
              <button
                aria-label={translation.copyMessage}
                on:click={copyMessage}
              >
                <span class="icon">content_copy</span>
              </button>
              <button
                aria-label={translation.decryptMessage}
                on:click={decrypt}
              >
                <span class="icon">key</span>
              </button>
              <button aria-label={translation.deleteMessage} on:click={remove}>
                <span class="icon">delete</span>
              </button>
            </span>
          </div>
          <div class="flex-column padding-h padding-bottom">
            <b class="break-word">{message.body}</b>
            <span class="secondary">
              {new Date(message.isoDate).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      class="flex-column gap"
      children:append={[chat.messages, messageConverter]}
    ></div>
  );
}
