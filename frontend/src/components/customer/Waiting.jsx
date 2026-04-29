import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WaitingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Replace with real Socket.io listening for worker match
    const timer = setTimeout(() => {
      navigate('/customer/worker-found');
    }, 3000); // simulate 3 sec wait
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-blue-700 text-white p-6">
      <div className="relative w-32 h-32 flex items-center justify-center mb-8">
        <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-4xl">🔍</span>
      </div>
      <h2 className="text-2xl font-extrabold mb-2 text-center">Finding a trusted worker</h2>
      <p className="text-blue-200 text-center font-medium">Scanning your area for available and verified professionals...</p>
    </div>
  );
}
