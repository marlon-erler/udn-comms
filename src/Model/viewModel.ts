import * as React from "bloatless-react";

import { Chat } from "./chatModel";
import { translation } from "../translations";

// connection
export const currentAddress = new React.State("");

export const serverAddress = React.restoreState("socket-address", "");
export const isConnected = new React.State(false);
export const connectionMessage = React.createProxyState([serverAddress], () =>
  translation.connectedTo(serverAddress.value)
);

// misc
export const isEncryptionUnavailable = window.crypto.subtle == undefined;
export const senderName = React.restoreState("sender-name", "");

// chat
export const selectedChat = new React.State<Chat | undefined>(undefined);
