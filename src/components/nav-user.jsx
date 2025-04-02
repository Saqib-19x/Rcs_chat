"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { getProfile, logoutUser } from "@/Service/auth.service";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

export function NavUser({ user }) {
  const { isMobile } = useSidebar();
  const [username, setUsername] = useState("User");
  const [userEmail, setUserEmail] = useState("email");

  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
    phone: "",
    company: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile data
  // fetch

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      console.log(response, "53");

      if (response?.user) {
        setProfileData({
          username: response.user.username || "",
          email: response.user.email || "",
          phone: response.user.phone || "",
          company: response.user.company || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const logins = Cookies.get("logins")
      ? JSON.parse(Cookies.get("logins"))
      : [];
    if (logins.length > 0) {
      const lastLogin = logins[logins.length - 1];
      setUsername(lastLogin.username || "User");
      console.log(lastLogin);

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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {username.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {console.log(username.substring(0, 2), "line number 107")}
                  {profileData.username}
                </span>
                <span className="truncate text-xs">{profileData.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {username.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{username}</span>
                  <span className="truncate text-xs">{profileData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogoutClick}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
