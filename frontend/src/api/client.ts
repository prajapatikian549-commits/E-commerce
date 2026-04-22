import { readAccessTokenFromStorage } from '@/auth/tokenStorage';

/**
 * In dev, Vite proxies /api -> http://127.0.0.1:8080 (see vite.config.ts).
 * For production preview against a real gateway, set VITE_API_BASE (e.g. https://api.example.com).
 */
export function apiUrl(path: string): string {
  const base = import.meta.env.VITE_API_BASE ?? '';
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

let getAccessToken: () => string | null = () => null;
let onUnauthorized: () => void = () => {};

export function configureApiAuth(options: {
  getToken: () => string | null;
  onUnauthorized: () => void;
}): void {
  getAccessToken = options.getToken;
  onUnauthorized = options.onUnauthorized;
}

export type FetchJsonInit = RequestInit & { auth?: boolean };

export async function fetchJson<T>(
  path: string,
  init?: FetchJsonInit
): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const headers = new Headers(init?.headers);

  if (
    ['POST', 'PUT', 'PATCH'].includes(method) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (init?.auth) {
    const t = getAccessToken() ?? readAccessTokenFromStorage();
    if (t) {
      headers.set('Authorization', `Bearer ${t}`);
    }
  }

  const { auth: _auth, ...rest } = init ?? {};
  const res = await fetch(apiUrl(path), {
    ...rest,
    headers,
  });

  if (res.status === 401 && init?.auth) {
    onUnauthorized();
  }

  if (!res.ok) {
    const text = await res.text();
    let message = text || `${res.status} ${res.statusText}`;
    try {
      const j = JSON.parse(text) as {
        message?: string;
        error?: string;
        detail?: string;
      };
      if (typeof j.message === 'string') message = j.message;
      else if (typeof j.detail === 'string') message = j.detail;
      else if (typeof j.error === 'string') message = j.error;
    } catch {
      /* keep raw */
    }
    throw new Error(message);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}
