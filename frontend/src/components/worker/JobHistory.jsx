import { useState } from 'react';
import BottomNav from './BottomNav';

export default function JobHistory() {
  const [tab, setTab] = useState('all'); // all, completed, disputed
  const [selectedJob, setSelectedJob] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // TODO: GET /workers/jobs
  const jobs = [
    { id: 'TW8492', service: 'Tap Repair', icon: '🚰', customer: 'Priya Sharma', date: 'Today, 10:30 AM', gross: 249, net: 224, status: 'completed', address: 'Andheri West' },
    { id: 'TW8493', service: 'Pipe Leak', icon: '🔧', customer: 'Rahul Verma', date: '11 Oct, 4:00 PM', gross: 449, net: 404, status: 'disputed', address: 'Bandra West' },
    { id: 'TW8494', service: 'Shower Fitting', icon: '🚿', customer: 'Sneha R.', date: '10 Oct, 2:00 PM', gross: 299, net: 269, status: 'completed', address: 'Juhu' },
  ];

  const filteredJobs = tab === 'all' ? jobs : jobs.filter(j => j.status === tab);

  // Pull to refresh simulation
  const handleTouchStart = (e) => {
    if (e.touches[0].clientY < 100) {
      setIsRefreshing(true);
      setTimeout(() => setIsRefreshing(false), 1500);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-20" onTouchStart={handleTouchStart}>
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Job History</h1>
        <div className="flex bg-gray-200 p-1 rounded-xl">
          <button onClick={() => setTab('all')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>All</button>
          <button onClick={() => setTab('completed')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === 'completed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Completed</button>
          <button onClick={() => setTab('disputed')} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === 'disputed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Disputed</button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4 overflow-y-auto">
        {isRefreshing && (
          <div className="flex justify-center mb-2 animate-in fade-in slide-in-from-top-2">
            <span className="bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">Refreshing...</span>
          </div>
        )}

        {filteredJobs.map(job => (
          <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3 active:scale-95 transition-transform cursor-pointer">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gray-50 text-2xl flex items-center justify-center rounded-xl border border-gray-100">{job.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">{job.service}</h3>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">{job.customer}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-gray-900">₹{job.gross}</p>
                {job.status === 'completed' ? (
                  <span className="inline-block mt-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Completed</span>
                ) : (
                  <span className="inline-block mt-1 bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">Disputed</span>
                )}
              </div>
            </div>
            <div className="text-xs font-semibold text-gray-400 bg-gray-50 py-1.5 px-3 rounded-lg w-fit">
              {job.date}
            </div>
          </div>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center text-gray-500 font-semibold py-10">No jobs found in this category.</div>
        )}
      </div>

      {/* Bottom Sheet for Job Detail */}
      {selectedJob && (
        <div className="absolute inset-0 bg-gray-900/40 z-30 flex items-end animate-in fade-in">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom-full duration-300">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">{selectedJob.service}</h3>
                <p className="text-sm font-bold text-gray-500">Booking #{selectedJob.id}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 p-2 bg-gray-50 rounded-full"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="flex flex-col gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
                  <span>Gross Amount</span>
                  <span>₹{selectedJob.gross}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
                  <span>Commission</span>
                  <span className="text-red-500">-₹{selectedJob.gross - selectedJob.net}</span>
                </div>
                <div className="h-px w-full bg-gray-200 my-2"></div>
                <div className="flex justify-between text-base font-black text-gray-900">
                  <span>Net Earned</span>
                  <span className="text-green-600">₹{selectedJob.net}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Customer</p>
                <p className="text-sm font-bold text-gray-900">{selectedJob.customer} • {selectedJob.address}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Status</p>
                {selectedJob.status === 'completed' ? (
                  <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide">Job Completed Successfully</span>
                ) : (
                  <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide">Dispute Raised by Customer</span>
                )}
              </div>
            </div>

            <button onClick={() => setSelectedJob(null)} className="w-full font-bold py-4 rounded-2xl border border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
