import * as React from "bloatless-react";

import { ChatModel } from "../../Model/chatModel";

export function ChatEntry(chatModel: ChatModel) {
  return (
    <div class="tile flex-column justify-end align-start">
      <h2>{chatModel.info.primaryChannel}</h2>
    </div>
  );
}

export const ChatModelToChatEntry: React.StateItemConverter<ChatModel> = (
  chatModel: ChatModel
) => {
  return ChatEntry(chatModel);
};
