import "./homePage.css";

import * as React from "bloatless-react";

import ChatViewModel from "../ViewModel/chatViewModel";
import { translations } from "./translations";

export function ChatPage(chatViewModel: ChatViewModel) {
  return (
    <article id="chat-page">
      <header>
        <span subscribe:innerText={chatViewModel.primaryChannel}></span>
      </header>
      <div></div>
    </article>
  );
}
