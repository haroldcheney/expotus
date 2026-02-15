/**
 * Era calculation logic, ported from EraService.groovy
 */
import { durationInDays, durationInYearsMonthsDays, type Duration } from './dates';

export interface President {
  id: number;
  slug: string;
  firstName: string;
  lastName: string;
  uniqueName?: string;
  startDate: string;
  endDate?: string;
  startTime: number;
  endTime: number;
}

export interface Era {
  startDate: string;
  startTime: number;
  endDate: string | null;
  endTime: number;
  durationInDays: number;
  durationInYearsMonthsDays: Duration;
  presidents: President[];
  added: President | null;
  dropped: President | null;
}

function shortName(p: President): string {
  return p.uniqueName || p.lastName;
}

export function getShortName(p: President): string {
  return shortName(p);
}

export function getFullName(p: President): string {
  return `${p.firstName} ${p.lastName}`;
}

interface EraEvent {
  startDate: string;
  startTime: number;
  endDate: string | null;
  endTime: number;
  added: President | null;
  dropped: President | null;
}

export function calculateEras(presidents: President[]): Era[] {
  // Build a list of events (one per start date, one per end date)
  const events: EraEvent[] = [];

  for (const p of presidents) {
    events.push({
      startDate: p.startDate,
      startTime: p.startTime,
      endDate: null,
      endTime: 0,
      added: p,
      dropped: null,
    });
    if (p.endDate) {
      events.push({
        startDate: p.endDate,
        startTime: p.endTime,
        endDate: null,
        endTime: 0,
        added: null,
        dropped: p,
      });
    }
  }

  // Sort by date, then by time
  events.sort((a, b) => {
    if (a.startDate === b.startDate) return a.startTime - b.startTime;
    return a.startDate < b.startDate ? -1 : 1;
  });

  // De-duplicate simultaneous events and set end dates
  const deDuped: EraEvent[] = [];
  let previous: EraEvent | null = null;

  for (const event of events) {
    if (previous) {
      previous.endDate = event.startDate;
      previous.endTime = event.startTime;

      if (previous.startDate === event.startDate && previous.startTime === event.startTime) {
        // Combine simultaneous events
        if (event.added) {
          if (previous.added) {
            throw new Error(
              `Invalid data: two presidents became ex-presidents at the same time: ${getFullName(previous.added)} and ${getFullName(event.added)}`
            );
          }
          previous.added = event.added;
        }
        if (event.dropped) {
          if (previous.dropped) {
            throw new Error(
              `Invalid data: two presidents ended ex-presidency at the same time: ${getFullName(previous.dropped)} and ${getFullName(event.dropped)}`
            );
          }
          previous.dropped = event.dropped;
        }
      } else {
        previous = event;
        deDuped.push(event);
      }
    } else {
      previous = event;
      deDuped.push(event);
    }
  }

  // Calculate durations and track current ex-presidents per era
  let current: President[] = [];

  const eras: Era[] = deDuped.map((event) => {
    if (event.added) {
      current = [...current, event.added];
    }
    if (event.dropped) {
      current = current.filter((p) => p.id !== event.dropped!.id);
    }

    return {
      startDate: event.startDate,
      startTime: event.startTime,
      endDate: event.endDate,
      endTime: event.endTime,
      durationInDays: durationInDays(event.startDate, event.endDate),
      durationInYearsMonthsDays: durationInYearsMonthsDays(event.startDate, event.endDate),
      presidents: [...current],
      added: event.added,
      dropped: event.dropped,
    };
  });

  return eras;
}
