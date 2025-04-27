"use client";

import React from "react";
import { format, addMinutes } from "date-fns";

interface TimeGridProps {
  startHour?: number;
  endHour?: number;
  interval?: number;
  onTimeClick?: (time: string) => void;
}

const TimeGrid: React.FC<TimeGridProps> = ({
  startHour = 8,
  endHour = 20,
  interval = 30,
  onTimeClick,
}) => {
  const generateTimes = () => {
    const times = [];
    let current = new Date();
    current.setHours(startHour, 0, 0, 0);
    const end = new Date();
    end.setHours(endHour, 0, 0, 0);

    while (current <= end) {
      times.push(format(current, "HH:mm"));
      current = addMinutes(current, interval);
    }

    return times;
  };

  const times = generateTimes();

  return (
    <div className="grid grid-cols-1 gap-2">
      {times.map((time) => (
        <button
          key={time}
          onClick={() => onTimeClick?.(time)}
          className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {time}
        </button>
      ))}
    </div>
  );
};

export default TimeGrid;
