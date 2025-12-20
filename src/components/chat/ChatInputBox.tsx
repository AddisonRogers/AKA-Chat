import React, {useCallback, useContext, useRef, useState} from "react";
import SettingsButton from "./chatInput/SettingsButton.tsx";
import {LLMMessage} from "../../types/LLMMessage.ts";
import {MessagesContext} from "../../contexts/messagesContext.ts";
import {generateText} from "ai";
import {ErrorContext} from "../../contexts/errorContext.tsx";
import {McpContext} from "../../contexts/mcpContext.tsx";
import {SpeechButton} from "./chatInput/SpeechButton.tsx";
import {ImagePreview} from "./chatInput/ImagePreview.tsx";
import {FilePicker} from "./chatInput/FilePicker.tsx";

export function ChatInputBox() {
    const {addMessage} = useContext(MessagesContext);
    const {addError} = useContext(ErrorContext);
    const {mcpEndpoint} = useContext(McpContext);

    const inputRef = useRef<HTMLInputElement>(null);
    const [attachedImages, setAttachedImages] = useState<string[]>([]);

    const handleImagesSelected = useCallback((dataUrls: string[]) => {
        setAttachedImages((prev) => [...prev, ...dataUrls]);
    }, []);

    const handleSend = useCallback(async () => {
        const currentInput = inputRef.current?.value || "";
        if (currentInput.trim() != "") {
            // Add the user's message to the chat
            const userMessage: LLMMessage = {
                sender: "User",
                text: currentInput,
                images: attachedImages && attachedImages.length ? attachedImages : undefined
            };
            addMessage(userMessage);

            try {
                const aiResponse = await generateText({prompt: currentInput});
                if (!aiResponse) {
                    throw new Error("AI response is undefined or null");
                }
                console.log("AI Response received:", aiResponse);
                const botMessage: LLMMessage = {sender: "AI", text: aiResponse};
                addMessage(botMessage);
            } catch (error) {
                console.error("Failed to generate AI response:", error);
                addError("An error occurred while generating the AI response. Please try again.");
            }
            setAttachedImages([]);
        }
    }, [addError, mcpEndpoint]);

    const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSend();
            event.preventDefault();
            inputRef.current!.blur();
            inputRef.current!.value = "";
        }
    }, [handleSend]);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
        const items = e.clipboardData.items;
        for (const item of items as any) {
            if (item.type && item.type.indexOf("image") !== -1) {
                const file = item.getAsFile();
                if (file) {
                    const reader = new FileReader();
                    reader.onload = () => handleImagesSelected([reader.result as string]);
                    reader.readAsDataURL(file);
                }
            }
        }
    }, [handleImagesSelected]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const readers: Promise<string>[] = [];
            Array.from(files).forEach((file) => {
                if (!file.type.startsWith("image/")) return;
                readers.push(new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(file);
                }));
            });
            Promise.all(readers).then(handleImagesSelected);
        }
    }, [handleImagesSelected]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleTranscript = useCallback((transcript: string) => {
        if (inputRef.current) {
            inputRef.current.value = transcript;
        }
    }, []);

    return (
        <>
            <div
                className={"flex items-center mt-1.5 border rounded-xl p-1.5 gap-2"}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input
                    type="text"
                    ref={inputRef}
                    onKeyUp={handleKeyPress}
                    onPaste={handlePaste}
                    placeholder="Type your message… (paste or drop images)"
                    className={"flex-1 p-1 border-none outline-none"}
                />
                <div className="flex items-center gap-1">
                    <SettingsButton/>
                    <FilePicker onImagesSelected={handleImagesSelected} />
                    <SpeechButton onTranscript={handleTranscript} />
                </div>
            </div>

            <ImagePreview images={attachedImages} />
        </>
    );
};

export default ChatInputBox;