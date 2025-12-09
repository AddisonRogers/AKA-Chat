import {generateText, type ToolSet} from "ai";
import {createOllama} from "ai-sdk-ollama";

export type GenerateTextWithAzureOptions = {
    prompt: string;
    handleError: (message: string) => void;
    mcpEndpoint?: string;
};

// export type GenerateMultimodalWithAzureOptions = {
//     text: string;
//     images?: string[]; // data URLs or remote URLs
//     handleError: (message: string) => void;
//     mcpEndpoint?: string;
// };

/**
 * Generates text using the Azure AI SDK.
 * @param props
 */
export async function generateTextWithAzure(props: GenerateTextWithAzureOptions): Promise<string> {
    const {prompt, handleError, mcpEndpoint} = props;

    const ollama = createOllama({
    });

    const model = ollama.languageModel("gemma3:1b-it-qat");


    //const url = new URL(mcpEndpoint || import.meta.env.VITE_AZURE_MCP_ENDPOINT || "");
    let mcpAvailable: boolean = false;

    // try {
    //     await fetch(url);
    //     mcpAvailable = true;
    //     console.debug("MCP endpoint available");
    // } catch {
    //     const errorMessage = "Error fetching MCP endpoint.";
    //     console.error(errorMessage);
    //     handleError(errorMessage);
    // }

    try {
        let tools: ToolSet | undefined;
        let mcpClient: any; // Ignore Need to import the type MCPClient

        // if (mcpAvailable) {
        //     console.debug("MCP endpoint available so using the tools");
        //
        //     mcpClient = await createMCPClient({
        //         transport: new StreamableHTTPClientTransport(url, {
        //             sessionId: '',
        //         })
        //
        //     });
        //
        //     tools = await mcpClient.tools();
        // }

        const {text} = await generateText({
            model,
            tools,
            prompt,
        });

        if (mcpAvailable && mcpClient) {
            mcpClient.close();
        }

        return text;
    } catch (error) {
        const errorMessage = `Error generating text with Azure AI: ${error}`;
        console.error(errorMessage);
        handleError(errorMessage);
        throw error;
    }
}

/**
 * Generates a response using text and optional images (multimodal) via Azure provider.
 * Falls back to text-only if images are not provided.
 */
// export async function generateMultimodalWithAzure(
//     props: GenerateMultimodalWithAzureOptions
// ): Promise<string> {
//     const { text, images = [], handleError, mcpEndpoint } = props;
//
//     //const url = new URL(mcpEndpoint || import.meta.env.VITE_AZURE_MCP_ENDPOINT || "");
//     // let mcpAvailable: boolean = false;
//     //
//     // try {
//     //     await fetch(url);
//     //     mcpAvailable = true;
//     //     console.debug("MCP endpoint available");
//     // } catch {
//     //     // Not fatal for multimodal; just log and continue
//     //     console.warn("MCP endpoint not available for multimodal call.");
//     // }
//
//     try {
//         let tools: ToolSet | undefined;
//         let mcpClient: any;
//         //
//         // if (mcpAvailable) {
//         //     mcpClient = await createMCPClient({
//         //         transport: new StreamableHTTPClientTransport(url, {
//         //             sessionId: '',
//         //         })
//         //     });
//         //     tools = await mcpClient.tools();
//         // }
//         //
//         // const inputParts: any[] = [];
//         // if (text?.trim()) {
//         //     inputParts.push({ type: 'input_text', text });
//         // }
//         // for (const image of images) {
//         //     // Pass through as URL or data URL; the SDK will fetch or decode
//         //     inputParts.push({ type: 'input_image', image });
//         // }
//
//         const { text: response } = await generateText({
//             model,
//             tools,
//             // Use input for multimodal; if no images, behaves like text-only
//             messages: [{role: 'user', content: text}],
//         });
//         //
//         // if (mcpAvailable && mcpClient) {
//         //     mcpClient.close();
//         // }
//
//         return response;
//     } catch (error) {
//         const errorMessage = `Error generating multimodal response with Azure AI: ${error}`;
//         console.error(errorMessage);
//         handleError(errorMessage);
//         throw error;
//     }
// }