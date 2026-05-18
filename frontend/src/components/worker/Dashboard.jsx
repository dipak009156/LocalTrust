import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useWorker } from '../../context/WorkerContext';
import {
  Wifi, WifiOff, TrendingUp, Clock, MapPin,
  ChevronRight, DollarSign, Zap, RefreshCw
} from 'lucide-react';
import api from '../../utils/api';

const CATEGORY_ICONS = {
  'Plumbing':   '🚰', 'Electrical': '⚡', 'Cleaning': '🧹',
  'AC Repair':  '❄️', 'Carpentry':  '🪚', 'Painting': '🎨',
};

export default function Dashboard() {
  const navigate  = useNavigate();
  const auth      = useSelector(s => s.auth);
  const { isOnline, setIsOnline, activeBooking, setActiveBooking, refreshActiveBooking } = useWorker();

  const [pendingJobs, setPendingJobs]   = useState([]);
  const [earnings, setEarnings]         = useState(null);
  const [jobLoading, setJobLoading]     = useState(false);
  const [availability, setAvailability] = useState(false);
  const [toggling, setToggling]         = useState(false);

  // Job request countdown
  const [timeLeft, setTimeLeft] = useState({});

  // Fetch pending jobs
  const fetchJobs = async () => {
    setJobLoading(true);
    try {
      const { data } = await api.get('/booking/pending');
      setPendingJobs(data);
      // Set 5-min countdown per job
      const times = {};
      data.forEach(j => {
        const created  = new Date(j.createdAt).getTime();
        const remaining = Math.max(0, 300 - Math.floor((Date.now() - created) / 1000));
        times[j.id]    = remaining;
      });
      setTimeLeft(times);
    } catch (err) {
      console.error(err);
    } finally {
      setJobLoading(false);
    }
  };

  // Fetch earnings summary
  const fetchEarnings = async () => {
    try {
      const { data } = await api.get('/worker/earnings');
      const earningRows = data.earnings ?? [];
      const today   = new Date().toDateString();
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

      const todayNet = earningRows
         .filter(e => new Date(e.createdAt).toDateString() === today)
         .reduce((s, e) => s + (e.netAmount ?? 0), 0);
      const weekNet = earningRows
         .filter(e => new Date(e.createdAt).getTime() >= weekAgo)
         .reduce((s, e) => s + (e.netAmount ?? 0), 0);

      setEarnings({ total: data.totalNet ?? 0, today: todayNet, week: weekNet });
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle availability API
  const handleToggle = async () => {
    setToggling(true);
    const next = !isOnline;
    try {
      await api.patch('/worker/availability', { isAvailable: next });
      setIsOnline(next);
      setAvailability(next);
      if (next) fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
    refreshActiveBooking();
    if (isOnline) fetchJobs();
    const interval = setInterval(() => {
      if (isOnline) fetchJobs();
      refreshActiveBooking();
    }, 10000); // refresh jobs every 10s
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline, refreshActiveBooking]);

  // Countdown tick
  useEffect(() => {
    const tick = setInterval(() => {
      setTimeLeft(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => { if (next[id] > 0) next[id] -= 1; });
        return next;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const handleAccept = async (job) => {
    try {
      const { data } = await api.post(`/booking/${job.id}/accept`);
      setActiveBooking({
        id:       job.id,
        service:  job.category?.name,
        customer: job.user?.name,
        phone:    job.user?.phone,
        address:  job.address,
        price:    job.basePrice,
        lat:      job.lat,
        lng:      job.lng,
        status:   'accepted',
      });
      navigate('/worker/en-route', { state: { bookingId: job.id } });
    } catch (err) {
      alert(err.response?.data?.message || 'Could not accept booking. It may have been taken.');
      fetchJobs();
    }
  };

  const handleDecline = (jobId) => {
    setPendingJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const fmt = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const initials = auth.name
    ? auth.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'W';

  const workerStatusLabel = {
    accepted:    { label: 'Job Accepted — En Route', color: 'bg-blue-600',  route: '/worker/en-route' },
    in_progress: { label: 'Job In Progress',         color: 'bg-green-600', route: '/worker/job-in-progress' },
    disputed:    { label: 'Disputed — Under Review',  color: 'bg-red-600',   route: '/worker/dispute-alert' },
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-gray-400 font-semibold">{auth.name || 'Worker'}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${isOnline ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${isOnline ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-gray-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ease-out shadow-sm ${isOnline ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 flex flex-col gap-6 overflow-y-auto hide-scroll">
        {/* Active/Ongoing booking banner */}
        {activeBooking && workerStatusLabel[activeBooking.status] && (
          <button
            onClick={() => navigate(workerStatusLabel[activeBooking.status].route, { state: { bookingId: activeBooking.id } })}
            className={`w-full ${workerStatusLabel[activeBooking.status].color} p-5 rounded-2xl shadow-lg flex items-center justify-between text-white animate-in slide-in-from-top-4`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span className="text-xs font-bold text-white/80 uppercase tracking-wider">
                  {workerStatusLabel[activeBooking.status].label}
                </span>
              </div>
              <h3 className="font-bold text-lg">{activeBooking.service}</h3>
              <p className="text-xs text-white/70 mt-0.5">{activeBooking.customer}</p>
            </div>
            <svg className="w-5 h-5 text-white animate-bounce-horizontal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        )}

        {/* Offline banner */}
        {!isOnline && (
          <div className="bg-amber-50 text-amber-800 font-bold text-xs text-center py-4 rounded-2xl border border-amber-100 flex items-center justify-center gap-2">
            <Zap size={14} className="animate-pulse" />
            Go online to start receiving service requests near you.
          </div>
        )}

        {/* Earnings card */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 rounded-[32px] p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-2 opacity-80">Total Earnings</p>
            <h2 className="text-5xl font-black mb-8 flex items-baseline gap-1">
              <span className="text-2xl font-bold opacity-70">₹</span>
              {earnings ? Math.round(earnings.total).toLocaleString('en-IN') : '—'}
            </h2>
            <div className="grid grid-cols-2 gap-8 border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <DollarSign size={20} className="text-blue-100" />
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest opacity-70">Today</p>
                  <p className="font-bold text-lg">₹{earnings ? Math.round(earnings.today) : '—'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-100" />
                </div>
                <div>
                  <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest opacity-70">This Week</p>
                  <p className="font-bold text-lg">₹{earnings ? Math.round(earnings.week) : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pending job requests */}
        {isOnline && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900 text-lg">Incoming Requests</h3>
              <button onClick={fetchJobs} className="flex items-center gap-1 text-blue-700 text-xs font-bold">
                <RefreshCw size={12} className={jobLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {jobLoading && pendingJobs.length === 0 && (
              <div className="text-center py-10 text-gray-400 font-semibold text-sm">
                Scanning for jobs near you…
              </div>
            )}

            {!jobLoading && pendingJobs.length === 0 && (
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                <span className="text-3xl block mb-3">📭</span>
                <p className="font-bold text-sm">No pending requests right now.</p>
                <p className="text-xs mt-1">New jobs will appear here automatically.</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {pendingJobs.map(job => {
                const t    = timeLeft[job.id] ?? 300;
                const pct  = (t / 300) * 100;
                const icon = CATEGORY_ICONS[job.category?.name] ?? '🔧';

                return (
                  <div key={job.id} className="bg-white rounded-[28px] shadow-xl shadow-blue-100 border border-blue-50 overflow-hidden relative">
                    <div
                      className="absolute top-0 left-0 h-1.5 bg-blue-600 transition-all duration-1000 z-20"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-blue-50 text-2xl flex items-center justify-center rounded-[18px]">
                            {icon}
                          </div>
                          <div>
                            <h3 className="font-black text-gray-900 text-lg">{job.category?.name}</h3>
                            <div className="flex items-center gap-1 mt-1">
                              <MapPin size={12} className="text-blue-600" />
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest truncate max-w-[160px]">
                                {job.address}
                              </p>
                            </div>
                            {job.problemDesc && (
                              <p className="text-xs text-gray-400 mt-1 italic">"{job.problemDesc}"</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-black text-blue-700">₹{job.basePrice}</p>
                          <div className={`flex items-center justify-end gap-1 mt-2 font-black text-xs ${t < 60 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
                            <Clock size={12} />
                            <span>{fmt(t)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDecline(job.id)}
                          className="flex-1 bg-gray-50 text-gray-500 font-black py-3.5 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs border border-gray-100"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(job)}
                          className="flex-[2] bg-blue-700 text-white font-black py-3.5 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all uppercase tracking-widest text-xs active:scale-[0.98]"
                        >
                          Accept Job
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
