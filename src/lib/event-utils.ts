export type EventStatus = 'DRAFT' | 'OPENING_SOON' | 'OPEN' | 'CLOSED' | 'COMPLETED';

export function getEventStatus(
  startDate?: Date | string | null,
  endDate?: Date | string | null,
  registrationOpen?: Date | string | null,
  registrationClose?: Date | string | null,
  isDraft: boolean = false,
  isDateTba: boolean = false
): EventStatus {
  if (isDraft) return 'DRAFT';

  const now = new Date();

  // If registration has an explicit close deadline that has passed
  if (registrationClose && now > new Date(registrationClose)) {
    return 'CLOSED';
  }

  // If the event date is fixed (not TBA), check if it has concluded
  if (!isDateTba && startDate) {
    const end = endDate ? new Date(endDate) : new Date(startDate);
    if (now > end) {
      return 'COMPLETED';
    }
  }

  // If registration open date has not arrived yet
  if (registrationOpen && now < new Date(registrationOpen)) {
    return 'OPENING_SOON';
  }

  // If registration open date is set and has arrived (even if event date is TBA)
  if (registrationOpen && now >= new Date(registrationOpen)) {
    return 'OPEN';
  }

  // If event date is TBA and no registration open date is specified
  if (isDateTba || !startDate) {
    return 'OPENING_SOON';
  }

  // Default: Open
  return 'OPEN';
}
