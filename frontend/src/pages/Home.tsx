import { Link } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

export function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page">
      <h1>E-commerce demo</h1>
      <p className="lede">
        This UI calls your Spring Cloud Gateway at <code>/api</code> (Vite proxies to{' '}
        <code>127.0.0.1:8080</code>). Public routes: register, login, and <strong>GET</strong> products.
        Everything else sends a <code>Bearer</code> JWT from login.
      </p>

      {!isAuthenticated && (
        <section className="panel panel-highlight">
          <h2>Get started</h2>
          <p className="muted">
            Create an account (or use an existing user), then sign in. Default password is{' '}
            <code>password</code> unless you chose your own at registration.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn primary">
              Register
            </Link>
            <Link to="/login" className="btn ghost">
              Sign in
            </Link>
          </div>
        </section>
      )}

      <ul className="cards">
        <li className="card">
          <h2>Users</h2>
          <p>List and create users. Listing requires JWT; creating a user stays public on the API.</p>
          {isAuthenticated ? (
            <Link to="/users" className="btn primary">
              Open users
            </Link>
          ) : (
            <Link to="/login" className="btn primary">
              Sign in to manage users
            </Link>
          )}
        </li>
        <li className="card">
          <h2>Products</h2>
          <p>Browse the catalog anonymously. Add products when signed in.</p>
          <Link to="/products" className="btn primary">
            Open products
          </Link>
        </li>
        <li className="card">
          <h2>Orders</h2>
          <p>Place orders and view history with a valid token.</p>
          {isAuthenticated ? (
            <Link to="/orders" className="btn primary">
              Open orders
            </Link>
          ) : (
            <Link to="/login" className="btn primary">
              Sign in for orders
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
}
