import { addMinutes, getDay, isAfter, isBefore, parseISO, set } from "date-fns";

type AvailabilityInput = {
  dayOfWeek: number | null;
  date: Date | string | null;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
};

function minutes(time: string) {
  const [hours, mins] = time.split(":").map(Number);
  return hours * 60 + mins;
}

export function validateAvailabilityWindow(startTime: string, endTime: string) {
  if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
    return false;
  }
  return minutes(startTime) < minutes(endTime);
}

export function isScheduledInsideAvailability(
  availability: AvailabilityInput,
  scheduledAtValue: Date | string,
  durationMin: number
) {
  const scheduledAt = typeof scheduledAtValue === "string" ? parseISO(scheduledAtValue) : scheduledAtValue;
  const endAt = addMinutes(scheduledAt, durationMin);
  const [startHour, startMinute] = availability.startTime.split(":").map(Number);
  const [endHour, endMinute] = availability.endTime.split(":").map(Number);
  const windowStart = set(scheduledAt, { hours: startHour, minutes: startMinute, seconds: 0, milliseconds: 0 });
  const windowEnd = set(scheduledAt, { hours: endHour, minutes: endMinute, seconds: 0, milliseconds: 0 });

  if (availability.isRecurring) {
    if (availability.dayOfWeek === null || availability.dayOfWeek !== getDay(scheduledAt)) return false;
  } else if (availability.date) {
    const date = typeof availability.date === "string" ? parseISO(availability.date) : availability.date;
    if (date.toDateString() !== scheduledAt.toDateString()) return false;
  }

  return !isBefore(scheduledAt, windowStart) && !isAfter(endAt, windowEnd);
}
