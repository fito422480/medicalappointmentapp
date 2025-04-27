"use client";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import MedicalCalendar from "@/components/medical/MedicalCalendar";
import { useState, useEffect } from "react";
import {
  getDoctorProfile,
  getPatientProfile,
  getDoctorAppointments,
  getPatientAppointments,
} from "@/lib/firebase/db";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        let appointmentsData;

        if (user.role === "DOCTOR") {
          appointmentsData = await getDoctorAppointments(user.uid);
          setSelectedDoctor(user.uid);
        } else if (user.role === "PATIENT") {
          appointmentsData = await getPatientAppointments(user.uid);
          // Obtener la lista de doctores para pacientes
          // Esta función sería necesaria implementarla
          const doctorsData = await getAvailableDoctors();
          setDoctors(doctorsData);
        }

        setAppointments(appointmentsData || []);
      } catch (error) {
        console.error("Error al obtener datos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, router]);

  const handleTimeSlotSelect = (date, time, doctorId) => {
    console.log(`Seleccionado: ${date} ${time} con el doctor ${doctorId}`);
    // Implementar lógica para reservar cita
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="container mx-auto p-4">
      <MedicalCalendar
        appointments={appointments}
        doctors={doctors}
        selectedDoctor={selectedDoctor}
        onTimeSlotSelect={handleTimeSlotSelect}
        userRole={user?.role || "PATIENT"}
      />
    </div>
  );
}

// Esta función es un placeholder - necesitarás implementarla
async function getAvailableDoctors() {
  // Implementar lógica para obtener doctores disponibles
  return [];
}
