import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "@data/storage/storeRx/globalStore/store";

  // <StrictMode>
  // </StrictMode>
createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <App />
    </Provider>
);
