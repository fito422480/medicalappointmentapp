// src/types/appointments.d.ts
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
  doctorName: z.string().optional(),
  patientId: z.string(),
  patientName: z.string().optional(),
  specialty: z.string().optional(),
  notes: z.string().optional(),
  cancelReason: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  cancelledAt: z.date().optional(),
  completedAt: z.date().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

// Define the Doctor type
export const DoctorSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
  specialty: z.string(),
  profileImage: z.string().optional(),
  biography: z.string().optional(),
  education: z.array(z.string()).optional(),
  address: z.string().optional(),
  yearsOfExperience: z.number().optional(),
  rating: z.number().optional(),
  availability: z.record(z.string(), z.array(z.string())).optional(),
});

export type Doctor = z.infer<typeof DoctorSchema>;

// Define the Patient type
export const PatientSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).optional(),
  bloodType: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  medicalConditions: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z
    .object({
      name: z.string(),
      phoneNumber: z.string(),
      relationship: z.string(),
    })
    .optional(),
  address: z.string().optional(),
  insuranceInfo: z
    .object({
      provider: z.string(),
      policyNumber: z.string(),
      validUntil: z.string().optional(),
    })
    .optional(),
});

export type Patient = z.infer<typeof PatientSchema>;

// Define Holiday Date type
export const HolidayDateSchema = z.object({
  id: z.string(),
  date: z.string(), // formato 'YYYY-MM-DD'
  name: z.string(),
  isFullDay: z.boolean().default(true),
  startTime: z.string().optional(), // Si no es día completo
  endTime: z.string().optional(), // Si no es día completo
  description: z.string().optional(),
  createdAt: z.date().optional(),
});

export type HolidayDate = z.infer<typeof HolidayDateSchema>;

// Define TimeSlot type
export const TimeSlotSchema = z.object({
  time: z.string(),
  enabled: z.boolean(),
});

export type TimeSlot = z.infer<typeof TimeSlotSchema>;

// Define DayAvailability type
export const DayAvailabilitySchema = z.object({
  date: z.string(),
  enabled: z.boolean(),
  timeSlots: z.array(TimeSlotSchema),
});

export type DayAvailability = z.infer<typeof DayAvailabilitySchema>;

// Define DoctorAvailabilityConfig type
export const DoctorAvailabilityConfigSchema = z.object({
  doctorId: z.string(),
  availability: z.array(DayAvailabilitySchema),
  workingDays: z.array(z.number()),
  defaultTimeSlots: z.array(TimeSlotSchema),
});

export type DoctorAvailabilityConfig = z.infer<
  typeof DoctorAvailabilityConfigSchema
>;
