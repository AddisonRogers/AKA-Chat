import React, {useCallback, useEffect, useRef, useState} from "react";
import {Send, Mic, ImagePlus, StopCircle, Settings} from "lucide-react";
import {Button} from "../ui/button.tsx";
import {WebviewWindow} from '@tauri-apps/api/webviewWindow';

interface chatInputProps {
    onSend: (input: string, images?: string[]) => void;
}

function ChatInput(props: chatInputProps) {
    const {onSend} = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [attachedImages, setAttachedImages] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    const handleSend = useCallback(() => {
        const currentInput = inputRef.current?.value || "";
        if (currentInput.trim()) {
            onSend(currentInput, attachedImages);
            setAttachedImages([]);
        }
    }, [onSend]);

    const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSend();
            event.preventDefault();
            inputRef.current!.blur();
            inputRef.current!.value = "";
        }
    }, [handleSend]);

    // Image handling
    const onFilesSelected = useCallback(async (files: FileList | null) => {
        if (!files) return;
        const readers: Promise<string>[] = [];
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) return;
            readers.push(new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            }));
        });
        const dataUrls = await Promise.all(readers);
        setAttachedImages((prev) => [...prev, ...dataUrls]);
    }, []);

    const handlePaste = useCallback((e: React.ClipboardEvent<HTMLInputElement>) => {
        const items = e.clipboardData.items;
        const files: File[] = [];
        for (const item of items as any) {
            if (item.type && item.type.indexOf("image") !== -1) {
                const file = item.getAsFile();
                if (file) files.push(file);
            }
        }
        if (files.length) {
            const list = {
                length: files.length,
                item: (i: number) => files[i],
                ...files,
            } as unknown as FileList;
            onFilesSelected(list);
        }
    }, [onFilesSelected]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        onFilesSelected(e.dataTransfer.files);
    }, [onFilesSelected]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    // Speech recognition (Web Speech API)
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = navigator.language || 'en-US';
            recognitionRef.current.onresult = (event: any) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                if (inputRef.current) {
                    inputRef.current.value = transcript;
                }
            };
            recognitionRef.current.onend = () => setIsRecording(false);
            recognitionRef.current.onerror = () => setIsRecording(false);
        }
    }, []);

    const startStopRecording = useCallback(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;
        if (isRecording) {
            recognition.stop();
            setIsRecording(false);
        } else {
            setIsRecording(true);
            try {
                recognition.start();
            } catch (_) {
                // ignore multiple start errors
            }
        }
    }, [isRecording]);

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
            });
            newWindow.once('tauri://error', function (e) {
                console.error('Settings window error:', e);
            });

        } catch (error) {
            console.error('Failed to open settings window:', error);
        }
    }, []);

    return (
        <>
            <div
                className={"flex items-center mt-1.5 border rounded-xl p-1.5 gap-2"}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input
                    type="text"
                    ref={inputRef}
                    onKeyUp={handleKeyPress}
                    onPaste={handlePaste}
                    placeholder="Type your message… (paste or drop images)"
                    className={"flex-1 p-1 border-none outline-none"}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => onFilesSelected(e.target.files)}
                />
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={openSettingsWindow} title="Settings">
                        <Settings className="w-5 h-5"/>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}
                            title="Attach image(s)">
                        <ImagePlus className="w-5 h-5"/>
                    </Button>
                    <Button variant={isRecording ? "destructive" : "ghost"} size="icon" onClick={startStopRecording}
                            title={isRecording ? "Stop recording" : "Speak"}>
                        {isRecording ? <StopCircle className="w-5 h-5"/> : <Mic className="w-5 h-5"/>}
                    </Button>
                    <Button onClick={handleSend} size="icon" title="Send">
                        <Send className="w-5 h-5"/>
                    </Button>
                </div>
            </div>

            {attachedImages.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                    {attachedImages.map((src, i) => (
                        <div key={i} className="relative">
                            <img src={src} alt={`attachment-${i}`} className="w-16 h-16 object-cover rounded border"/>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default ChatInput;