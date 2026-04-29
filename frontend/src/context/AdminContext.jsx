import { createContext, useContext, useState } from 'react';

const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [activeDisputes, setActiveDisputes] = useState(3);
  const [pendingVerifications, setPendingVerifications] = useState(12);

  return (
    <AdminContext.Provider value={{
      activeDisputes, setActiveDisputes,
      pendingVerifications, setPendingVerifications
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
