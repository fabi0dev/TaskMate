import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateHourDifference(
  startTime: string,
  endTime: string
): string {
  const [startHourStr, startMinuteStr] = startTime.split(":");
  const startHour = parseInt(startHourStr);
  const startMinute = parseInt(startMinuteStr);

  const [endHourStr, endMinuteStr] = endTime.split(":");
  const endHour = parseInt(endHourStr);
  const endMinute = parseInt(endMinuteStr);

  const totalStartMinutes = startHour * 60 + startMinute;
  const totalEndMinutes = endHour * 60 + endMinute;
  const minuteDifference = totalEndMinutes - totalStartMinutes;

  const hours = Math.floor(minuteDifference / 60);
  const minutes = minuteDifference % 60;

  let differenceString = "";
  if (hours > 0) {
    differenceString += `${hours} Hora${hours > 1 ? "s" : ""}`;
  }
  if (minutes > 0) {
    if (differenceString !== "") {
      differenceString += " ";
    }
    differenceString += `e ${minutes} Minuto${minutes > 1 ? "s" : ""}`;
  }

  return differenceString;
}
