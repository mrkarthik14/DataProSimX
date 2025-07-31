import { Link, useLocation } from "wouter";
import { User } from "@shared/schema";
import { BarChart3, Star, User as UserIcon } from "lucide-react";

interface NavigationProps {
  user?: User;
}

export default function Navigation({ user }: NavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/simulation", label: "Simulation" },
    { href: "/progress", label: "Progress" },
    { href: "#mentorship", label: "AI Mentor" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">DataProSimX</h1>
            </div>
            <div className="hidden md:flex items-center space-x-1 ml-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                      location === item.href || (item.href === "/dashboard" && location === "/")
                        ? "text-primary bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 rounded-full border border-amber-200">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-700">{user.xp} XP</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              {user && (
                <div className="hidden sm:flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs text-gray-500">
                    {user.role?.replace("_", " ")} • Level {user.level}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
