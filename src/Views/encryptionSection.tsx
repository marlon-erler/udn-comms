import * as React from "bloatless-react";

import { encryptionKey, isEncryptionUnavailable } from "../model";

import { translation } from "../translations";

const shouldShowKey = new React.State(false);
const inputType = React.createProxyState([shouldShowKey], () =>
  shouldShowKey.value ? "text" : "password"
);

export function EncryptionSection() {
  return (
    <div>
      <h2>{translation.encryption}</h2>
      <div
        class="error tile margin-bottom"
        toggle:hidden={!isEncryptionUnavailable}
      >
        <span class="icon">warning</span>
        <div>
          <b>{translation.encryptionUnavailableTitle}</b>
          <p>{translation.encryptionUnavailableMessage}</p>
        </div>
      </div>

      <label class="tile">
        <span class="icon">key</span>
        <div>
          <span>{translation.encryptionKey}</span>
          <input
            toggle:disabled={isEncryptionUnavailable}
            bind:value={encryptionKey}
            set:type={inputType}
            placeholder={translation.encryptionKeyPlaceholder}
          ></input>
        </div>
      </label>
      <label class="inline">
        <input type="checkbox" bind:checked={shouldShowKey}></input>
        {translation.showEncryptionKey}
      </label>
    </div>
  );
}
