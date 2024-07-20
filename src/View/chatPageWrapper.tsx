import "./chatPage.css";

import * as React from "bloatless-react";

import ChatListViewModel from "../ViewModel/chatListViewModel";
import { ChatPage } from "./chatPage";

export function ChatPageWrapper(chatListViewModel: ChatListViewModel) {
  const chatPageContent = React.createProxyState(
    [chatListViewModel.selectedChat],
    () => {
      if (chatListViewModel.selectedChat.value == undefined) {
        return <div></div>;
      } else {
        return ChatPage(chatListViewModel.selectedChat.value);
      }
    }
  );
  const isShowingChat = React.createProxyState(
    [chatListViewModel.selectedChat],
    () => chatListViewModel.selectedChat.value != undefined
  );

  return (
    <div
      id="chat-page-wrapper"
      toggle:open={isShowingChat}
      children:set={chatPageContent}
    ></div>
  );
}
