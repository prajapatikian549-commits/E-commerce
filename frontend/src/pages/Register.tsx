import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { fetchJson } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import type { User } from '@/types';

export function Register() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [useCustomPassword, setUseCustomPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const body: { email: string; name: string; password?: string } = {
        email: email.trim(),
        name: name.trim(),
      };
      if (useCustomPassword && password.length >= 8) {
        body.password = password;
      }
      await fetchJson<User>('/api/users', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      setSuccess('Account created. You can sign in now (default password is "password" if you did not set one).');
      setEmail('');
      setName('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page auth-page">
      <h1>Create account</h1>
      <p className="lede">
        <code>POST /api/users</code> is public. If you skip a custom password, the backend uses{' '}
        <code>password</code> for development.
      </p>

      <section className="panel auth-panel">
        <form className="form-grid single-col" onSubmit={handleSubmit}>
          {error && <p className="error span-full">{error}</p>}
          {success && <p className="success span-full">{success}</p>}
          <label className="span-full">
            Email
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </label>
          <label className="span-full">
            Display name
            <input
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
            />
          </label>
          <label className="checkbox-row span-full">
            <input
              type="checkbox"
              checked={useCustomPassword}
              onChange={(ev) => setUseCustomPassword(ev.target.checked)}
            />
            Set my own password (min 8 characters)
          </label>
          {useCustomPassword && (
            <label className="span-full">
              Password
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                required={useCustomPassword}
              />
            </label>
          )}
          <div className="form-actions span-full">
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? 'Creating…' : 'Create account'}
            </button>
          </div>
        </form>
        <p className="muted small auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </div>
  );
}
