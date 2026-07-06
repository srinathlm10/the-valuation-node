import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./App";
import "./index.css";

// vite-react-ssg wires up the router, HelmetProvider, and client bootstrap.
// `createRoot` is invoked automatically in the browser and by the SSG build.
export const createRoot = ViteReactSSG({ routes });
