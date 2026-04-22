export interface JwtClaims {
  sub?: string;
  email?: string;
  exp?: number;
}

export function decodeJwtPayload(token: string): JwtClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    return JSON.parse(atob(padded)) as JwtClaims;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewSeconds = 30): boolean {
  const claims = decodeJwtPayload(token);
  if (claims?.exp == null) return true;
  const expMs = claims.exp * 1000;
  return Date.now() >= expMs - skewSeconds * 1000;
}
