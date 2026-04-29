import { useNavigate } from 'react-router-dom';
import { useWorker } from '../../context/WorkerContext';

export default function JobConfirmed() {
  const navigate = useNavigate();
  const { setActiveBooking } = useWorker();

  // TODO: Socket.io listen for booking_confirmed event

  const handleDashboard = () => {
    setActiveBooking(null); // clear context
    navigate('/worker/dashboard');
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto pb-32">
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 shadow-sm">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center animate-in slide-in-from-bottom-2 fade-in duration-500 delay-100">Job Confirmed!</h1>
        <p className="text-gray-500 font-medium mb-10 text-center animate-in slide-in-from-bottom-2 fade-in duration-500 delay-200">
          The customer confirmed your work. Escrow has been released to your wallet.
        </p>

        <div className="bg-gray-50 w-full rounded-3xl p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 fade-in duration-500 delay-300">
          <h3 className="font-bold text-gray-900 text-sm mb-4 uppercase tracking-wide">Escrow Released</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Amount Earned</span>
              <span>₹249</span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-gray-600">
              <span>Platform Commission (10%)</span>
              <span className="text-red-500">-₹24.9</span>
            </div>
            <div className="h-px w-full bg-gray-200 my-1"></div>
            <div className="flex justify-between text-xl font-black text-gray-900">
              <span>Net Received</span>
              <span className="text-green-600">₹224.1</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3">
        <button onClick={handleDashboard} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Go to Dashboard
        </button>
        <button onClick={() => navigate('/worker/earnings')} className="w-full text-blue-700 font-bold py-3 text-sm hover:underline">
          View Earnings
        </button>
      </div>
    </div>
  );
}
