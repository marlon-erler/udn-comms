import * as React from "bloatless-react";

import {
  arrayToUint8,
  decrypt,
  encrypt,
  generateIV,
  importKey,
  uInt8ToArray,
} from "../cryptUtility";

import UDNFrontend from "udn-frontend";
import { serverAddress } from "./viewModel";
import { translation } from "../translations";

export const UDN = new UDNFrontend();

// CONNECTION
// state
export const isConnected = new React.State(false);
export const currentAddress = new React.State("");

export const cannotDisonnect = React.createProxyState(
  [isConnected],
  () => isConnected.value == false
);

export const cannotConnect = React.createProxyState(
  [serverAddress, currentAddress, isConnected],
  () =>
    serverAddress.value == "" ||
    (currentAddress.value == serverAddress.value && isConnected.value == true)
);

// methods
export function connect(): void {
  if (cannotConnect.value == true) return;
  currentAddress.value = serverAddress.value;
  isConnected.value = false;
  UDN.connect(serverAddress.value);
}

export function disconnect(): void {
  if (cannotDisonnect.value == true) return;
  UDN.disconnect();
}

// LISTENERS
UDN.onconnect = () => {
  isConnected.value = true;
};


UDN.onmessage = (data) => {

};

UDN.ondisconnect = () => {
  isConnected.value = false;
};

// INIT
if (serverAddress.value != "") {
  connect();
}
