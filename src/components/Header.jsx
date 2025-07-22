import { Search, ChefHat, Coffee, MessageCircle, User as UserIcon, Plus, BookOpen } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Link } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuth } from "../hooks/useAuth"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"
import { useNavigate } from "react-router"


export default function Header() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 p-4">
        <Link to='/' className="flex items-center space-x-2 cursor-pointer">
          <div className="flex items-center space-x-1 text-orange-500">
            <ChefHat className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold text-orange-500">FoodForum</span>
        </Link>

        {/* Nút Xem tất cả bài viết */}
        <Link to="/posts/all">
          <Button variant="outline" className="flex items-center gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-colors">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Xem tất cả bài viết</span>
            <span className="sm:hidden">Tất cả</span>
            </Button>
        </Link>

        {/* Đã xóa thanh tìm kiếm ở đây */}

        <div className="flex items-center space-x-3">
          <Link to="/chat" className="p-2 rounded-full hover:bg-orange-100 transition-colors">
            <MessageCircle className="h-6 w-6 text-orange-500" />
          </Link>
          {isAuthenticated && (
            <Button
              variant="ghost"
              className="p-2 rounded-full hover:bg-orange-100 transition-colors"
              title="Tạo bài viết mới"
              onClick={() => navigate("/post/create")}
            >
              <Plus className="h-6 w-6 text-orange-500" />
            </Button>
          )}
          {isAuthenticated && user ? (
            <>
              <Link to="/posts/new">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo bài viết
                </Button>
              </Link>
              {user.username ? (
                <Link to={`/profile/${user.username}`}>
                  <Avatar className="h-9 w-9 cursor-pointer">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} />
                    ) : (
                      <AvatarFallback className="bg-orange-100 text-orange-600">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </Link>
              ) : (
                <Avatar className="h-9 w-9 cursor-not-allowed opacity-60">
                  <AvatarFallback className="bg-orange-100 text-orange-600">
                    <UserIcon className="h-5 w-5 text-orange-500" />
                  </AvatarFallback>
                </Avatar>
              )}
            </>
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
