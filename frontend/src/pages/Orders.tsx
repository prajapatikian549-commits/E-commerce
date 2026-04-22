import { useCallback, useEffect, useState } from 'react';
import { fetchJson } from '@/api/client';
import { useAuth } from '@/auth/AuthContext';
import type { Order } from '@/types';

export function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState(() => String(user?.id ?? '1'));
  const [productId, setProductId] = useState('1');
  const [quantity, setQuantity] = useState('1');
  const [failPayment, setFailPayment] = useState(false);

  useEffect(() => {
    if (user?.id) setUserId(String(user.id));
  }, [user?.id]);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await fetchJson<Order[]>('/api/orders', { auth: true });
      setOrders(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await fetchJson<Order>('/api/orders', {
        method: 'POST',
        auth: true,
        body: JSON.stringify({
          userId: Number(userId),
          items: [{ productId: Number(productId), quantity: Number(quantity) }],
          failPayment,
        }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Order failed');
    }
  }

  return (
    <div className="page">
      <h1>Orders</h1>
      <p className="lede">
        Orders require JWT authentication. Your user id from the token is prefilled — it must match a row in
        Users (order-service calls user-service; a missing id returns 404, not a successful order).
      </p>

      <section className="panel">
        <h2>Place order</h2>
        <p className="muted small">
          Use product IDs from the Products page. Payment is a stub; toggle failure to exercise the saga.
        </p>
        <form className="form-grid" onSubmit={handlePlaceOrder}>
          <label>
            User ID
            <input
              type="number"
              min="1"
              value={userId}
              onChange={(ev) => setUserId(ev.target.value)}
              required
            />
          </label>
          <label>
            Product ID
            <input
              type="number"
              min="1"
              value={productId}
              onChange={(ev) => setProductId(ev.target.value)}
              required
            />
          </label>
          <label>
            Quantity
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(ev) => setQuantity(ev.target.value)}
              required
            />
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={failPayment}
              onChange={(ev) => setFailPayment(ev.target.checked)}
            />
            Force payment failure (demo)
          </label>
          <div className="form-actions span-3">
            <button type="submit" className="btn primary">
              Place order
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Order history</h2>
          <button type="button" className="btn ghost" onClick={() => void load()}>
            Refresh
          </button>
        </div>
        {error && <p className="error">{error}</p>}
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul className="order-list">
            {orders.map((o) => (
              <li key={o.id} className="order-card">
                <div className="order-card-head">
                  <strong>Order #{o.id}</strong>
                  <span className={`badge status-${o.status.toLowerCase()}`}>{o.status}</span>
                </div>
                <div className="order-meta">
                  <span>User {o.userId}</span>
                  <span>{new Date(o.createdAt).toLocaleString()}</span>
                  <span>Total {o.totalAmount.toFixed(2)}</span>
                </div>
                <ul className="order-lines">
                  {o.lines.map((line) => (
                    <li key={line.id}>
                      Product {line.productId} × {line.quantity} @ {line.unitPrice.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
        {!loading && orders.length === 0 && <p className="muted">No orders yet.</p>}
      </section>
    </div>
  );
}
