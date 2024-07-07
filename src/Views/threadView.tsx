import * as React from "bloatless-react";

import {
  Message,
  messages,
} from "../model";

const messageConverter: React.ListItemConverter<Message> = (message) => {
  return (
    <div class="tile width-100 flex-no">
      <div class="flex-column">
        <span class="secondary">
          {message.sender}@{message.channel}
        </span>
        <b>{message.body}</b>
        <span class="secondary">
          {new Date(message.isoDate).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export function ThreadView() {
  return (
    <div class="flex-column gap" subscribe:children={[messages, messageConverter]}></div>
  );
}
