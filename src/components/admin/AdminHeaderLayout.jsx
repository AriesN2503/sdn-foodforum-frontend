import { Outlet, useLocation, useNavigate } from "react-router";
import { ChefHat, Bell, LogOut, Users, TrendingUp, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import React from "react";

const tabs = [
  { id: "users", label: "Users", icon: Users, path: "/admin?tab=users" },
  { id: "posts", label: "Posts", icon: MessageSquare, path: "/admin?tab=posts" },
];

export default function AdminHeaderLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định tab active dựa trên pathname và query
  let activeTab = "users";
  if (location.pathname === "/admin" && location.search.includes("tab=users")) activeTab = "users";
  else if (location.pathname === "/admin" && location.search.includes("tab=posts")) activeTab = "posts";
  else if (location.pathname.startsWith("/admin/posts/")) activeTab = "posts";

  // Xử lý chuyển tab
  const handleTabClick = (tab) => {
    if (tab.id === "users") navigate("/admin?tab=users");
    else if (tab.id === "posts") navigate("/admin?tab=posts");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-orange-500">
                <ChefHat className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-orange-500">FoodForum Admin</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-orange-100 text-orange-600">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem onClick={handleAdminLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  className={`flex cursor-pointer items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      {/* Main Content */}
      <main className=" mx-auto p-6">
        {/* Hiển thị đúng nội dung theo tab */}
        {location.pathname === "/admin" && location.search.includes("tab=users") && <Outlet context={{ tab: "users" }} />}
        {location.pathname === "/admin" && location.search.includes("tab=posts") && <Outlet context={{ tab: "posts" }} />}
        {location.pathname === "/admin" && !location.search && <Outlet context={{ tab: "dashboard" }} />}
        {location.pathname.startsWith("/admin/posts/") && <Outlet />}
      </main>
    </div>
  );
} 