import {createContext} from "react";
import {LLMProvider, LLMSettings} from "../providers/llmProvider.tsx";

export type LLMSettingsContextType = {
    settings: LLMSettings;
    updateSettings: (settings: LLMSettings) => void;
    updateProvider: (provider: LLMProvider) => void;
    updateModel: (model: string) => void;
}

export const LLMSettingsContext = createContext<LLMSettingsContextType | undefined>(undefined);