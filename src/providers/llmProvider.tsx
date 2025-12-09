import React, {useCallback, useState, type ReactNode, useEffect} from 'react';
import {
    LLMSettingsContext
} from "../contexts/llmContext.tsx";
import {loadSettings, saveConfig} from "../lib/config.ts";
import {DEFAULT_SETTINGS, LLMSettings, LLMSettingsContextType} from "../types/LLMSettingsTypes.ts";

export type LLMProviderProps = {
    children: ReactNode;
};

export const LLMSettingsProvider: React.FC<LLMProviderProps> = ({children}) => {
    const [settings, setSettings] = useState<LLMSettings>(DEFAULT_SETTINGS);

    useEffect(() => {
        const initializeSettings = async () => {
            try {
                const savedSettings = await loadSettings();
                if (savedSettings) {
                    setSettings(savedSettings);
                } else {
                    setSettings(DEFAULT_SETTINGS);
                }
            } catch (error) {
                console.error('Failed to initialize settings:', error);
                setSettings(DEFAULT_SETTINGS);
            }
        };

        initializeSettings();
    }, []);

    const updateSettings = useCallback((newSettings: LLMSettings) => {
        setSettings(newSettings);
        localStorage.setItem('llm-settings', JSON.stringify(newSettings));
    }, []);

    const createSettingUpdater = <K extends keyof LLMSettings>(key: K) =>
        useCallback((value: LLMSettings[K]) => {
            setSettings(prev => {
                const updated = {...prev, [key]: value};
                localStorage.setItem('llm-settings', JSON.stringify(updated));
                return updated;
            });
        }, []);

    const updateProvider = createSettingUpdater('provider');
    const updateModel = createSettingUpdater('model');
    const updateApiKey = createSettingUpdater('apiKey');
    const updateTemperature = createSettingUpdater('temperature');
    const updateMaxTokens = createSettingUpdater('maxTokens');
    const updateTopP = createSettingUpdater('topP');
    const updateFrequencyPenalty = createSettingUpdater('frequencyPenalty');
    const saveSettings = useCallback(() => {
        saveConfig(settings);
    }, [settings]);

    const value: LLMSettingsContextType = {
        settings,
        updateSettings,
        updateProvider,
        updateModel,
        updateApiKey,
        updateTemperature,
        updateMaxTokens,
        updateTopP,
        updateFrequencyPenalty,
        saveSettings
    };

    return (
        <LLMSettingsContext.Provider value={value}>
            {children}
        </LLMSettingsContext.Provider>
    );
};
