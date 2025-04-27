"use client";

import React, { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  User,
  CalendarDays,
  MessageSquare,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface User {
  id: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  role: string;
  // Add other properties as needed
}

const Navigation = ({ user }: { user: User }) => {
  const pathname = usePathname();

  // Define los enlaces de navegación según el rol
  const getNavLinks = () => {
    const baseLinks = [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        label: "Citas",
        href: "/appointments",
        icon: <Calendar className="h-5 w-5" />,
      },
    ];

    if (user.role === "DOCTOR") {
      return [
        ...baseLinks,
        {
          label: "Disponibilidad",
          href: "/availability",
          icon: <CalendarDays className="h-5 w-5" />,
        },
        {
          label: "Pacientes",
          href: "/patients",
          icon: <Users className="h-5 w-5" />,
        },
        {
          label: "Notificaciones",
          href: "/notifications",
          icon: <MessageSquare className="h-5 w-5" />,
        },
        {
          label: "Estadísticas",
          href: "/stats",
          icon: <BarChart3 className="h-5 w-5" />,
        },
        {
          label: "Ajustes",
          href: "/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    } else if (user.role === "PATIENT") {
      return [
        ...baseLinks,
        {
          label: "Mis Doctores",
          href: "/doctors",
          icon: <Users className="h-5 w-5" />,
        },
        {
          label: "Historial Médico",
          href: "/medical-records",
          icon: <ShieldCheck className="h-5 w-5" />,
        },
        {
          label: "Notificaciones",
          href: "/notifications",
          icon: <Bell className="h-5 w-5" />,
        },
        {
          label: "Perfil",
          href: "/profile",
          icon: <User className="h-5 w-5" />,
        },
      ];
    } else if (user.role === "ADMIN") {
      return [
        ...baseLinks,
        {
          label: "Usuarios",
          href: "/admin/users",
          icon: <Users className="h-5 w-5" />,
        },
        {
          label: "Días Festivos",
          href: "/admin/holidays",
          icon: <CalendarDays className="h-5 w-5" />,
        },
        {
          label: "Notificaciones",
          href: "/notifications",
          icon: <Bell className="h-5 w-5" />,
        },
        {
          label: "Configuración",
          href: "/admin/settings",
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <div className="flex flex-col gap-2">
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          <Button
            variant={pathname === link.href ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            {link.icon}
            <span className="ml-2">{link.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  );
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Si no hay usuario autenticado, no renderizar nada
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar para escritorio */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-[80] bg-card">
        <div className="h-full px-3 py-4 overflow-y-auto border-r">
          <div className="flex items-center justify-between mb-6 px-2">
            <Link href="/dashboard" className="text-xl font-bold">
              SysMed
            </Link>
          </div>

          <div className="flex flex-col gap-1 mb-6 px-2">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback>
                  {user.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.displayName}</p>
                <Badge variant="outline" className="mt-0.5 text-xs">
                  {user.role === "DOCTOR"
                    ? "Médico"
                    : user.role === "PATIENT"
                    ? "Paciente"
                    : "Administrador"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <ScrollArea className="flex-1">
            <Navigation user={user} />
          </ScrollArea>

          <div className="pt-2 mt-6">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => logout()}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Cerrar sesión</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Sidebar móvil */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="h-full px-3 py-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6 px-2">
              <Link
                href="/dashboard"
                className="text-xl font-bold"
                onClick={() => setMobileSidebarOpen(false)}
              >
                SysMed
              </Link>
            </div>

            <div className="flex flex-col gap-1 mb-6 px-2">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={user.photoURL || ""} />
                  <AvatarFallback>
                    {user.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.displayName}</p>
                  <Badge variant="outline" className="mt-0.5 text-xs">
                    {user.role === "DOCTOR"
                      ? "Médico"
                      : user.role === "PATIENT"
                      ? "Paciente"
                      : "Administrador"}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex-1" onClick={() => setMobileSidebarOpen(false)}>
              <Navigation user={user} />
            </div>

            <div className="pt-2 mt-6">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => logout()}
              >
                <LogOut className="h-5 w-5" />
                <span className="ml-2">Cerrar sesión</span>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Contenido principal */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Barra superior en móvil */}
        <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background md:hidden">
          <div className="flex items-center px-4">
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <div className="flex-1 flex justify-between items-center">
              <Link href="/dashboard" className="text-xl font-bold">
                SysMed
              </Link>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback>
                  {user.displayName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Contenido de la página */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
