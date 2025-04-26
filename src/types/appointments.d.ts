import { z } from "zod";

// Define the Appointment type
export const AppointmentSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  doctorId: z.string(),
  patientId: z.string(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

// Define the Doctor type
export const DoctorSchema = z.object({
  id: z.string(),
  name: z.string(),
  specialty: z.string(),
  email: z.string(),
});

export type Doctor = z.infer<typeof DoctorSchema>;

// Define the User type
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().nullable(),
  displayName: z.string().nullable(),
  role: z.string().optional()
});

export type User = z.infer<typeof UserSchema>;

// Supongamos que 'appointment' es una nueva cita
const newAppointment: Appointment = {
  id: "1234",
  title: "Consulta con el Dr. Pérez",
  description: "Revisión anual",
  date: "2025-04-26",
  startTime: "10:00",
  endTime: "11:00",
  status: "scheduled",
  doctorId: "doctor-123",
  patientId: "patient-123",
};

// Validar la cita usando Zod
const validation = AppointmentSchema.safeParse(newAppointment);

if (!validation.success) {
  console.log(validation.error.format());
} else {
  console.log("Cita válida", validation.data);
}
