import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import { Provider } from "react-redux";
import { store } from "./store";
import enTranslations from "@shopify/polaris/locales/en.json";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AppProvider i18n={enTranslations}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppProvider>
  </Provider>
);
