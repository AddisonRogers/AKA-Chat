import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ErrorProvider} from "./providers/errorProvider.tsx";
import {McpProvider} from "./providers/mcpProvider.tsx";
import {getCurrentWindow} from "@tauri-apps/api/window";

const queryClient = new QueryClient()

const appWindow = getCurrentWindow();

document
    .getElementById('titlebar-minimize')
    ?.addEventListener('click', () => appWindow.minimize());
document
    .getElementById('titlebar-maximize')
    ?.addEventListener('click', () => appWindow.toggleMaximize());
document
    .getElementById('titlebar-close')
    ?.addEventListener('click', () => appWindow.close());

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ErrorProvider>
                <McpProvider>
                    <App/>
                </McpProvider>
            </ErrorProvider>
        </QueryClientProvider>
    </StrictMode>,
);
