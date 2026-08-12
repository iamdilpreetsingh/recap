import { HashRouter } from "react-router-dom";
import AppRouter from "./router";
import { AppShell } from "./components";

export default function App() {
  return (
    <HashRouter>
      <AppShell>
        <AppRouter />
      </AppShell>
    </HashRouter>
  );
}
