"use client";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", roles: ["SUPER_ADMIN", "BRANCH_ADMIN", "TEACHER"] },
    { href: "/students", label: "Students", roles: ["SUPER_ADMIN", "BRANCH_ADMIN", "TEACHER"] },
    { href: "/attendance", label: "Attendance", roles: ["SUPER_ADMIN", "BRANCH_ADMIN", "TEACHER"] },
    { href: "/fees", label: "Fees", roles: ["SUPER_ADMIN", "BRANCH_ADMIN"] },
    { href: "/exams", label: "Exams", roles: ["SUPER_ADMIN", "BRANCH_ADMIN", "TEACHER"] },
    { href: "/announcements", label: "Announcements", roles: ["SUPER_ADMIN", "BRANCH_ADMIN", "TEACHER"] },
  ];

  const allowedItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              School Admin
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              {allowedItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user.email} ({user.role})
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
