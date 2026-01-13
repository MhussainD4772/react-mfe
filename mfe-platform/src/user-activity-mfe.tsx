import React from "react";
import { createRoot, type Root } from "react-dom/client";
import App, { type AuthContext } from "./App";

class UserActivityMfeElement extends HTMLElement {
  private root: Root | null = null;

  private tenantId: string = "";
  private _authContext: AuthContext | null = null;
  private _bffBaseUrl: string = "";

  static get observedAttributes() {
    return ["tenant-id"];
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    if (name === "tenant-id") {
      this.tenantId = newValue ?? "";
      this.renderReact();
    }
  }

  set authContext(value: AuthContext | null) {
    this._authContext = value;
    this.renderReact();
  }

  get authContext() {
    return this._authContext;
  }

  set bffBaseUrl(value: string) {
    this._bffBaseUrl = value;
    this.renderReact();
  }

  get bffBaseUrl() {
    return this._bffBaseUrl;
  }

  connectedCallback() {
    if (!this.root) {
      this.root = createRoot(this);

      this.dispatchEvent(
        new CustomEvent("mfe:ready", { bubbles: true, composed: true })
      );
    }

    this.renderReact();
  }

  private emitAction(type: string, payload: Record<string, unknown> = {}) {
    this.dispatchEvent(
      new CustomEvent("mfe:action", {
        bubbles: true,
        composed: true,
        detail: { type, payload },
      })
    );
  }

  private renderReact() {
    if (!this.root) return;

    this.root.render(
      <React.StrictMode>
        <App
          tenantId={this.tenantId}
          authContext={this._authContext}
          bffBaseUrl={this._bffBaseUrl}
          emitAction={(type, payload) => this.emitAction(type, payload ?? {})}
        />
      </React.StrictMode>
    );
  }
}

customElements.define("user-activity-mfe", UserActivityMfeElement);
