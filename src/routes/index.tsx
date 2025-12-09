import { createFileRoute } from '@tanstack/react-router'
import Chat from "../pages/chat.tsx";

export const Route = createFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className={"w-screen h-screen"}>
            <Chat />
        </div>
    )
}