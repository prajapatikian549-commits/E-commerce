import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchJson } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import type { Product } from '@/types';

export function Products() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('Sample item');
  const [description, setDescription] = useState('Demo product');
  const [price, setPrice] = useState('9.99');
  const [stock, setStock] = useState('100');

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchJson<Product[]>('/api/products');
      setProducts(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load products');
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
      await fetchJson<Product>('/api/products', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          stock: Number(stock),
        }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    }
  }

  return (
    <div className="page">
      <h1>Products</h1>
      <p className="lede">
        Browsing the catalog is public. Creating products requires a signed-in user (JWT on{' '}
        <code>POST /api/products</code>).
      </p>

      {isAuthenticated ? (
        <section className="panel">
          <h2>Add product</h2>
          <form className="form-grid" onSubmit={handleCreate}>
            <label>
              Name
              <input value={name} onChange={(ev) => setName(ev.target.value)} required />
            </label>
            <label className="span-2">
              Description
              <input value={description} onChange={(ev) => setDescription(ev.target.value)} />
            </label>
            <label>
              Price
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
                required
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(ev) => setStock(ev.target.value)}
                required
              />
            </label>
            <div className="form-actions">
              <button type="submit" className="btn primary">
                Create
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="panel panel-muted">
          <h2>Add product</h2>
          <p className="muted">
            <Link to="/login">Sign in</Link> to create catalog items (admin-style demo).
          </p>
        </section>
      )}

      <section className="panel">
        <div className="panel-head">
          <h2>Catalog</h2>
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
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <p className="muted">No products yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
}
