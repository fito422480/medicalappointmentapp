// src/components/calendar/CalendarView.tsx

import { FC } from "react";
import { Appointment, Doctor } from "@/types/appointments";
import { startOfWeek, addDays, format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  currentDate: Date;
  appointments: Appointment[];
  doctors: Doctor[];
  currentView: string;
  loadingAppointments: boolean;
}

const CalendarView: FC<Props> = ({
  currentDate,
  appointments,
  doctors,
  currentView,
  loadingAppointments,
}) => {
  if (loadingAppointments) {
    return <div className="text-center py-20">⏳ Cargando citas...</div>;
  }

  if (!appointments.length) {
    return (
      <div className="text-center py-20">😕 No hay citas programadas.</div>
    );
  }

  const start = startOfWeek(currentDate, { weekStartsOn: 1 }); // lunes
  const days = Array.from({ length: 7 }).map((_, idx) => addDays(start, idx));

  return (
    <div className="grid grid-cols-7 gap-4">
      {days.map((day, idx) => {
        const formattedDate = format(day, "yyyy-MM-dd"); // Formato para comparar
        const dayAppointments = appointments.filter(
          (appt) => format(new Date(appt.date), "yyyy-MM-dd") === formattedDate // Comparar solo fecha (sin hora)
        );

        return (
          <div
            key={idx}
            className="border p-4 rounded-md shadow-sm hover:shadow-md transition bg-white"
          >
            <div className="font-semibold mb-2">
              {format(day, "EEEE", { locale: es })}
            </div>
            <div className="text-sm text-gray-600 mb-4">{formattedDate}</div>

            {dayAppointments.length ? (
              dayAppointments.map((appt) => {
                const doctor = doctors.find((doc) => doc.id === appt.doctorId);
                return (
                  <div
                    key={appt.id}
                    className="p-2 mb-2 rounded bg-indigo-100 text-indigo-800 text-sm"
                  >
                    <div className="font-medium">{appt.patientName}</div>
                    <div className="text-xs">
                      {doctor ? doctor.name : "Doctor desconocido"}
                    </div>
                    <div className="text-xs">
                      {format(new Date(appt.date), "HH:mm")}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-400 text-sm italic">Sin citas</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarView;
