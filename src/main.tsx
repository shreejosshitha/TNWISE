
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./i18n";  // Initialize i18n
import "./utils/initDummyData";  // Initialize dummy data

createRoot(document.getElementById("root")!).render(<App />);
  