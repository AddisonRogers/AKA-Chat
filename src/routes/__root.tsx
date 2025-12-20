import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TitleBar} from "../components/Titlebar.tsx";

const RootLayout = () => (
    <>
        <TitleBar />
        <Outlet/>
    </>
)

export const Route = createRootRoute({component: RootLayout})