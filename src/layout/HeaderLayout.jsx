import { Outlet } from "react-router"
import Header from "../components/Header"

export default function HeaderLayout({ definedWidth }) {

    const width = definedWidth || "max-w-4xl"

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className={`${width} mx-auto p-6`}>
                <Outlet />
            </main>
        </div>
    )
}

