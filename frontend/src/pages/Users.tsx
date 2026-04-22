import { useCallback, useEffect, useState } from 'react';
import { fetchJson } from '@/api/client';
import type { User } from '@/types';

export function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('demo@shop.local');
  const [name, setName] = useState('Demo User');

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchJson<User[]>('/api/users', { auth: true });
      setUsers(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await fetchJson<User>('/api/users', {
        method: 'POST',
        body: JSON.stringify({ email, name }),
      });
      setEmail('demo@shop.local');
      setName('Demo User');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    }
  }

  return (
    <div className="page">
      <h1>Users</h1>

      <section className="panel">
        <h2>Add user</h2>
        <form className="form-row" onSubmit={handleCreate}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </label>
          <label>
            Name
            <input
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn primary">
            Create
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>All users</h2>
          <button type="button" className="btn ghost" onClick={() => void load()}>
            Refresh
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Name</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.name}</td>
                    <td>{new Date(u.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <p className="muted">No users yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
