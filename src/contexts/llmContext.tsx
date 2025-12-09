import {createContext} from "react";
import {DEFAULT_SETTINGS, LLMSettingsContextType} from "../types/LLMSettingsTypes.ts";

export const LLMSettingsContext = createContext<LLMSettingsContextType>({
    settings: DEFAULT_SETTINGS,
    updateSettings: () => {},
    updateProvider: () => {},
    updateModel: () => {},
    updateApiKey: () => {},
    updateTemperature: () => {},
    updateMaxTokens: () => {},
    updateTopP: () => {},
    updateFrequencyPenalty: () => {},
    saveSettings: () => {}
});