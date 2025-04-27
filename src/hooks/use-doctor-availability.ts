// src/hooks/use-doctor-availability.ts
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase/firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface DayAvailability {
  date: string;
  enabled: boolean;
  timeSlots: { time: string; enabled: boolean }[];
}

export interface DoctorAvailabilityConfig {
  doctorId: string;
  availability: DayAvailability[];
  workingDays: number[];
  defaultTimeSlots: { time: string; enabled: boolean }[];
}

export function useDoctorAvailability(doctorId: string) {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<DoctorAvailabilityConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAvailability() {
      if (!doctorId) return;

      try {
        setLoading(true);
        const docRef = doc(db, "doctorAvailability", doctorId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setConfig(docSnap.data() as DoctorAvailabilityConfig);
        } else {
          // Configuración predeterminada si no existe
          const defaultConfig: DoctorAvailabilityConfig = {
            doctorId,
            availability: [],
            workingDays: [1, 2, 3, 4, 5], // Lunes a viernes
            defaultTimeSlots: [
              "08:00",
              "08:30",
              "09:00",
              "09:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "12:00",
              "12:30",
              "13:00",
              "13:30",
              "14:00",
              "14:30",
              "15:00",
              "15:30",
              "16:00",
              "16:30",
              "17:00",
              "17:30",
              "18:00",
            ].map((time) => ({ time, enabled: true })),
          };
          setConfig(defaultConfig);
        }
      } catch (err) {
        console.error("Error al obtener disponibilidad:", err);
        setError("No se pudo cargar la información de disponibilidad");
      } finally {
        setLoading(false);
      }
    }

    fetchAvailability();
  }, [doctorId]);

  const saveAvailability = async (updatedConfig: DoctorAvailabilityConfig) => {
    if (!doctorId) return;

    try {
      setLoading(true);
      const docRef = doc(db, "doctorAvailability", doctorId);
      await setDoc(docRef, updatedConfig);
      setConfig(updatedConfig);
      return true;
    } catch (err) {
      console.error("Error al guardar disponibilidad:", err);
      setError("No se pudo guardar la configuración");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { config, loading, error, saveAvailability };
}
