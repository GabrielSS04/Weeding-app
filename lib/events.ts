export type EventKey = "casamento" | "charraia";

const RSVP_LEAD_DAYS = 3;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const DATES: Record<EventKey, Date> = {
  casamento: new Date("2026-12-12T00:00:00-03:00"),
  charraia: new Date("2026-07-18T00:00:00-03:00"),
};

export function getEventDate(event: EventKey): Date {
  return DATES[event];
}

export function getRsvpDeadline(event: EventKey): Date {
  const eventDate = DATES[event];
  const deadline = new Date(eventDate.getTime() - RSVP_LEAD_DAYS * MS_PER_DAY);
  deadline.setHours(23, 59, 59, 999);
  return deadline;
}

export function isRsvpClosed(event: EventKey, now: Date = new Date()): boolean {
  return now.getTime() > getRsvpDeadline(event).getTime();
}

export function eventByRsvpPath(path: string): EventKey | null {
  if (path === "/casamento/rsvp") return "casamento";
  if (path === "/charraia/rsvp") return "charraia";
  return null;
}

export function formatRsvpDeadline(event: EventKey): string {
  return getRsvpDeadline(event).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  });
}
