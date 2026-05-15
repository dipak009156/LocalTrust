import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import CustomerBottomNav from '../customer/BottomNav';
import WorkerBottomNav from '../worker/BottomNav';

export default function ResponsiveLayout({ children, role = 'customer' }) {
  const location = useLocation();

  const BottomNav = role === 'worker' ? WorkerBottomNav : CustomerBottomNav;

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Desktop Sidebar - Fixed on the left */}
      <div className="hidden lg:block w-72 h-screen sticky top-0 flex-shrink-0">
        <Sidebar role={role} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Scrollable Container — extra bottom padding on mobile for the nav bar */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative pb-16 lg:pb-0">
          <div className="max-w-7xl mx-auto min-h-full bg-white lg:shadow-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Bottom Navigation — rendered once here for ALL pages */}
        <div className="lg:hidden shrink-0 border-t border-gray-100 bg-white/80 backdrop-blur-md z-50">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
