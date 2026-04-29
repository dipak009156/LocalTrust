import { useNavigate } from 'react-router-dom';

export default function JobInProgress() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-blue-700 pt-12 pb-10 px-6 flex flex-col items-center justify-center text-white">
        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full mb-4">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Job In Progress</span>
        </div>
        <h1 className="text-5xl font-black tabular-nums">00:45:22</h1>
      </div>

      <div className="p-6 flex flex-col gap-6 -mt-6 relative z-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <img src="https://i.pravatar.cc/150?img=11" alt="Worker" className="w-20 h-20 rounded-full border-4 border-white shadow-md mb-4" />
          <h2 className="text-xl font-extrabold text-gray-900">Ramesh is working</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Tap Repair • Booking #TW8492</p>

          <div className="flex w-full gap-3 mt-6">
            <button onClick={() => navigate('/customer/chat')} className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl hover:bg-gray-100 flex items-center justify-center gap-2">
              Chat
            </button>
            <button className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center hover:bg-red-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </button>
          </div>
        </div>

        <button onClick={() => navigate('/customer/job-completed')} className="w-full text-xs text-gray-400 font-semibold underline text-center">
          [Simulate Job Complete]
        </button>
      </div>
    </div>
  );
}
