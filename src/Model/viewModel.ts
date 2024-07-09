import * as React from "bloatless-react";

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
export const newChatPrimaryChannelName = new React.State("");
export const newChatSecondaryChannelName = new React.State("");
export const newChatSecondaryChannelNames = new React.ListState<string>();