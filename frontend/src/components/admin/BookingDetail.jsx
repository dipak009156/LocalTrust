import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/bookings/${id}`)
      .then(res => setBooking(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-slate-500">Loading booking...</div>;
  if (!booking) return <div className="p-8 text-slate-500">Booking not found.</div>;

  const displayStatus = booking.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  let escrowStatus = 'Locked';
  if (booking.status === 'completed' || booking.status === 'resolved') escrowStatus = 'Released';
  if (booking.status === 'cancelled') escrowStatus = 'Refunded';

  const customerName = booking.user?.name || booking.user?.phone || 'Unknown';
  const workerName = booking.worker?.name || booking.worker?.phone || 'Unassigned';
  const serviceName = booking.category?.name || '—';
  const dateStr = new Date(booking.createdAt).toLocaleDateString();

  return (
    <div className="flex flex-col gap-6 relative h-full">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking #{booking.id.substring(0, 8)}</h1>
          <p className="text-slate-500 font-medium mt-0.5">{dateStr} • {serviceName}</p>
        </div>
      </div>

      {booking.status === 'disputed' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div>
              <p className="font-bold text-red-900">Dispute Active</p>
              <p className="text-sm font-medium text-red-700">Funds are locked in escrow.</p>
            </div>
          </div>
          <button onClick={() => navigate('/admin/disputes')} className="bg-red-600 text-white font-bold px-5 py-2 rounded-xl shadow-sm hover:bg-red-700 transition-colors">
            Go to Dispute
          </button>
        </div>
      )}

      {booking.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <p className="font-bold text-green-900">Completed & Confirmed</p>
            <p className="text-sm font-medium text-green-700">Escrow released to worker on {dateStr}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-8 items-start">
        {/* Left Column: Timeline & Financials */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-extrabold text-slate-900 mb-6 text-lg">Timeline</h3>
            <div className="flex flex-col gap-5 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
              
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-indigo-600 border-4 border-white shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Created</p>
                  <p className="text-xs text-slate-500 font-medium">10:00 AM</p>
                </div>
              </div>
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-indigo-600 border-4 border-white shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Paid to Escrow</p>
                  <p className="text-xs text-slate-500 font-medium">10:02 AM</p>
                </div>
              </div>
              <div className="flex gap-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-indigo-600 border-4 border-white shrink-0"></div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Worker En Route</p>
                  <p className="text-xs text-slate-500 font-medium">10:15 AM</p>
                </div>
              </div>
              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full border-4 border-white shrink-0 ${['completed', 'disputed', 'in_progress'].includes(booking.status) ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                <div>
                  <p className={`text-sm font-bold ${['completed', 'disputed', 'in_progress'].includes(booking.status) ? 'text-slate-900' : 'text-slate-400'}`}>OTP Verified</p>
                  <p className="text-xs text-slate-500 font-medium">--:--</p>
                </div>
              </div>
              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full border-4 border-white shrink-0 ${booking.status === 'completed' ? 'bg-green-500' : booking.status === 'disputed' ? 'bg-red-500' : 'bg-slate-200'}`}></div>
                <div>
                  <p className={`text-sm font-bold ${booking.status === 'completed' ? 'text-green-700' : booking.status === 'disputed' ? 'text-red-700' : 'text-slate-400'}`}>
                    {booking.status === 'disputed' ? 'Disputed' : 'Completed'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-extrabold text-slate-900 mb-4 text-lg">Financials</h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Gross Amount Paid</span>
                <span>₹{booking.basePrice}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Platform Commission (10%)</span>
                <span>₹{(booking.basePrice * 0.1).toFixed(0)}</span>
              </div>
              <div className="h-px w-full bg-slate-100 my-1"></div>
              <div className="flex justify-between text-base font-black text-slate-900">
                <span>Net Worker Payout</span>
                <span className="text-green-600">₹{(booking.basePrice * 0.9).toFixed(0)}</span>
              </div>
              <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-600">Escrow Status</span>
                <span className={`uppercase tracking-widest text-[10px] ${escrowStatus === 'Released' ? 'text-green-600' : escrowStatus === 'Locked' ? 'text-red-600' : 'text-slate-500'}`}>
                  {escrowStatus}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profiles & Proofs */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Customer</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {customerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{customerName}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Service Provider</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {workerName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{workerName}</p>
                </div>
              </div>
            </div>
          </div>

          {(booking.status === 'completed' || booking.status === 'confirmed' || booking.status === 'disputed') && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-extrabold text-slate-900 mb-4 text-lg">Proof of Work</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2">Worker Uploaded Photo</p>
                  {booking.proofPhoto ? (
                    <a href={booking.proofPhoto} target="_blank" rel="noreferrer" className="block">
                      <img
                        src={booking.proofPhoto}
                        alt="Proof of work"
                        className="w-full h-48 object-cover rounded-2xl border border-slate-200 hover:opacity-90 transition-opacity cursor-zoom-in"
                      />
                      <p className="text-xs text-indigo-600 font-bold mt-1 text-center">Click to open full size ↗</p>
                    </a>
                  ) : (
                    <div className="w-full h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-bold text-sm">
                      No photo uploaded yet
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2">Booking Details</p>
                  <div className="w-full h-48 bg-slate-50 rounded-2xl border border-slate-100 p-4 text-sm font-medium text-slate-700 flex flex-col gap-3 overflow-auto">
                    {booking.problemDesc && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Customer Problem</p>
                        <p className="italic">"{booking.problemDesc}"</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Address</p>
                      <p>{booking.address}</p>
                    </div>
                    {booking.finalPrice && booking.finalPrice !== booking.basePrice && (
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Price Adjusted</p>
                        <p>₹{booking.basePrice} → ₹{booking.finalPrice}</p>
                      </div>
                    )}
                    {booking.otpVerified && (
                      <div className="flex items-center gap-1 text-green-700 font-bold text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        OTP Verified Check-in
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
