"use client";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import DoctorAvailabilityManager from "@/components/doctor/DoctorAvailabilityManager";
import { useState, useEffect } from "react";

export default function AvailabilityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Solo permitir acceso a médicos
    if (user.role !== "DOCTOR") {
      router.push("/dashboard");
      return;
    }

    setLoading(false);
  }, [user, router]);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <DoctorAvailabilityManager doctorId={user?.uid || ""} />
    </div>
  );
}
