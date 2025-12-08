export type LLMMessage = {
    sender: string;
    text: string;
    images?: string[]; // data URLs for attached images
};