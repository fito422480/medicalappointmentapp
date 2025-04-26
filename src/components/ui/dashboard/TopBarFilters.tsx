import { FC } from "react";
import { Doctor } from "@/types/appointments";

interface Props {
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  doctors: Doctor[];
  selectedDoctor: string;
  setSelectedDoctor: (doctorId: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  loadingDoctors: boolean;
}

const TopBarFilters: FC<Props> = ({
  currentDate,
  onPrevWeek,
  onNextWeek,
  onToday,
  doctors,
  selectedDoctor,
  setSelectedDoctor,
  currentView,
  setCurrentView,
  loadingDoctors,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevWeek}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 transition"
        >
          ⬅️ Anterior
        </button>
        <button
          onClick={onToday}
          className="bg-indigo-500 text-white px-3 py-2 rounded hover:bg-indigo-600 transition"
        >
          Hoy
        </button>
        <button
          onClick={onNextWeek}
          className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 transition"
        >
          Siguiente ➡️
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          className="border rounded px-2 py-2"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          disabled={loadingDoctors}
        >
          <option value="todos">Todos los doctores</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded px-2 py-2"
          value={currentView}
          onChange={(e) => setCurrentView(e.target.value)}
        >
          <option value="week">Semana</option>
          <option value="day">Día</option>
        </select>
      </div>
    </div>
  );
};

export default TopBarFilters;
