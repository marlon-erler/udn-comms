import * as React from "bloatless-react";

import { Chat, ChatMessage } from "../Model/chatModel";

import { translation } from "../translations";

export function ThreadView(chat: Chat) {
  const messageConverter: React.ListItemConverter<ChatMessage> = (message) => {
    function resendMessage() {
      chat.resendMessage(message);
    }

    function copyMessage() {
      navigator.clipboard.writeText(message.body);
    }

    function decrypt() {
      chat.decryptReceivedMessage(message);
    }

    function remove() {
      chat.deleteMessage(message);
    }

    const messageBody = React.createProxyState(
      [chat.messages],
      () => message.body
    );

    return (
      <div class="tile width-100 flex-no padding-0">
        <div class="flex-column">
          <div class="flex-row justify-apart align-center secondary">
            <span class="padding-h ellipsis">
              <b class="info">{message.sender}</b>
            </span>
            <span class="flex-row">
              <button
                aria-label={translation.resendMessage}
                on:click={resendMessage}
                toggle:disabled={chat.cannotResendMessage}
              >
                <span class="icon">replay</span>
              </button>
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
            <b class="break-word" subscribe:innerText={messageBody}></b>
            <span class="secondary">
              <b>{new Date(message.isoDate).toLocaleString()}</b>
              <br></br>
              {message.channel}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const listElement = (
    <div
      class="flex-column gap"
      children:append={[chat.messages, messageConverter]}
    ></div>
  );
  chat.messages.handleAddition(() => {
    const scrollFromBottom =
      listElement.scrollHeight -
      (listElement.scrollTop + listElement.offsetHeight);
    if (scrollFromBottom > 400) return;

    listElement.scrollTop = listElement.scrollHeight;
  });
  setTimeout(() => (listElement.scrollTop = listElement.scrollHeight), 50);
  return listElement;
}
