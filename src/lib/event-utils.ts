export type EventStatus = 'DRAFT' | 'OPENING_SOON' | 'OPEN' | 'CLOSED' | 'COMPLETED';

export function getEventStatus(
  startDate: Date,
  endDate: Date,
  registrationOpen: Date | null,
  registrationClose: Date | null,
  isDraft: boolean = false
): EventStatus {
  if (isDraft) return 'DRAFT';
  
  const now = new Date();
  
  // Normalize dates to avoid timezone issues during comparison
  // For simplicity, we just use the raw dates if they exist.
  
  // If the event is entirely in the past
  if (now > endDate) {
    return 'COMPLETED';
  }
  
  // If registration is closed
  if (registrationClose && now > registrationClose) {
    return 'CLOSED';
  }
  
  // If registration hasn't opened yet
  if (registrationOpen && now < registrationOpen) {
    return 'OPENING_SOON';
  }
  
  // Default: Open
  return 'OPEN';
}
