import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import {
  PublicClientApplication,

} from "@azure/msal-browser";
import { AuthProvider } from "./AuthProvider";

const msalConfig = {
  auth: {
    clientId: "77e006f2-732b-4079-a92f-177bec212f01",
    authority:
      "https://login.microsoftonline.com/07420c3d-c141-4c67-b6f3-f448e5adb67b",
    redirectUri: "https://adaptpaas-client.azurewebsites.net",
    loginScopes: ["User.Read"],
  },
};

const msalInstance = new PublicClientApplication(msalConfig);




ReactDOM.render(
  <React.StrictMode>
    <AuthProvider msalPublicClientApp={msalInstance} loginScopes={ ["User.Read"]}>
    <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
