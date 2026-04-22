import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { configureApiAuth, fetchJson } from '@/api/client';
import { decodeJwtPayload, isTokenExpired } from '@/auth/jwt';
import { ACCESS_TOKEN_STORAGE_KEY } from '@/auth/tokenStorage';

const STORAGE_KEY = ACCESS_TOKEN_STORAGE_KEY;

export interface AuthUser {
  id: number;
  email: string;
}

interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function userFromToken(token: string): AuthUser | null {
  const claims = decodeJwtPayload(token);
  if (!claims?.sub) return null;
  const id = Number(claims.sub);
  if (!Number.isFinite(id)) return null;
  const email = typeof claims.email === 'string' ? claims.email : '';
  return { id, email };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored || isTokenExpired(stored)) {
        if (stored) localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return stored;
    } catch {
      return null;
    }
  });

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
  }, []);

  // useLayoutEffect so getToken is registered before child useEffects (e.g. Orders load)
  // run — otherwise fetchJson(..., { auth: true }) can fire with the default () => null getter.
  useLayoutEffect(() => {
    configureApiAuth({
      getToken: () => {
        try {
          const t = localStorage.getItem(STORAGE_KEY);
          if (!t || isTokenExpired(t)) {
            if (t) logout();
            return null;
          }
          return t;
        } catch {
          return null;
        }
      },
      onUnauthorized: () => {
        logout();
      },
    });
  }, [logout]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetchJson<TokenResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim(), password }),
    });
    if (!res.accessToken) throw new Error('No access token in response');
    if (isTokenExpired(res.accessToken)) throw new Error('Token already expired');
    localStorage.setItem(STORAGE_KEY, res.accessToken);
    setToken(res.accessToken);
  }, []);

  const user = useMemo(() => (token ? userFromToken(token) : null), [token]);

  useEffect(() => {
    if (token && isTokenExpired(token)) logout();
  }, [token, logout]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
