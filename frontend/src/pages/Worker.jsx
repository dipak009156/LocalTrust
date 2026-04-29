import { Outlet } from 'react-router-dom';
import MobileLayout from '../components/MobileLayout';
import { WorkerProvider } from '../context/WorkerContext';

export default function Worker() {
  return (
    <WorkerProvider>
      <MobileLayout>
        <Outlet />
      </MobileLayout>
    </WorkerProvider>
  );
}
