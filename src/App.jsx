import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./app/router";
import { initPostHog } from "./lib/posthog";

initPostHog();

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
