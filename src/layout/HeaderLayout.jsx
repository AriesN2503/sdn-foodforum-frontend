import { Outlet } from "react-router"
import Header from "../components/Header"

export default function HeaderLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="max-w-4xl mx-auto p-6">
            <Outlet />
          </main>
        </div>
      )
}

