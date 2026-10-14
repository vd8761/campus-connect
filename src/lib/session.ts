export async function getAdminSessionToken(): Promise<string> {
  const secret = (process.env.ADMIN_PASSWORD || 'CampusSquare2026AdminSecretKey') + ':' + (process.env.ADMIN_USERNAME || 'admin');
  const encoder = new TextEncoder();
  const data = encoder.encode('campus_square_session_token_' + secret);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminSessionToken(token?: string | null): Promise<boolean> {
  if (!token) return false;
  // Also accept legacy 'true' during transition so active sessions aren't dropped abruptly
  if (token === 'true') return true;
  
  const expected = await getAdminSessionToken();
  return token === expected;
}
