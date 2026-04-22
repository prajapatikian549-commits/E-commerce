import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/AuthContext';

export function Layout() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="header">
        <Link to="/" className="logo">
          Shop
        </Link>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : undefined)}>
            Home
          </NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/users" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Users
              </NavLink>
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Products
              </NavLink>
              <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Orders
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : undefined)}>
                Products
              </NavLink>
              <span className="nav-hint muted">Sign in for Users &amp; Orders</span>
            </>
          )}
        </nav>
        <div className="header-actions">
          {isAuthenticated && user ? (
            <>
              <span className="header-user muted" title={user.email}>
                {user.email}
              </span>
              <button type="button" className="btn ghost" onClick={() => logout()}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn ghost">
                Sign in
              </Link>
              <Link to="/register" className="btn primary">
                Register
              </Link>
            </>
          )}
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <span>
          API gateway <code className="footer-code">/api</code> · Vite dev server proxies to{' '}
          <code className="footer-code">127.0.0.1:8080</code>
        </span>
      </footer>
    </div>
  );
}
