import {useContext} from 'react';
import {Label} from '../ui/label';
import { LLMSettingsContext} from "../../contexts/llmContext.tsx";
import {Input} from "../ui/input.tsx";

export function ModelSelect() {
    const llmContext = useContext(LLMSettingsContext)
    const onModelChange = (model: string) => llmContext?.updateModel(model);
    const selectedModel = llmContext?.settings?.model;

    return (
        <div className="space-y-4">
            <Label htmlFor="model-select" className="text-lg font-semibold">
                Model
            </Label>
            <Input className="space-y-2" id="model-select" value={selectedModel} onChange={(e) => onModelChange(e.target.value)}/>
        </div>
    );
}