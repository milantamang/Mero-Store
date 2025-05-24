import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from "react-router-dom";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import TokenHandler from "./utils/TokenHandler.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <TokenHandler />
      <App />
      <ToastContainer
        autoClose={1500} // Time before auto-close (milliseconds)
        hideProgressBar={false} // Show/hide the progress bar (true = hide, false = show)
        newestOnTop={false} // Show newest toast on top (true = top, false = bottom)
        closeOnClick={true} // Close toast when clicked (true = yes, false = no)
        pauseOnHover={true} // Pause timer when mouse hovers (true = pause, false = continue)
        draggable={true} // Allow dragging to dismiss (true = yes, false = no)
      />
    </BrowserRouter>
  </Provider>
);
