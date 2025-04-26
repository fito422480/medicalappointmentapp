import { addDays, startOfWeek } from "date-fns";

export function getStartOfWeek(date: Date): Date {
  // Retorna el lunes de la semana correspondiente
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function getWeekDays(date: Date): Date[] {
  // Devuelve un array de los 7 días de la semana que contiene 'date'
  const start = getStartOfWeek(date);
  return Array.from({ length: 7 }).map((_, idx) => addDays(start, idx));
}
