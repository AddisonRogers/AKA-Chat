interface ImagePreviewProps {
    images: string[];
}

export function ImagePreview({ images }: ImagePreviewProps) {
    if (images.length === 0) return null;

    return (
        <div className="flex gap-2 mt-2 flex-wrap">
            {images.map((src, i) => (
                <div key={i} className="relative">
                    <img
                        src={src}
                        alt={`attachment-${i}`}
                        className="w-16 h-16 object-cover rounded border"
                    />
                </div>
            ))}
        </div>
    );
}
