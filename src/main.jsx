import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./styles/tailwind.css";
import { getClerkPublishableKey, isClerkConfigured } from "./app/providers/clerk-config";

const storedTheme = window.localStorage.getItem("theme-preference");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const useDarkTheme = storedTheme ? storedTheme === "dark" : prefersDark;

if (useDarkTheme) {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

const appTree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

createRoot(document.getElementById("root")).render(
  isClerkConfigured ? (
    <ClerkProvider publishableKey={getClerkPublishableKey()}>
      {appTree}
    </ClerkProvider>
  ) : (
    appTree
  )
);
