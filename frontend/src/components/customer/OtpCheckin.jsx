import { useNavigate } from 'react-router-dom';

export default function OtpCheckin() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Worker Arrived</h1>
        <p className="text-gray-600 font-medium mb-8">Please share this secure PIN with Ramesh to start the job.</p>

        <div className="flex gap-4 justify-center mb-8">
          {['4', '9', '2', '1'].map((num, i) => (
            <div key={i} className="w-16 h-20 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-4xl font-extrabold text-blue-700">
              {num}
            </div>
          ))}
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3 text-sm font-medium text-orange-900 text-left">
          <svg className="w-5 h-5 shrink-0 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          Do not share this PIN until you have verified the worker's identity at your door.
        </div>

        <button onClick={() => navigate('/customer/job-in-progress')} className="mt-8 text-sm text-gray-400 font-semibold underline">
          [Simulate OTP Entered]
        </button>
      </div>
    </div>
  );
}
