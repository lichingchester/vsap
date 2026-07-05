import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// No <StrictMode> on purpose: it double-invokes effects in dev, which would
// make one-shot GSAP reveals play twice. The harness wants to see the true,
// single-mount behaviour of a pasted component.
createRoot(document.getElementById("root")!).render(<App />);
