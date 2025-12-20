import { getCurrentWindow } from '@tauri-apps/api/window';
import { X } from 'lucide-react';

export function TitleBar() {
    const appWindow = getCurrentWindow();

    return (
        <div
            data-tauri-drag-region
            className="flex justify-end items-center select-none pointer-events-none mt-1 mr-1 p-0 border-none"
        >
            <button
                onClick={() => appWindow.close()}
                className="flex items-center rounded-full cursor-pointer pointer-events-auto border-none "
                aria-label="Close"
            >
                <X className={"hover:text-destructive transition-colors duration-200 "} size={14} />
            </button>
        </div>
    );
}