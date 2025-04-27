import {
  getDoctorAppointments,
  getPatientAppointments,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  completeAppointment,
} from "@/lib/firebase/db";
import { getDoctorAvailability } from "@/lib/firebase/db";
import { getHolidays } from "@/lib/firebase/db";
import { Appointment } from "@/types/appointments";
import { sendWhatsAppMessage } from "./whatsapp-service";

// Comprobar disponibilidad para una cita
export async function checkAppointmentAvailability(
  doctorId: string,
  date: string,
  startTime: string
): Promise<boolean> {
  try {
    // 1. Verificar si es día festivo
    const holidays = await getHolidays();
    const isHoliday = holidays.some((holiday) => holiday.date === date);

    if (isHoliday) {
      return false;
    }

    // 2. Verificar disponibilidad del doctor
    const doctorAvailability = await getDoctorAvailability(doctorId);

    // Verificar si el día está habilitado
    const dayAvailability = doctorAvailability.availability.find(
      (day) => day.date === date
    );

    if (!dayAvailability || !dayAvailability.enabled) {
      // Si no hay configuración específica para ese día, verificar el día de la semana
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay(); // 0 = domingo, 1 = lunes, etc.

      if (!doctorAvailability.workingDays.includes(dayOfWeek)) {
        return false;
      }

      // Verificar si el horario está disponible en la configuración predeterminada
      const timeSlot = doctorAvailability.defaultTimeSlots.find(
        (slot) => slot.time === startTime
      );
      if (!timeSlot || !timeSlot.enabled) {
        return false;
      }
    } else {
      // Verificar si el horario está disponible en la configuración específica del día
      const timeSlot = dayAvailability.timeSlots.find(
        (slot) => slot.time === startTime
      );
      if (!timeSlot || !timeSlot.enabled) {
        return false;
      }
    }

    // 3. Verificar si ya existe otra cita en ese horario
    const appointments = await getDoctorAppointments(doctorId);
    const conflictingAppointment = appointments.find(
      (apt) =>
        apt.date === date &&
        apt.startTime === startTime &&
        apt.status === "scheduled"
    );

    if (conflictingAppointment) {
      return false;
    }

    // Todo en orden, el horario está disponible
    return true;
  } catch (error) {
    console.error("Error al verificar disponibilidad:", error);
    throw error;
  }
}

// Reservar una cita
export async function bookAppointment(
  appointmentData: Omit<Appointment, "id">
): Promise<string> {
  try {
    // 1. Verificar disponibilidad
    const isAvailable = await checkAppointmentAvailability(
      appointmentData.doctorId,
      appointmentData.date,
      appointmentData.startTime
    );

    if (!isAvailable) {
      throw new Error("El horario seleccionado no está disponible");
    }

    // 2. Crear la cita
    const appointmentId = await createAppointment(appointmentData);

    // 3. Enviar notificación de confirmación por WhatsApp
    try {
      if (appointmentData.patientName) {
        await sendWhatsAppMessage({
          recipient: "", // Aquí iría el número de teléfono del paciente
          recipientName: appointmentData.patientName,
          content: `Hola ${appointmentData.patientName}, tu cita ha sido confirmada para el ${appointmentData.date} a las ${appointmentData.startTime}. Te esperamos.`,
          type: "appointment_confirmation",
        });
      }
    } catch (whatsappError) {
      // No fallar la reserva si falla el envío de WhatsApp
      console.error("Error al enviar notificación WhatsApp:", whatsappError);
    }

    return appointmentId;
  } catch (error) {
    console.error("Error al reservar cita:", error);
    throw error;
  }
}

// Cancelar una cita con notificación
export async function cancelAppointmentWithNotification(
  appointmentId: string,
  cancelReason?: string
): Promise<void> {
  try {
    // 1. Obtener detalles de la cita antes de cancelarla
    const appointments = await getDoctorAppointments("all"); // Obtener todas las citas
    const appointment = appointments.find((apt) => apt.id === appointmentId);

    if (!appointment) {
      throw new Error("Cita no encontrada");
    }

    // 2. Cancelar la cita en la base de datos
    await cancelAppointment(appointmentId, cancelReason);

    // 3. Enviar notificación por WhatsApp
    try {
      if (appointment.patientName) {
        await sendWhatsAppMessage({
          recipient: "", // Aquí iría el número de teléfono del paciente
          recipientName: appointment.patientName,
          content: `Hola ${appointment.patientName}, tu cita del ${
            appointment.date
          } a las ${appointment.startTime} ha sido cancelada. ${
            cancelReason ? `Motivo: ${cancelReason}.` : ""
          } Por favor, contáctanos para reprogramar.`,
          type: "appointment_cancellation",
        });
      }
    } catch (whatsappError) {
      // No fallar la cancelación si falla el envío de WhatsApp
      console.error("Error al enviar notificación WhatsApp:", whatsappError);
    }
  } catch (error) {
    console.error("Error al cancelar cita con notificación:", error);
    throw error;
  }
}

// Enviar recordatorio de cita
export async function sendAppointmentReminder(
  appointmentId: string
): Promise<void> {
  try {
    // 1. Obtener detalles de la cita
    const appointments = await getDoctorAppointments("all"); // Obtener todas las citas
    const appointment = appointments.find((apt) => apt.id === appointmentId);

    if (!appointment) {
      throw new Error("Cita no encontrada");
    }

    // 2. Verificar que la cita no esté cancelada
    if (appointment.status === "cancelled") {
      throw new Error(
        "No se puede enviar recordatorio para una cita cancelada"
      );
    }

    // 3. Enviar recordatorio por WhatsApp
    if (appointment.patientName) {
      await sendWhatsAppMessage({
        recipient: "", // Aquí iría el número de teléfono del paciente
        recipientName: appointment.patientName,
        content: `Hola ${
          appointment.patientName
        }, te recordamos tu cita programada para el ${appointment.date} a las ${
          appointment.startTime
        } con ${
          appointment.doctorName || "su doctor"
        }. Por favor confirma respondiendo a este mensaje.`,
        type: "appointment_reminder",
      });
    }
  } catch (error) {
    console.error("Error al enviar recordatorio de cita:", error);
    throw error;
  }
}

// Obtener lista de citas para el dashboard
export async function getUpcomingAppointments(
  userId: string,
  userRole: "DOCTOR" | "PATIENT",
  limit?: number
): Promise<Appointment[]> {
  try {
    // Obtener citas según el rol del usuario
    let appointments: Appointment[];

    if (userRole === "DOCTOR") {
      appointments = await getDoctorAppointments(userId);
    } else {
      appointments = await getPatientAppointments(userId);
    }

    // Filtrar solo las citas programadas
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      aptDate.setHours(0, 0, 0, 0);
      return aptDate >= today && apt.status === "scheduled";
    });

    // Ordenar por fecha y hora
    upcomingAppointments.sort((a, b) => {
      const dateComparison =
        new Date(a.date).getTime() - new Date(b.date).getTime();
      if (dateComparison === 0) {
        return a.startTime.localeCompare(b.startTime);
      }
      return dateComparison;
    });

    // Limitar la cantidad si es necesario
    if (limit && upcomingAppointments.length > limit) {
      return upcomingAppointments.slice(0, limit);
    }

    return upcomingAppointments;
  } catch (error) {
    console.error("Error al obtener próximas citas:", error);
    throw error;
  }
}
