import { Outlet } from 'react-router-dom';
import ResponsiveLayout from '../components/layout/ResponsiveLayout';
import { WorkerProvider } from '../context/WorkerContext';

export default function Worker() {
  return (
    <WorkerProvider>
      <ResponsiveLayout role="worker">
        <Outlet />
      </ResponsiveLayout>
    </WorkerProvider>
  );
}
