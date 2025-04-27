"use client";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import HolidayManager from "@/components/admin/HolidayManager";

export default function HolidayManagerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Solo permitir acceso a administradores
    if (user.role !== "ADMIN" && user.role !== "DOCTOR") {
      router.push("/dashboard");
      return;
    }

    setLoading(false);
  }, [user, router]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <HolidayManager />
    </div>
  );
}
