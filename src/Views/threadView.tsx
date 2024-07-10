import * as React from "bloatless-react";

import { Chat, ChatMessage } from "../Model/chatModel";

import { translation } from "../translations";

export function ThreadView(chat: Chat) {
  const messageConverter: React.StateItemConverter<ChatMessage> = (message) => {
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

  const outboxMessageConverter: React.StateItemConverter<ChatMessage> = (
    message
  ) => {
    function remove() {
      chat.deleteOutboxMessage(message);
    }

    return (
      <div class="tile width-100 flex-no padding-0">
        <div class="flex-column">
          <div class="flex-row justify-apart align-center">
            <b class="error padding-h">{translation.messageInOutbox}</b>
            <span class="flex-row secondary">
              <button aria-label={translation.deleteMessage} on:click={remove}>
                <span class="icon">delete</span>
              </button>
            </span>
          </div>
          <div class="flex-column padding-h padding-bottom">
            <b class="break-word">{message.body}</b>
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

  const messageList = (
    <div
      class="flex-column gap"
      children:append={[chat.messages, messageConverter]}
    ></div>
  );
  const outboxList = (
    <div
      class="flex-column gap"
      children:append={[chat.outbox, outboxMessageConverter]}
    ></div>
  );
  const listWrapper = (
    <div class="thread-view flex-column gap">
      {messageList}
      {outboxList}
    </div>
  );

  function scrollToBottom() {
    const scrollFromBottom =
      listWrapper.scrollHeight -
      (listWrapper.scrollTop + listWrapper.offsetHeight);
    if (scrollFromBottom > 400) return;

    listWrapper.scrollTop = listWrapper.scrollHeight;
  }

  chat.messages.handleAddition(scrollToBottom);
  chat.outbox.handleAddition(scrollToBottom);
  setTimeout(() => (listWrapper.scrollTop = listWrapper.scrollHeight), 50);

  return listWrapper;
}
