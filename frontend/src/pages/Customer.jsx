import { Outlet } from 'react-router-dom';
import MobileLayout from '../components/MobileLayout';

export default function Customer() {
  return (
    <MobileLayout>
      <Outlet />
    </MobileLayout>
  );
}
