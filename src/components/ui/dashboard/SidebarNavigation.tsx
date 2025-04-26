// src/components/dashboard/SidebarNavigation.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Inicio", href: "/" },
  { name: "Citas", href: "/appointments" },
  { name: "Pacientes", href: "/patients" },
  { name: "Ajustes", href: "/settings" },
];

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-gray-900 text-white p-6">
      <nav className="flex flex-col gap-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`p-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-gray-700 font-semibold"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
