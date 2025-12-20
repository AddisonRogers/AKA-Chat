import React, {type ReactNode, useState} from "react";
import {MessagesContext, type MessagesContextType} from "../contexts/messagesContext.tsx";
import {LLMMessage} from "../types/LLMMessage.ts";

export type McpProviderProps = {
    children: ReactNode;
};

export const MessagesProvider: React.FC<McpProviderProps> = ({children}) => {

    const [messages, setMessages] = useState<LLMMessage[]>([]);

    const value: MessagesContextType = {
        messages,
        setMessages,
        addMessage: (message) => {
            console.log("Adding message to conversation history");
            setMessages((prev) => [...prev, message]);
        },
        clearMessages: () => {
            setMessages([]);
        },
    };

    return (
        <MessagesContext.Provider value={value}>
            {children}
        </MessagesContext.Provider>
    );
}
