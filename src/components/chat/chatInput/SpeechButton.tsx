import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, StopCircle } from "lucide-react";
import { Button } from "../../ui/button.tsx";

interface SpeechButtonProps {
    onTranscript: (transcript: string) => void;
}

export function SpeechButton({ onTranscript }: SpeechButtonProps) {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = navigator.language || 'en-US';

            recognition.onresult = (event: any) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                onTranscript(transcript);
            };

            recognition.onend = () => setIsRecording(false);
            recognition.onerror = () => setIsRecording(false);

            recognitionRef.current = recognition;
        }
    }, [onTranscript]);

    const toggleRecording = useCallback(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (isRecording) {
            recognition.stop();
        } else {
            setIsRecording(true);
            try {
                recognition.start();
            } catch (e) {
                console.error("Speech recognition start error:", e);
                setIsRecording(false);
            }
        }
    }, [isRecording]);

    if (!(window as any).SpeechRecognition && !(window as any).webkitSpeechRecognition) {
        return null;
    }

    return (
        <Button
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            onClick={toggleRecording}
            title={isRecording ? "Stop recording" : "Speak"}
        >
            {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
    );
}