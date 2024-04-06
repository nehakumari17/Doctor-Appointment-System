import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./authentication/store.jsx";
import { Toaster } from "react-hot-toast";


createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="top-center" />
    </Provider>
  </React.StrictMode>
);