import { Link } from "react-router"
import { Button } from "../components/ui/button"

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
            <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
            <p className="text-xl font-semibold text-gray-800 mb-2">
                Oops! Page not found.
            </p>
            <p className="text-gray-500 text-center max-w-md mb-6">
                The page you're looking for doesn’t exist, was removed, or is temporarily unavailable.
            </p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                <Link to="/">Go Back Home</Link>
            </Button>
        </div>
    )
}
