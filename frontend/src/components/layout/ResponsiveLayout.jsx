import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from '../customer/BottomNav'; // We'll eventually make this generic

export default function ResponsiveLayout({ children, role = 'customer' }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Desktop Sidebar - Fixed on the left */}
      <div className="hidden lg:block w-72 h-screen sticky top-0 flex-shrink-0">
        <Sidebar role={role} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative h-screen">
        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
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

        {/* Mobile Bottom Navigation - Sticky at bottom */}
        <div className="lg:hidden shrink-0">
           {/* Note: We'll eventually move BottomNav logic here to avoid duplication in pages */}
           {/* For now, we'll keep it as is but hide it on large screens inside the component itself */}
        </div>
      </div>
    </div>
  );
}
