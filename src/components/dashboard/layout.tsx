"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/use-auth";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  BarChart3,
  ChevronUp,
  Film,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Mail,
  Menu,
  Settings,
  Tag,
  Ticket,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../theme-toggle";

const userMenuItems = [
  {
    title: "Dashboard",
    href: "/user/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Watchlist",
    href: "/user/watchlist",
    icon: ListChecks,
  },
  {
    title: "Purchase History",
    href: "/user/purchases",
    icon: Tag,
  },
  {
    title: "My Profile",
    href: "/user/profile",
    icon: Users,
  },
];

const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Movies & Series",
    href: "/admin/movie-post",
    icon: Film,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
  },
  {
    title: "Coupons",
    href: "/admin/coupons",
    icon: Ticket,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isAdmin, signOut } = useAuth();

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    } else if (isAdmin === undefined) {
      console.log("Admin status undefined. Waiting for user data.");
    } else {
      setIsLoading(false);
    }
  }, [user, isAdmin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative flex">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}{" "}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transition-transform duration-200 ease-in-out md:sticky md:top-0 lg:max-h-screen min-h-screen", // Adjusted for mobile
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-6 w-6" />
              <span className="font-semibold">CineVerse</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>{" "}
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto min-h-0">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
          {/* Footer */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user?.image || ""} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Administrator
                      </p>
                    </div>
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex justify-between items-center w-full">
                    <span>Dark Mode</span>
                    <ThemeToggle />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      {/* Main Content */}{" "}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="sticky top-0 z-10 md:hidden bg-card/80 backdrop-blur-sm border-b">
          <div className="flex items-center gap-3 p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-4 flex-1">
              <Link href="/" className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                <span className="font-semibold">CineVerse</span>
              </Link>
              <div className="flex items-center gap-2 ml-auto">
                <ThemeToggle />
                <Button variant="outline" size="sm" asChild>
                  <Link href="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="sticky top-0 z-10 hidden md:block bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="container flex h-14 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="container py-6 px-4 md:px-6">{children}</div>
      </main>
    </div>
  );
}
