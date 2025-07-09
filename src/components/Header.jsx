import { Search, ChefHat, Coffee, User as UserIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Link } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "../hooks/useAuth"

export default function Header() {
  const { isAuthenticated, user } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 p-4">
        <Link to='/' className="flex items-center space-x-2 cursor-pointer">
          <div className="flex items-center space-x-1 text-orange-500">
            <ChefHat className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-orange-500">FoodForum</span>
        </Link>

        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Input placeholder="Search for recipes, restaurants, tips..." className="pl-4 pr-12 py-5 w-full" />
            <Button size="sm" className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {isAuthenticated && user ? (
            <Link to="/profile">
              <Avatar className="h-9 w-9 cursor-pointer">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} />
                ) : (
                  <AvatarFallback className="bg-orange-100 text-orange-600">
                    {user.username
                      ? user.username.slice(0, 2).toUpperCase()
                      : <UserIcon className="h-5 w-5 text-orange-500" />}
                  </AvatarFallback>
                )}
              </Avatar>
            </Link>
          ) : (
            <Link to='login'>
              <Button variant="default" className="bg-orange-500 hover:bg-orange-600 cursor-pointer">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
