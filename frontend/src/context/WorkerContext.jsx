import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const WorkerContext = createContext();

export function WorkerProvider({ children }) {
  const [isOnline, setIsOnline]         = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [workerInfo, setWorkerInfo]     = useState({
    name: '', role: '', rating: 0, jobs: 0, avatar: null,
  });

  // Load real worker profile on mount
  useEffect(() => {
    api.get('/worker/profile')
      .then(r => {
        const w = r.data;
        setIsOnline(w.isAvailable ?? false);
        setWorkerInfo({
          name:   w.name ?? '',
          role:   w.skills?.[0]?.category?.name ?? 'Service Provider',
          rating: w.avgRating ?? 0,
          jobs:   w.totalJobs ?? 0,
          avatar: w.profilePhoto ?? null,
        });
      })
      .catch(() => {
        // Not logged in yet — ignore silently
      });
  }, []);

  return (
    <WorkerContext.Provider value={{
      isOnline, setIsOnline,
      activeBooking, setActiveBooking,
      workerInfo, setWorkerInfo,
    }}>
      {children}
    </WorkerContext.Provider>
  );
}

export function useWorker() {
  return useContext(WorkerContext);
}
