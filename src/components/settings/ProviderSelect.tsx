import React from 'react';
import {LLMProvider} from '../../providers/llmProvider.tsx';
import {LLM_PROVIDERS} from '../lib/llmConfig';
import {Label} from '../ui/label';

interface ProviderSelectProps {
    selectedProvider: LLMProvider;
    onProviderChange: (provider: LLMProvider) => void;
}

export function ProviderSelect({selectedProvider, onProviderChange}: ProviderSelectProps) {
    const providers = React.useMemo(
        () => Object.entries(LLM_PROVIDERS) as Array<[LLMProvider, typeof LLM_PROVIDERS[LLMProvider]]>,
        []
    );

    return (
        <div className="space-y-4">
            <Label className="text-lg font-semibold">LLM Provider</Label>
            <div className="grid grid-cols-1 gap-3">
                {providers.map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => onProviderChange(key)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedProvider === key
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                    >
                        <div className="font-semibold">{config.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{config.description}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}