import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const WorkerContext = createContext();

export function WorkerProvider({ children }) {
  const [isOnline, setIsOnline]           = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);
  const [workerInfo, setWorkerInfo]       = useState({
    name: '', role: '', rating: 0, jobs: 0, avatar: null,
  });

  const refreshActiveBooking = useCallback(async () => {
    try {
      const { data } = await api.get('/worker/jobs');
      const active = data.find(j => ['accepted', 'in_progress', 'disputed'].includes(j.status));
      if (active) {
        const payload = {
          id:       active.id,
          service:  active.category?.name,
          customer: active.user?.name,
          phone:    active.user?.phone,
          address:  active.address,
          price:    active.finalPrice ?? active.basePrice,
          lat:      active.lat,
          lng:      active.lng,
          status:   active.status,
          note:     active.problemDesc ?? '',
        };
        setActiveBooking(payload);
        return payload;
      } else {
        setActiveBooking(null);
        return null;
      }
    } catch {
      return null;
    }
  }, []);

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

    refreshActiveBooking();
  }, [refreshActiveBooking]);

  return (
    <WorkerContext.Provider value={{
      isOnline, setIsOnline,
      activeBooking, setActiveBooking,
      workerInfo, setWorkerInfo,
      refreshActiveBooking,
    }}>
      {children}
    </WorkerContext.Provider>
  );
}

export function useWorker() {
  return useContext(WorkerContext);
}
