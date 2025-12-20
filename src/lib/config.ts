import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { appConfigDir } from '@tauri-apps/api/path';
import {DEFAULT_SETTINGS, LLMSettings} from '../types/LLMSettingsTypes.ts';

const CONFIG_FILE_NAME = 'llm-settings.json';

/**
 * Get the path to the config directory
 */
async function getConfigPath(): Promise<string> {
    const configDir = await appConfigDir();
    return `${configDir}${CONFIG_FILE_NAME}`;
}


/**
 * Load settings from config file
 */
export async function loadSettings(): Promise<LLMSettings | null> {
    try {
        const configPath = await getConfigPath();
        const content = await readTextFile(configPath);
        return JSON.parse(content) as LLMSettings;
    } catch (error) {
        console.warn('Failed to load settings from config file:', error);
        console.log('Using default settings.');
        return DEFAULT_SETTINGS
    }
}

/**
 * Save settings to config file
 */
export async function saveConfig(settings: LLMSettings): Promise<void> {
    try {
        const configPath = await getConfigPath();
        await writeTextFile(configPath, JSON.stringify(settings, null, 2));
    } catch (error) {
        console.error('Failed to save settings to config file:', error);
        throw error;
    }
}