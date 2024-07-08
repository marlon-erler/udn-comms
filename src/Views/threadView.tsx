import * as React from "bloatless-react";

import { Message, deleteMessage, messages } from "../model";

import { translation } from "../translations";

const messageConverter: React.ListItemConverter<Message> = (message) => {
  function copyMessage() {
    navigator.clipboard.writeText(message.body);
  }

  function remove() {
    deleteMessage(message);
  }

  return (
    <div class="tile width-100 flex-no padding-0">
      <div class="flex-column">
        <div class="flex-row justify-apart align-center secondary">
          <span class="padding-h">
            {message.sender}@{message.channel}
          </span>
          <span>
            <button aria-label={translation.copyMessage} on:click={copyMessage}>
              <span class="icon">content_copy</span>
            </button>
            <button aria-label={translation.deleteMessage} on:click={remove}>
              <span class="icon">delete</span>
            </button>
          </span>
        </div>
        <div class="flex-column padding">
          <b>{message.body}</b>
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
