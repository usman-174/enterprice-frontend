import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
console.log({mode:process.env.NODE_ENV});
  axios.defaults.baseURL =process.env.API ||
  "https://enter-price-back.herokuapp.com/api"
  // "http://localhost:8000/api"
  // "https://enter-price-back.herokuapp.com/api"
  axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
