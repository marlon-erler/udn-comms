import * as React from "bloatless-react";

import {
  Message,
  decryptReceivedMessage,
  deleteMessage,
  messages,
} from "../model";

import { translation } from "../translations";

const messageConverter: React.ListItemConverter<Message> = (message) => {
  const messageBody = React.createProxyState([messages], () => message.body);

  function copyMessage() {
    navigator.clipboard.writeText(message.body);
  }

  function decrypt() {
    decryptReceivedMessage(message);
  }

  function remove() {
    deleteMessage(message);
  }

  return (
    <div class="tile width-100 flex-no padding-0">
      <div class="flex-column">
        <div class="flex-row justify-apart align-center secondary">
          <span class="padding-h ellipsis">
            {message.sender}@{message.channel}
          </span>
          <span class="flex-row">
            <button aria-label={translation.copyMessage} on:click={copyMessage}>
              <span class="icon">content_copy</span>
            </button>
            <button aria-label={translation.decryptMessage} on:click={decrypt}>
              <span class="icon">key</span>
            </button>
            <button aria-label={translation.deleteMessage} on:click={remove}>
              <span class="icon">delete</span>
            </button>
          </span>
        </div>
        <div class="flex-column padding-h padding-bottom">
          <b subscribe:innerText={messageBody}></b>
          <span class="secondary">
            {new Date(message.isoDate).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export function ThreadView() {
  return (
    <div
      class="flex-column gap"
      subscribe:children={[messages, messageConverter]}
    ></div>
  );
}
