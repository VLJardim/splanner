// Simple tids-hjælpere (UTC <-> lokal)
export function toUTCISO(local: Date): string {
  // konverter lokalt tidspunkt til UTC ISO
  const d = new Date(local.getTime() - local.getTimezoneOffset() * 60000);
  return d.toISOString();
}

export function fromUTC(utcISO: string): Date {
  // parse UTC ISO til Date (vises i lokal tid i UI)
  return new Date(utcISO);
}
