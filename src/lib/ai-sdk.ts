import {generateText, LanguageModel, type ToolSet} from "ai";
import {createOllama} from "ai-sdk-ollama";
import {loadSettings} from "./config.ts";

export type GenerateTextWrapperOptions = {
    prompt: string;
    handleError: (message: string) => void;
    mcpEndpoint?: string;
};

export type GenerateMultimodalOptions = {
    text: string;
    images?: string[]; // data URLs or remote URLs
    handleError: (message: string) => void;
    mcpEndpoint?: string;
};


/**
 * Helper to get the model instance based on string settings
 */
async function getModelFromSettings(): Promise<LanguageModel> {
    const settings = await loadSettings();
    if (!settings) throw new Error("Failed to load settings.");

    switch (settings.provider) {
        case "ollama": {
            const ollama = createOllama({
                // You can add baseURL here if it's in your settings
            });
            return ollama(settings.model);
        }
        // case "azure": {
        //     const azure = createAzure({
        //         apiKey: settings.apiKey,
        //         // Add other Azure-specific config if needed
        //     });
        //     return azure(settings.model);
        // }
        default:
            throw new Error(`Unsupported provider: ${settings.provider}`);
    }
}

/**
 * Generates text using the vercel AI SDK.
 * @param props
 */
export async function generateTextWrapper(props: GenerateTextWrapperOptions): Promise<string> {
    const { prompt, handleError, mcpEndpoint } = props;

    try {
        const model = await getModelFromSettings();

        const { text } = await generateText({
            model,
            prompt,

        });

        return text;
    } catch (error) {
        const errorMessage = `Generation error: ${error instanceof Error ? error.message : String(error)}`;
        console.error(errorMessage);
        handleError(errorMessage);
        throw error;
    }
}

/**
 * Generates a response using text and optional images (multimodal) via Azure provider.
 * Falls back to text-only if images are not provided.
 */
export async function generateMultimodal(
    props: GenerateMultimodalOptions
): Promise<string> {
    const { text, images = [], handleError } = props;

    //const url = new URL(mcpEndpoint || import.meta.env.VITE_AZURE_MCP_ENDPOINT || "");
    // let mcpAvailable: boolean = false;
    //
    // try {
    //     await fetch(url);
    //     mcpAvailable = true;
    //     console.debug("MCP endpoint available");
    // } catch {
    //     // Not fatal for multimodal; just log and continue
    //     console.warn("MCP endpoint not available for multimodal call.");
    // }

    try {
        let tools: ToolSet | undefined;
        let mcpClient: any;
        //
        // if (mcpAvailable) {
        //     mcpClient = await createMCPClient({
        //         transport: new StreamableHTTPClientTransport(url, {
        //             sessionId: '',
        //         })
        //     });
        //     tools = await mcpClient.tools();
        // }
        //
        // const inputParts: any[] = [];
        // if (text?.trim()) {
        //     inputParts.push({ type: 'input_text', text });
        // }
        // for (const image of images) {
        //     // Pass through as URL or data URL; the SDK will fetch or decode
        //     inputParts.push({ type: 'input_image', image });
        // }

        const { text: response } = await generateText({
            model,
            tools,
            // Use input for multimodal; if no images, behaves like text-only
            messages: [{role: 'user', content: text}],
        });
        //
        // if (mcpAvailable && mcpClient) {
        //     mcpClient.close();
        // }

        return response;
    } catch (error) {
        const errorMessage = `Error generating multimodal response with Azure AI: ${error}`;
        console.error(errorMessage);
        handleError(errorMessage);
        throw error;
    }
}