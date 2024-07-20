import "./chatEntry.css";

import * as React from "bloatless-react";

import { ChatModel } from "../../Model/chatModel";

export function ChatEntry(chatModel: ChatModel) {
  return (
    <button class="chat-entry tile">
      <span class="shadow">{chatModel.info.primaryChannel}</span>
      <h2>{chatModel.info.primaryChannel}</h2>
    </button>
  );
}

export const ChatModelToChatEntry: React.StateItemConverter<ChatModel> = (
  chatModel: ChatModel
) => {
  return ChatEntry(chatModel);
};
