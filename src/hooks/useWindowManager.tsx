
import { useEffect } from 'react';
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/core';
import { getCurrentWindow, LogicalSize } from '@tauri-apps/api/window';

export function useWindowManager() {
    useEffect(() => {
        let unlistens: UnlistenFn[] = [];

        const setupWindowControl = async () => {
            try {
                // Listen for toggle shortcut event from Rust backend
                const unlisten = await listen('toggle_shortcut', async (event) => {
                    console.log('Toggle shortcut triggered:', event.payload);
                    await invoke('toggle_window');
                });
                unlistens.push(unlisten);
            } catch (error) {
                console.error('Failed to setup window manager:', error);
            }
        };

        setupWindowControl();

        return () => {
            unlistens.forEach((unlisten) => unlisten());
        };
    }, []);
}

/**
 * Resize window with smooth animation
 * @param width - desired width in logical pixels
 * @param height - desired height in logical pixels
 */
export async function resizeWindow(width: number, height: number) {
    try {
        const window = getCurrentWindow();
        await window.setSize(new LogicalSize(width, height));
    } catch (error) {
        console.error('Failed to resize window:', error);
    }
}

/**
 * Calculate and resize window to fit all content
 */
export async function resizeWindowToFitContent() {
    try {
        const window = getCurrentWindow();
        // Wait for DOM to settle
        await new Promise(resolve => setTimeout(resolve, 100));

        const contentHeight = document.documentElement.scrollHeight;
        const contentWidth = document.documentElement.scrollWidth;

        // Set reasonable bounds
        const width = Math.max(Math.min(contentWidth + 40, 1000), 500);
        const height = Math.max(Math.min(contentHeight + 40, 900), 300);

        await window.setSize(new LogicalSize(width, height));
    } catch (error) {
        console.error('Failed to resize window to fit content:', error);
    }
}