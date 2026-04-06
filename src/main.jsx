import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./infrastructure/store/store";


  // <StrictMode>
  // </StrictMode>
import { UIProvider } from "./presentation/shared/provider/UIProvider";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <UIProvider>
            <App />
        </UIProvider>
    </Provider>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered with scope:', registration.scope);
    }).catch(registrationError => {
      console.log('SW registration failed:', registrationError);
    });
  });
}
