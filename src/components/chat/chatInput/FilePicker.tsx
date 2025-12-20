import React, { useCallback, useRef } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "../../ui/button.tsx";

interface FilePickerProps {
    onImagesSelected: (dataUrls: string[]) => void;
}

export function FilePicker({ onImagesSelected }: FilePickerProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFiles = useCallback(async (files: FileList | null) => {
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
        onImagesSelected(dataUrls);
    }, [onImagesSelected]);

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />
            <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                title="Attach image(s)"
            >
                <ImagePlus className="w-5 h-5" />
            </Button>
        </>
    );
}