import {createFileRoute} from '@tanstack/react-router'
import {useContext, useEffect} from "react";
import {ErrorContext} from "../contexts/errorContext.tsx";
import ChatMessages from "../components/chat/ChatMessages.tsx";
import ErrorPrompt from "../components/chat/ErrorPrompt.tsx";
import ChatInputBox from "../components/chat/ChatInputBox.tsx";
import {resizeWindowToFitContent} from "../hooks/useWindowManager.tsx";
import {MessagesContext} from "../contexts/messagesContext.tsx";

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    const {messages} = useContext(MessagesContext);
    const {errors} = useContext(ErrorContext)

    useEffect(() => {
        console.log("Messages updated:", messages);
        if (messages.length > 0) {
            resizeWindowToFitContent();
        }
    }, [messages]);

    return (
        <div className={"flex flex-col w-screen h-screen justify-between px-2"}>
            <ChatInputBox/>
            <div className="flex flex-col-reverse items-center gap-2">
                {errors.map((error, index) => (
                    <ErrorPrompt key={index} index={index} message={error}/>
                ))}
            </div>
            {messages.length > 0 && (
                <div className={"flex-1 overflow-y-auto"}>
                    <ChatMessages messages={messages}/>
                </div>
            )}
        </div>
    );
}