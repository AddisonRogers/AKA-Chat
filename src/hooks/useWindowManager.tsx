import { useEffect } from 'react';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';

export function useWindowManager() {
    useEffect(() => {
        let unlistens: UnlistenFn[] = [];

        const setupWindowControl = async () => {
            try {
                // Listen for toggle shortcut event from Rust backend
                const unlisten = await listen('toggle_shortcut', async (event) => {
                    console.log('Toggle shortcut triggered:', event.payload);
                    // Call the Tauri command to toggle window visibility
                    await invoke('toggle_window');
                });
                unlistens.push(unlisten);
            } catch (error) {
                console.error('Failed to setup window manager:', error);
            }
        };

        setupWindowControl();

        // Cleanup
        return () => {
            unlistens.forEach((unlisten) => unlisten());
        };
    }, []);
}