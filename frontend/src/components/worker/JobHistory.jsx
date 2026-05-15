import { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import api from '../../utils/api';

const CATEGORY_ICONS = {
  'Plumbing':'🚰','Electrical':'⚡','Cleaning':'🧹',
  'AC Repair':'❄️','Carpentry':'🪚','Painting':'🎨',
};

export default function JobHistory() {
  const [tab, setTab]             = useState('all');
  const [jobs, setJobs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    api.get('/worker/jobs')
      .then(r => setJobs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = tab === 'all' ? jobs : jobs.filter(j => j.status === tab);

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const STATUS_COLOR = {
    confirmed: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    disputed:  'bg-red-100 text-red-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-20">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Job History</h1>
        <div className="flex bg-gray-200 p-1 rounded-xl">
          {['all','confirmed','disputed'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors capitalize ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              {t === 'all' ? 'All' : t === 'confirmed' ? 'Completed' : 'Disputed'}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4 overflow-y-auto">
        {loading && [...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100" />
        ))}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-400 font-semibold py-10">No jobs found.</div>
        )}

        {filtered.map(job => {
          const catName = job.category?.name ?? 'Service';
          const icon    = CATEGORY_ICONS[catName] ?? '🔧';
          const earning = job.earning;
          return (
            <div key={job.id} onClick={() => setSelectedJob(job)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 bg-gray-50 text-2xl flex items-center justify-center rounded-xl border border-gray-100">{icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{catName}</h3>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">{job.user?.name ?? 'Customer'} · {fmt(job.createdAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">₹{earning?.netAmount ? Math.round(earning.netAmount) : job.basePrice}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${STATUS_COLOR[job.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {job.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedJob && (
        <div className="absolute inset-0 bg-gray-900/40 z-30 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900">{selectedJob.category?.name}</h3>
                <p className="text-sm font-bold text-gray-500">Booking #{selectedJob.id.slice(0,8)}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-gray-400 p-2 bg-gray-50 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-4">
              <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
                <span>Gross</span><span>₹{selectedJob.basePrice}</span>
              </div>
              {selectedJob.earning && (<>
                <div className="flex justify-between text-sm font-semibold text-gray-600 mb-2">
                  <span>Commission</span><span className="text-red-500">-₹{Math.round(selectedJob.earning.commission)}</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between text-base font-black text-gray-900">
                  <span>Net Earned</span><span className="text-green-600">₹{Math.round(selectedJob.earning.netAmount)}</span>
                </div>
              </>)}
            </div>
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Address</p>
              <p className="text-sm font-bold text-gray-900">{selectedJob.address}</p>
            </div>
            <button onClick={() => setSelectedJob(null)} className="w-full font-bold py-4 rounded-2xl border border-gray-200 text-gray-900 hover:bg-gray-50">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
