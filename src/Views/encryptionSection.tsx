import * as React from "bloatless-react";

import { encryptionKey } from "../model";
import { translation } from "../translations";

const shouldShowKey = new React.State(false);
const inputType = React.createProxyState([shouldShowKey], () =>
  shouldShowKey.value ? "text" : "password"
);

export function EncryptionSection() {
  return (
    <div>
      <h2>{translation.encryption}</h2>
      <label class="tile">
        <span class="icon">key</span>
        <div>
          <span>{translation.encryptionKey}</span>
          <input
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
