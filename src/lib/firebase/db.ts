import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase.config";
import {
  Appointment,
  Doctor,
  Patient,
  HolidayDate,
} from "@/types/appointments";

interface TimeSlot {
  time: string;
  enabled: boolean;
}

interface DoctorAvailability {
  doctorId: string;
  availability: TimeSlot[];
  workingDays: number[];
  defaultTimeSlots: TimeSlot[];
}

// ===== DOCTORS =====

// Obtener perfil de doctor
export async function getDoctorProfile(uid: string): Promise<Doctor | null> {
  try {
    const docRef = doc(db, "doctors", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Doctor;
    }

    return null;
  } catch (error) {
    console.error("Error al obtener perfil del doctor:", error);
    throw error;
  }
}

// Obtener lista de doctores
export async function getDoctors(specialtyFilter?: string): Promise<Doctor[]> {
  try {
    let doctorsQuery;

    if (specialtyFilter) {
      doctorsQuery = query(
        collection(db, "doctors"),
        where("specialty", "==", specialtyFilter)
      );
    } else {
      doctorsQuery = collection(db, "doctors");
    }

    const querySnapshot = await getDocs(doctorsQuery);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Doctor)
    );
  } catch (error) {
    console.error("Error al obtener doctores:", error);
    throw error;
  }
}

// Actualizar perfil de doctor
export async function updateDoctorProfile(
  uid: string,
  data: Partial<Doctor>
): Promise<void> {
  try {
    const docRef = doc(db, "doctors", uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al actualizar perfil del doctor:", error);
    throw error;
  }
}

// ===== PATIENTS =====

// Obtener perfil de paciente
export async function getPatientProfile(uid: string): Promise<Patient | null> {
  try {
    const docRef = doc(db, "patients", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Patient;
    }

    return null;
  } catch (error) {
    console.error("Error al obtener perfil del paciente:", error);
    throw error;
  }
}

// Actualizar perfil de paciente
export async function updatePatientProfile(
  uid: string,
  data: Partial<Patient>
): Promise<void> {
  try {
    const docRef = doc(db, "patients", uid);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al actualizar perfil del paciente:", error);
    throw error;
  }
}

// ===== APPOINTMENTS =====

// Obtener citas de un doctor
export async function getDoctorAppointments(
  doctorId: string
): Promise<Appointment[]> {
  try {
    const q = query(
      collection(db, "appointments"),
      where("doctorId", "==", doctorId),
      orderBy("date", "asc"),
      orderBy("startTime", "asc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Convertir Timestamp a string para date si es necesario
      const date =
        data.date instanceof Timestamp
          ? data.date.toDate().toISOString().split("T")[0]
          : data.date;

      return {
        id: doc.id,
        ...data,
        date,
      } as Appointment;
    });
  } catch (error) {
    console.error("Error al obtener citas del doctor:", error);
    throw error;
  }
}

// Obtener citas de un paciente
export async function getPatientAppointments(
  patientId: string
): Promise<Appointment[]> {
  try {
    const q = query(
      collection(db, "appointments"),
      where("patientId", "==", patientId),
      orderBy("date", "asc"),
      orderBy("startTime", "asc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();

      // Convertir Timestamp a string para date si es necesario
      const date =
        data.date instanceof Timestamp
          ? data.date.toDate().toISOString().split("T")[0]
          : data.date;

      return {
        id: doc.id,
        ...data,
        date,
      } as Appointment;
    });
  } catch (error) {
    console.error("Error al obtener citas del paciente:", error);
    throw error;
  }
}

// Crear una nueva cita
export async function createAppointment(
  appointmentData: Omit<Appointment, "id">
): Promise<string> {
  try {
    // Preparar fecha (convertir a Timestamp si es un string)
    let date = appointmentData.date;
    if (typeof date === "string") {
      // Convertir string a Date y luego a Timestamp
      const dateObj = new Date(date);
      date = Timestamp.fromDate(dateObj) as unknown as string;
    }

    const docRef = await addDoc(collection(db, "appointments"), {
      ...appointmentData,
      date,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error al crear cita:", error);
    throw error;
  }
}

// Actualizar una cita
export async function updateAppointment(
  id: string,
  data: Partial<Appointment>
): Promise<void> {
  try {
    // Preparar fecha (convertir a Timestamp si es un string)
    if (data.date && typeof data.date === "string") {
      // Convertir string a Date y luego a Timestamp
      const dateObj = new Date(data.date);
      data.date = Timestamp.fromDate(dateObj) as unknown as string;
    }

    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al actualizar cita:", error);
    throw error;
  }
}

// Cancelar una cita
export async function cancelAppointment(
  id: string,
  cancelReason?: string
): Promise<void> {
  try {
    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, {
      status: "cancelled",
      cancelReason,
      cancelledAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al cancelar cita:", error);
    throw error;
  }
}

// Marcar cita como completada
export async function completeAppointment(
  id: string,
  notes?: string
): Promise<void> {
  try {
    const docRef = doc(db, "appointments", id);
    await updateDoc(docRef, {
      status: "completed",
      notes,
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al completar cita:", error);
    throw error;
  }
}

// ===== HOLIDAYS =====

// Obtener días festivos
export async function getHolidays(year?: number): Promise<HolidayDate[]> {
  try {
    let holidaysQuery;

    if (year) {
      // Filtrar por año
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;

      holidaysQuery = query(
        collection(db, "holidays"),
        where("date", ">=", startDate),
        where("date", "<=", endDate),
        orderBy("date", "asc")
      );
    } else {
      // Obtener todos, ordenados por fecha
      holidaysQuery = query(collection(db, "holidays"), orderBy("date", "asc"));
    }

    const querySnapshot = await getDocs(holidaysQuery);

    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as HolidayDate)
    );
  } catch (error) {
    console.error("Error al obtener días festivos:", error);
    throw error;
  }
}

// Añadir un día festivo
export async function addHoliday(
  holiday: Omit<HolidayDate, "id">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "holidays"), {
      ...holiday,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error al añadir día festivo:", error);
    throw error;
  }
}

// Eliminar un día festivo
export async function deleteHoliday(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "holidays", id));
  } catch (error) {
    console.error("Error al eliminar día festivo:", error);
    throw error;
  }
}

// ===== DOCTOR AVAILABILITY =====

// Obtener disponibilidad del doctor
export async function getDoctorAvailability(
  doctorId: string
): Promise<DoctorAvailability> {
  try {
    const docRef = doc(db, "doctorAvailability", doctorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as DoctorAvailability;
    }

    // Retornar disponibilidad por defecto si no existe
    return {
      doctorId,
      availability: [],
      workingDays: [1, 2, 3, 4, 5], // Lunes a viernes por defecto
      defaultTimeSlots: [
        { time: "08:00", enabled: true },
        { time: "08:30", enabled: true },
        { time: "09:00", enabled: true },
        { time: "09:30", enabled: true },
        { time: "10:00", enabled: true },
        { time: "10:30", enabled: true },
        { time: "11:00", enabled: true },
        { time: "11:30", enabled: true },
        { time: "12:00", enabled: true },
        { time: "12:30", enabled: true },
        { time: "13:00", enabled: true },
        { time: "13:30", enabled: true },
        { time: "14:00", enabled: true },
        { time: "14:30", enabled: true },
        { time: "15:00", enabled: true },
        { time: "15:30", enabled: true },
        { time: "16:00", enabled: true },
        { time: "16:30", enabled: true },
      ],
    };
  } catch (error) {
    console.error("Error al obtener disponibilidad del doctor:", error);
    throw error;
  }
}

// Guardar disponibilidad del doctor
export async function saveDoctorAvailability(
  doctorId: string,
  availabilityData: Partial<DoctorAvailability>
): Promise<void> {
  try {
    const docRef = doc(db, "doctorAvailability", doctorId);
    await updateDoc(docRef, {
      ...availabilityData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error al guardar disponibilidad del doctor:", error);
    throw error;
  }
}
