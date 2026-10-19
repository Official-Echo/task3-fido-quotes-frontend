import { App, csrf, staticFiles } from "fresh";
import { type State } from "./utils.ts";
import { loadAppConfig } from "@/config/app_config.ts";

export const app = new App<State>();

app.use(staticFiles());

app.use(csrf());

loadAppConfig();

// Include file-system based routes here
app.fsRoutes();
