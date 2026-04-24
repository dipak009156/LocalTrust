import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import { setRole } from './store/authSlice';
import { resetFlow } from './store/flowSlice';
import { store } from './store/store';

/**
 * RoleBootstrap — sets role in Redux synchronously (before children render)
 * by dispatching directly to the store, avoiding the useEffect timing gap.
 */
function RoleBootstrap({ role, children }) {
  // Use useMemo so it runs on the same render cycle, not after paint
  useMemo(() => {
    const current = store.getState().auth.role;
    if (current !== role) {
      store.dispatch(setRole(role));
      store.dispatch(resetFlow());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<Landing />} />

        {/* Customer login → /login */}
        <Route
          path="/login"
          element={
            <RoleBootstrap role="USER">
              <LoginPage />
            </RoleBootstrap>
          }
        />

        {/* Worker / partner onboarding → /join */}
        <Route
          path="/join"
          element={
            <RoleBootstrap role="WORKER">
              <LoginPage />
            </RoleBootstrap>
          }
        />

        {/* Admin login — hidden URL, only admins should know this */}
        <Route
          path="/admin-portal-xk92"
          element={
            <RoleBootstrap role="ADMIN">
              <LoginPage />
            </RoleBootstrap>
          }
        />

        {/* Placeholder dashboards — wire up later */}
        <Route path="/dashboard" element={<div className="p-10 text-2xl font-bold">Customer Dashboard 🚧</div>} />
        <Route path="/admin" element={<div className="p-10 text-2xl font-bold">Admin Dashboard 🚧</div>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
