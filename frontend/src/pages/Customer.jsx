import { Outlet } from 'react-router-dom';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';

export default function Customer() {
  return (
    <ResponsiveLayout role="customer">
      <Outlet />
    </ResponsiveLayout>
  );
}
