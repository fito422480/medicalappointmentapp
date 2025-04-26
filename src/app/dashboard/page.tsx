"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { getDoctorProfile, getPatientProfile, getDoctorAppointments, getPatientAppointments } from "@/lib/firebase/db";
import { Appointment } from "@/types/appointments";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Activity, Clock, ChevronRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Profile {
  displayName: string;
  role?: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        let profileData;
        let appointmentsData;

        if (user.role === "DOCTOR") {
          profileData = await getDoctorProfile(user.uid);
          appointmentsData = await getDoctorAppointments(user.uid);
        } else if (user.role === "PATIENT") {
          profileData = await getPatientProfile(user.uid);
          appointmentsData = await getPatientAppointments(user.uid);
        }

        setProfile({
          displayName: profileData?.displayName || "Nombre no disponible",
          role: user.role,
        });
        
        // Transform Firestore data to match Appointment type
        const transformedAppointments = appointmentsData?.map(app => ({
          id: app.id,
          title: app.title,
          description: app.description,
          date: app.date,
          startTime: app.startTime,
          endTime: app.endTime,
          status: app.status,
          doctorId: app.doctorId,
          patientId: app.patientId
        })) || [];
        
        setAppointments(transformedAppointments);
        calculateStats(transformedAppointments);
      } catch (error) {
        console.error("Error al obtener datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const calculateStats = (appointmentsData: Appointment[]) => {
    const upcoming = appointmentsData.filter((apt) => apt.status === "scheduled").length;
    const completed = appointmentsData.filter((apt) => apt.status === "completed").length;
    const cancelled = appointmentsData.filter((apt) => apt.status === "cancelled").length;
    setStats({ upcoming, completed, cancelled, total: appointmentsData.length });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Aquí continúa el código del Dashboard que ya creamos anteriormente */}
    </div>
  );
}
