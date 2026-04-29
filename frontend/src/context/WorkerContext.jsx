import { createContext, useContext, useState } from 'react';

const WorkerContext = createContext();

export function WorkerProvider({ children }) {
  const [isOnline, setIsOnline] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  
  // Demo worker info
  const workerInfo = {
    name: 'Ramesh K.',
    role: 'Plumber',
    rating: 4.9,
    jobs: 124,
    avatar: 'https://i.pravatar.cc/150?img=11'
  };

  return (
    <WorkerContext.Provider value={{ isOnline, setIsOnline, activeBooking, setActiveBooking, workerInfo }}>
      {children}
    </WorkerContext.Provider>
  );
}

export function useWorker() {
  return useContext(WorkerContext);
}
