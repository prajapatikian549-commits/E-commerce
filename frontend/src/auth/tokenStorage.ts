/** Must match {@link AuthContext} localStorage key. */
export const ACCESS_TOKEN_STORAGE_KEY = 'ecommerce_access_token';

export function readAccessTokenFromStorage(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}
