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
  if (isDateTba || !startDate) return 'OPENING_SOON';
  
  const end = endDate ? new Date(endDate) : new Date(startDate);
  const now = new Date();
  
  // If the event is entirely in the past
  if (now > end) {
    return 'COMPLETED';
  }
  
  // If registration is closed
  if (registrationClose && now > new Date(registrationClose)) {
    return 'CLOSED';
  }
  
  // If registration hasn't opened yet
  if (registrationOpen && now < new Date(registrationOpen)) {
    return 'OPENING_SOON';
  }
  
  // Default: Open
  return 'OPEN';
}
