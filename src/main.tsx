import {StrictMode} from "react";
import "./index.css";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ErrorProvider} from "./providers/errorProvider.tsx";
import {McpProvider} from "./providers/mcpProvider.tsx";
import {RouterProvider, createRouter} from '@tanstack/react-router'

// Import the generated route tree
import {routeTree} from './routeTree.gen'
import { createRoot } from "react-dom/client";
import {LLMSettingsProvider} from "./providers/llmProvider.tsx";
import {setupTitlebarListeners} from "./lib/titleBar.ts";

// Create a new router instance
const router = createRouter({routeTree})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const queryClient = new QueryClient()

setupTitlebarListeners();

const rootElement = document.getElementById('root')!
const root = createRoot(rootElement)

root.render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ErrorProvider>
                <McpProvider>
                    <LLMSettingsProvider>
                        <RouterProvider router={router}/>
                    </LLMSettingsProvider>
                </McpProvider>
            </ErrorProvider>
        </QueryClientProvider>
    </StrictMode>,
);
