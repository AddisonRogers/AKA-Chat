import React, {createContext} from "react";
import {LLMMessage} from "../types/LLMMessage.ts";

export type MessagesContextType = {
    messages: LLMMessage[];
    addMessage: (message: LLMMessage) => void;
    clearMessages: () => void;
    setMessages: React.Dispatch<React.SetStateAction<LLMMessage[]>>;
}

export const MessagesContext = createContext<MessagesContextType>({
    messages: [],
    setMessages: () => {
    },
    addMessage: () => {
    },
    clearMessages: () => {
    },
})