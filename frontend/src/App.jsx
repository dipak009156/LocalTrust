import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useMemo } from 'react';
import Landing from './pages/Landing';
import LoginPage from './pages/LoginPage';
import Customer from './pages/Customer';
import { setRole } from './store/authSlice';
import { resetFlow } from './store/flowSlice';
import { store } from './store/store';

import Home from './components/customer/Home';
import Category from './components/customer/Category';
import BookingConfirm from './components/customer/BookingConfirm';
import Waiting from './components/customer/Waiting';
import WorkerFound from './components/customer/WorkerFound';
import LiveTracking from './components/customer/LiveTracking';
import OtpCheckin from './components/customer/OtpCheckin';
import JobInProgress from './components/customer/JobInProgress';
import JobCompleted from './components/customer/JobCompleted';
import Dispute from './components/customer/Dispute';
import DisputeStatus from './components/customer/DisputeStatus';
import Review from './components/customer/Review';
import Receipt from './components/customer/Receipt';
import Bookings from './components/customer/Bookings';
import BookingDetail from './components/customer/BookingDetail';
import Favourites from './components/customer/Favourites';
import Profile from './components/customer/Profile';
import Chat from './components/customer/Chat';
import AddressPicker from './components/customer/AddressPicker';
import WorkerDetail from './components/customer/WorkerDetail';

import WorkerLayout from './pages/Worker';
import WorkerDashboard from './components/worker/Dashboard';
import EnRoute from './components/worker/EnRoute';
import OtpEntry from './components/worker/OtpEntry';
import WorkerJobInProgress from './components/worker/JobInProgress';
import ProofUpload from './components/worker/ProofUpload';
import JobConfirmed from './components/worker/JobConfirmed';
import DisputeAlert from './components/worker/DisputeAlert';
import DisputeResponse from './components/worker/DisputeResponse';
import DisputeOutcome from './components/worker/DisputeOutcome';
import Earnings from './components/worker/Earnings';
import WorkerJobHistory from './components/worker/JobHistory';
import WorkerProfile from './components/worker/Profile';
import WorkerChat from './components/worker/Chat';
import Settings from './components/worker/Settings';

// Admin Imports
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './components/admin/Dashboard';
import AdminCustomers from './components/admin/Customers';
import AdminWorkers from './components/admin/Workers';
import AdminVerifications from './components/admin/Verifications';
import AdminBookings from './components/admin/Bookings';
import AdminBookingDetail from './components/admin/BookingDetail';
import AdminDisputes from './components/admin/Disputes';
import AdminAnalytics from './components/admin/Analytics';
import AdminSettings from './components/admin/Settings';

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

        {/* Customer Flow inside MobileLayout via Customer layout component */}
        <Route path="/customer" element={<Customer />}>
          <Route path="home" element={<Home />} />
          <Route path="category/:id" element={<Category />} />
          <Route path="book" element={<BookingConfirm />} />
          <Route path="waiting" element={<Waiting />} />
          <Route path="worker-found" element={<WorkerFound />} />
          <Route path="live-tracking" element={<LiveTracking />} />
          <Route path="otp-checkin" element={<OtpCheckin />} />
          <Route path="job-in-progress" element={<JobInProgress />} />
          <Route path="job-completed" element={<JobCompleted />} />
          <Route path="dispute" element={<Dispute />} />
          <Route path="dispute-status" element={<DisputeStatus />} />
          <Route path="review" element={<Review />} />
          <Route path="receipt" element={<Receipt />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="booking-detail" element={<BookingDetail />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="address-picker" element={<AddressPicker />} />
          <Route path="worker-detail" element={<WorkerDetail />} />
          <Route index element={<Navigate to="home" replace />} />
        </Route>

        {/* Worker Flow inside MobileLayout via Worker layout component */}
        <Route path="/worker" element={<WorkerLayout />}>
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="en-route" element={<EnRoute />} />
          <Route path="otp-entry" element={<OtpEntry />} />
          <Route path="job-in-progress" element={<WorkerJobInProgress />} />
          <Route path="proof-upload" element={<ProofUpload />} />
          <Route path="job-confirmed" element={<JobConfirmed />} />
          <Route path="dispute-alert" element={<DisputeAlert />} />
          <Route path="dispute-response" element={<DisputeResponse />} />
          <Route path="dispute-outcome" element={<DisputeOutcome />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="job-history" element={<WorkerJobHistory />} />
          <Route path="profile" element={<WorkerProfile />} />
          <Route path="chat" element={<WorkerChat />} />
          <Route path="settings" element={<Settings />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Admin Flow */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="workers" element={<AdminWorkers />} />
          <Route path="verifications" element={<AdminVerifications />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="bookings/:id" element={<AdminBookingDetail />} />
          <Route path="disputes" element={<AdminDisputes />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Placeholder dashboards — wire up later */}
        <Route path="/dashboard" element={<div className="p-10 text-2xl font-bold">Customer Dashboard 🚧</div>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
