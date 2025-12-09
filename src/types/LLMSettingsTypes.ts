export type LLMProvider = keyof typeof LLM_PROVIDERS;
export const LLM_PROVIDERS = {
    azure: {label: 'Azure', description: 'Microsoft Azure OpenAI'},
    ollama: {label: 'Ollama', description: 'Local Ollama instance'},
    openai: {label: 'OpenAI', description: 'OpenAI API'},
    mistral: {label: 'Mistral', description: 'Mistral AI'},
    anthropic: {label: 'Anthropic', description: 'Claude by Anthropic'},
    google: {label: 'Google', description: 'Google AI'},
    groq: {label: 'Groq', description: 'Groq API'},
} as const;

export interface LLMSettings {
    provider: LLMProvider;
    model: string;
    apiKey?: string;
    temperature: string;
    maxTokens: string;
    topP: string;
    frequencyPenalty: string;
}

export type LLMSettingsContextType = {
    settings: LLMSettings;
    updateSettings: (settings: LLMSettings) => void;
    updateProvider: (provider: LLMProvider) => void;
    updateModel: (model: string) => void;
    updateApiKey: (apiKey?: string) => void;
    updateTemperature: (temperature: string) => void;
    updateMaxTokens: (maxTokens: string) => void;
    updateTopP: (topP: string) => void;
    updateFrequencyPenalty: (frequencyPenalty: string) => void;
    saveSettings: () => void;
}
export const DEFAULT_SETTINGS: LLMSettings = {
    provider: 'ollama',
    model: '',
    temperature: '1',
    maxTokens: '1000',
    topP: '1',
    frequencyPenalty: '0'
};