import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";

const storedTheme = window.localStorage.getItem("theme-preference");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const useDarkTheme = storedTheme ? storedTheme === "dark" : prefersDark;

if (useDarkTheme) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
