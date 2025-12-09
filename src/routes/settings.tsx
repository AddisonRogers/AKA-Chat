import { createFileRoute } from '@tanstack/react-router';
import { ProviderSelect } from '../components/settings/ProviderSelect';
import { ModelSelect } from '../components/settings/ModelSelect';
import { SettingsCard } from '../components/settings/SettingsCard';
import {useContext} from "react";
import {LLMSettingsContext} from "../contexts/llmContext.tsx";

export const Route = createFileRoute('/settings')({
    component: Settings,
});

function Settings() {
    const {settings} = useContext(LLMSettingsContext);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
                    <p className="text-gray-600 dark:text-gray-400">Configure your LLM provider and model preferences</p>
                </div>

                <div className="space-y-6">
                    <SettingsCard
                        title="Provider Selection"
                        description="Choose which LLM provider you want to use"
                    >
                        <ProviderSelect/>
                    </SettingsCard>

                    <SettingsCard
                        title="Model Selection"
                        description="Select the model for the chosen provider"
                    >
                        <ModelSelect/>
                    </SettingsCard>

                    <div className="mt-8 p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Current Configuration</h3>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                            <li>
                                <strong>Provider:</strong> {settings.provider}
                            </li>
                            <li>
                                <strong>Model:</strong> {settings.model}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}