import React, {useCallback, useState, type ReactNode} from 'react';
import {LLMSettingsContext, type LLMSettingsContextType} from "../contexts/llmContext.tsx";

export type LLMProvider = 'azure' | 'ollama' | 'openai';

export interface LLMSettings {
    provider: LLMProvider;
    model: string;
}

const DEFAULT_SETTINGS: LLMSettings = {
    provider: 'azure',
    model: 'gpt-4',
};

export type LlmProviderProps = {
    children: ReactNode;
};

export const LLMSettingsProvider: React.FC<LlmProviderProps> = ({children}) => {
    const [settings, setSettings] = useState<LLMSettings>(() => {
        const saved = localStorage.getItem('llm-settings');
        return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    });

    const updateSettings = useCallback((newSettings: LLMSettings) => {
        setSettings(newSettings);
        localStorage.setItem('llm-settings', JSON.stringify(newSettings));
    }, []);

    const updateProvider = useCallback((provider: LLMProvider) => {
        setSettings(prev => {
            const updated = {...prev, provider};
            localStorage.setItem('llm-settings', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const updateModel = useCallback((model: string) => {
        setSettings(prev => {
            const updated = {...prev, model};
            localStorage.setItem('llm-settings', JSON.stringify(updated));
            return updated;
        });
    }, []);

    const value: LLMSettingsContextType = {
        settings,
        updateSettings,
        updateProvider,
        updateModel,
    };

    return (
        <LLMSettingsContext.Provider value={value}>
            {children}
        </LLMSettingsContext.Provider>
    );
};
