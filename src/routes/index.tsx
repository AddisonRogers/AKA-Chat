import { createFileRoute } from '@tanstack/react-router'
import {useCallback, useContext, useEffect, useState} from "react";
import type {LLMMessage} from "../types/LLMMessage.ts";
import {ErrorContext} from "../contexts/errorContext.tsx";
import {McpContext} from "../contexts/mcpContext.tsx";
import {generateTextWithAzure as generateText} from "../lib/ai-sdk.ts";
import ChatMessages from "../components/chat/ChatMessages.tsx";
import ErrorPrompt from "../components/chat/ErrorPrompt.tsx";
import ChatInput from "../components/chat/ChatInput.tsx";
import {resizeWindowToFitContent} from "../hooks/useWindowManager.tsx";

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const [messages, setMessages] = useState<LLMMessage[]>([]);
    const {errors, addError} = useContext(ErrorContext)
    const {mcpEndpoint} = useContext(McpContext)

    useEffect(() => {
        console.log("Messages updated:", messages);
        if (messages.length > 0) {
            resizeWindowToFitContent();
        }
    }, [messages]);

    const handleSend = useCallback(async (input: string, images?: string[]) => {
        if (!input.trim()) return;

        // Add the user's message to the chat
        const userMessage: LLMMessage = {sender: "User", text: input, images: images && images.length ? images : undefined};
        setMessages((prev) => [...prev, userMessage]);

        try {
            console.log("Calling AI generate...", images?.length ? "multimodal" : "text");
            const aiResponse = await generateText({prompt: input, handleError: addError, mcpEndpoint});
            if (!aiResponse) {
                throw new Error("AI response is undefined or null");
            }
            console.log("AI Response received:", aiResponse);
            const botMessage: LLMMessage = {sender: "AI", text: aiResponse};
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Failed to generate AI response:", error);
            addError("An error occurred while generating the AI response. Please try again.");
        }
    }, [addError, mcpEndpoint]);

    return (
        <div className={"h-screen w-screen"}>
            <div className={"flex flex-col h-screen justify-between p-5"}>
                <div>
                    <ChatInput onSend={handleSend}/>
                </div>
                <div className="flex flex-col-reverse items-center gap-2">
                    {errors.map((error, index) => (
                        <ErrorPrompt key={index} index={index} message={error}/>
                    ))}
                </div>
                {messages.length > 0 && (
                    <div className={"flex-1 overflow-y-auto"}>
                        <ChatMessages messages={messages}/>
                    </div>
                )}
            </div>
        </div>
    );
}