import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Search,
  User,
  ChevronDown,
  UserRound,
  UserRoundCog,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Cookies from "js-cookie";
import { logoutUser } from "@/Service/auth.service";

export default function Layout({ children }) {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const logins = Cookies.get("logins") ? JSON.parse(Cookies.get("logins")) : [];
    if (logins.length > 0) {
      const lastLogin = logins[logins.length - 1];
      setUsername(lastLogin.username || "User");
      console.log(lastLogin.username, "line number 28");
      
    }
  }, []);

  const navigate = useNavigate();

  const handleLogoutClick = async (event) => {
    event.preventDefault();
    try {
      await logoutUser();
      navigate("/");
    } catch (error) {
      console.log("Error during manual logout:", error);
    }
  };

  return (
    <div className="flex h-screen bg-white text-gray-700">
      {/* Sidebar */}
      <div className="w-20 bg-gray-100 flex flex-col items-center py-6 space-y-8 h-full shadow-md">
        {[
          { to: "/chatdashboard", icon: <LayoutDashboard />, label: "Dashboard" },
          { to: "/chatinfo", icon: <MessageSquare />, label: "Chats" },
          { to: "/settings", icon: <Settings />, label: "Settings" },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="text-gray-500 hover:text-gray-900 transition-all duration-300 flex flex-col items-center"
          >
            <div className="p-1 bg-white border  border-gray-300 rounded-lg hover:bg-gray-200 transition-all">
              {item.icon}
            </div>
            <span className="text-xs mt-2">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="bg-gray-50 h-16 shadow p-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Chat Dashboard</h1>
          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full text-sm focus:outline-none text-gray-700 focus:ring-2 focus:ring-gray-300 placeholder-gray-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2 rounded-lg bg-gray-100 border border-gray-300 hover:bg-gray-200">
                  <span className="font-semibold text-xs">{username}</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="bg-white border border-gray-300  text-gray-700 shadow-lg">
                <DropdownMenuLabel className="flex items-center px-4 py-2">
                  <UserRound className="w-4 h-4 mr-2" />
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <RouterLink to="/usersettings/userprofile" className="no-underline text-inherit">
                  <DropdownMenuItem className="hover:bg-gray-100 px-4 py-2">
                    <UserRoundCog className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                </RouterLink>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutClick} className="hover:bg-gray-100 px-4 py-2">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <hr className="border-t border-gray-300" />

        
        {/* Main Content */}
        <main className="flex-1 p-2 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}


