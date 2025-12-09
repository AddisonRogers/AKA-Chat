import React from 'react';
import {LLMProvider} from '../../providers/llmProvider.tsx';
import {LLM_PROVIDERS} from '../../lib/llmConfig';
import {Label} from '../ui/label';

interface ModelSelectProps {
    selectedProvider: LLMProvider;
    selectedModel: string;
    onModelChange: (model: string) => void;
}

export function ModelSelect({
                                selectedProvider,
                                selectedModel,
                                onModelChange,
                            }: ModelSelectProps) {
    const availableModels = React.useMemo(
        () => LLM_PROVIDERS[selectedProvider].models,
        [selectedProvider]
    );

    return (
        <div className="space-y-4">
            <Label htmlFor="model-select" className="text-lg font-semibold">
                Model
            </Label>
            <div className="space-y-2">
                {availableModels.map(model => (
                    <label
                        key={model}
                        className="flex items-center p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all"
                    >
                        <input
                            type="radio"
                            name="model"
                            value={model}
                            checked={selectedModel === model}
                            onChange={e => onModelChange(e.target.value)}
                            className="mr-3"
                        />
                        <span className="font-medium">{model}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}