import {Button} from "../../ui/button.tsx";
import {Settings} from "lucide-react";
import {useCallback} from "react";
import {WebviewWindow} from "@tauri-apps/api/webviewWindow";
import {setupTitlebarListeners} from "../../../lib/titleBar.ts";

export default function SettingsButton() {

    const openSettingsWindow = useCallback(async () => {
        try {
            // Check if settings window already exists

            // Create a new settings window
            const newWindow = new WebviewWindow('settings', {
                url: '/settings',
                width: 700,
                height: 600,
                decorations: false,
                focus: true,
                resizable: true,
            });

            newWindow.once('tauri://created', function () {
                console.log('Settings window created');
                setupTitlebarListeners();
            });
            newWindow.once('tauri://error', function (e) {
                console.error('Settings window error:', e);
            });

        } catch (error) {
            console.error('Failed to open settings window:', error);
        }
    }, []);


    return <Button variant="ghost" size="icon" onClick={openSettingsWindow} title="Settings">
        <Settings className="w-5 h-5"/>
    </Button>;
}