import { useParams, useNavigate } from 'react-router-dom';
import { mockData } from '../../utils/mockData';

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // TODO: GET /admin/bookings/:id
  const booking = mockData.bookings.find(b => b.id === id) || mockData.bookings[0];

  return (
    <div className="flex flex-col gap-6 relative h-full">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Booking #{booking.id}</h1>
          <p className="text-slate-500 font-medium mt-0.5">{booking.date} • {booking.service}</p>
        </div>
      </div>

      {booking.status === 'Disputed' && (
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

      {booking.status === 'Completed' && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          </div>
          <div>
            <p className="font-bold text-green-900">Completed & Confirmed</p>
            <p className="text-sm font-medium text-green-700">Escrow released to worker on {booking.date}</p>
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
                <div className={`w-6 h-6 rounded-full border-4 border-white shrink-0 ${['Completed', 'Disputed', 'In Progress'].includes(booking.status) ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
                <div>
                  <p className={`text-sm font-bold ${['Completed', 'Disputed', 'In Progress'].includes(booking.status) ? 'text-slate-900' : 'text-slate-400'}`}>OTP Verified</p>
                  <p className="text-xs text-slate-500 font-medium">10:45 AM</p>
                </div>
              </div>
              <div className="flex gap-4 relative z-10">
                <div className={`w-6 h-6 rounded-full border-4 border-white shrink-0 ${booking.status === 'Completed' ? 'bg-green-500' : booking.status === 'Disputed' ? 'bg-red-500' : 'bg-slate-200'}`}></div>
                <div>
                  <p className={`text-sm font-bold ${booking.status === 'Completed' ? 'text-green-700' : booking.status === 'Disputed' ? 'text-red-700' : 'text-slate-400'}`}>
                    {booking.status === 'Disputed' ? 'Disputed' : 'Completed'}
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
                <span>₹{booking.price}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-slate-600">
                <span>Platform Commission (10%)</span>
                <span>₹{(booking.price * 0.1).toFixed(0)}</span>
              </div>
              <div className="h-px w-full bg-slate-100 my-1"></div>
              <div className="flex justify-between text-base font-black text-slate-900">
                <span>Net Worker Payout</span>
                <span className="text-green-600">₹{(booking.price * 0.9).toFixed(0)}</span>
              </div>
              <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-sm font-bold">
                <span className="text-slate-600">Escrow Status</span>
                <span className={`uppercase tracking-widest text-[10px] ${booking.escrow === 'Released' ? 'text-green-600' : booking.escrow === 'Locked' ? 'text-red-600' : 'text-slate-500'}`}>
                  {booking.escrow}
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
                  {booking.customer.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{booking.customer}</p>
                  <button className="text-indigo-600 text-xs font-bold hover:underline">View Profile</button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Service Provider</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center font-bold text-lg">
                  {booking.worker.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{booking.worker}</p>
                  <button className="text-indigo-600 text-xs font-bold hover:underline">View Profile</button>
                </div>
              </div>
            </div>
          </div>

          {(booking.status === 'Completed' || booking.status === 'Disputed') && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-extrabold text-slate-900 mb-4 text-lg">Proof of Work</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2">Worker Uploaded Photo</p>
                  <div className="w-full h-48 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 font-bold text-sm">
                    [Photo Placeholder]
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-2">Worker Notes</p>
                  <div className="w-full h-48 bg-slate-50 rounded-2xl border border-slate-100 p-4 text-sm font-medium text-slate-700 italic">
                    "Completed the tap repair, tightened the base, no leaks present."
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
