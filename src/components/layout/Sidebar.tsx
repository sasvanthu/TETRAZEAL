import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Wallet,
  GraduationCap,
  LineChart,
  FileText,
  Users,
  Settings,
  Landmark,
  Zap,
  Sparkles,
  Calculator,
  BarChart3,
  Bell,
  LogOut
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Loan Management", path: "/loans", icon: Wallet },
  { name: "Financial Literacy", path: "/training", icon: GraduationCap },
  { name: "Smart Tools", path: "/tools", icon: LineChart },
  { name: "EMI Calculator", path: "/emi-calculator", icon: Calculator },
  { name: "Financial Score", path: "/financial-score", icon: BarChart3 },
  { name: "Analytics", path: "/analytics", icon: LineChart },
  { name: "Notifications", path: "/notifications", icon: Bell },
  { name: "Gov Schemes", path: "/schemes", icon: Landmark },
  { name: "Documents", path: "/documents", icon: FileText },
  { name: "Community", path: "/community", icon: Users },
  { name: "AI Advisor", path: "/ai-advisor", icon: Sparkles },
  { name: "Settings", path: "/settings", icon: Settings }
];

export const Sidebar = () => {

  const user = JSON.parse(localStorage.getItem("loggedUser") || "{}");

  const logout = () => {

    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if(confirmLogout){
      localStorage.removeItem("loggedUser");
      window.location.href = "/login";
    }

  };

  const initials =
    user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (

    <div className="flex h-screen w-64 flex-col border-r border-white/10 bg-black/40 backdrop-blur-xl">

      {/* Logo */}

      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 shadow-lg">
          <Zap className="h-4 w-4 text-white" />
        </div>

        <h1 className="text-xl font-bold text-white">
          FinZeal
        </h1>

      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">

        {navItems.map((item) => (

          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )
            }
          >

            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 h-6 w-1 rounded-r-full bg-emerald-500"
                  />
                )}

                <item.icon className="mr-3 h-4 w-4" />

                {item.name}
              </>
            )}

          </NavLink>

        ))}

      </nav>

      {/* User Section */}

      <div className="border-t border-white/10 p-3">

        <div className="rounded-xl bg-white/5 p-3">

          <div className="flex items-center gap-3">

            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              {initials}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-semibold text-white">
                {user.name || "User"}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user.email || "user@email.com"}
              </p>

            </div>

          </div>

          <button
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/80 py-2 text-sm font-medium text-white hover:bg-red-600 transition"
          >
            <LogOut className="h-4 w-4"/>
            Logout
          </button>

        </div>

      </div>

    </div>

  );

};