import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

// redux
import { Provider } from "react-redux";
import storeConfig from "./store";

ReactDOM.render(
  <Provider store={storeConfig.store}>
    <App store={storeConfig.store} />
  </Provider>,
  document.getElementById("root")
);
