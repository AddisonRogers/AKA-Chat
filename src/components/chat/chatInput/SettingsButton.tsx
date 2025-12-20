import {Button} from "../../ui/button.tsx";
import {Settings} from "lucide-react";
import {useCallback} from "react";
import {invoke} from '@tauri-apps/api/core';

export default function SettingsButton() {

  const openSettingsWindow = useCallback(async () => {
    try {

      invoke('open_settings')

    } catch (error) {
      console.error('Failed to open settings window:', error);
    }
  }, []);


  return <Button variant="ghost" size="icon" onClick={openSettingsWindow} title="Settings">
    <Settings className="w-5 h-5"/>
  </Button>;
}