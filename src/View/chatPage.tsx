import "./homePage.css";

import * as React from "bloatless-react";

import ChatViewModel from "../ViewModel/chatViewModel";
import { translations } from "./translations";

export function ChatPage(chatViewModel: ChatViewModel) {
  return (
    <article id="chat-page">
      <div>
        <div id="ribbon"></div>
        <div id="toolbar"></div>
        <div id="main"></div>
      </div>
    </article>
  );
}
