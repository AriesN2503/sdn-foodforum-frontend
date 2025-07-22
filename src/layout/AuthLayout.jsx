import { ChefHat } from "lucide-react"
import { Link } from "react-router"

export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div
            className="w-full min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/stacked-waves-haikei.png')" }}
        >
            <div className="min-h-screen  flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    {/* Logo and Header */}
                    <div className="text-center">
                        <Link to='/' className="flex items-center justify-center space-x-2 mb-6 outline-none focus:outline-none">
                            <div className="flex items-center space-x-1 text-orange-500">
                                <ChefHat className="h-8 w-8" />
                            </div>
                            <span className="text-3xl font-bold text-orange-500">FoodForum</span>
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                        <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
                    </div>
                    <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">{children}</div>
                </div>
            </div>
        </div>
    )
}
