import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Api from '../../utils/api';
import { ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';

export default function OtpCheckin() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch the secure OTP for this specific booking
    // Why: To provide a secure verification method at the customer's doorstep
    const fetchOtp = async () => {
      try {
        const res = await Api.get(`/bookings/${id}/otp`);
        setOtp(res.data.otp || '----');
      } catch (err) {
        console.error('Failed to fetch OTP:', err);
      } finally {
        setLoading(false);
      }
    };

    // 2. Poll for booking status change
    // Why: To automatically redirect the user once the partner enters the OTP on their device
    const checkStatus = async () => {
      try {
        const res = await Api.get(`/bookings/${id}`);
        if (res.data.booking?.status === 'in_progress') {
          navigate(`/customer/job-in-progress/${id}`);
        }
      } catch (err) {
        console.error('Status check failed:', err);
      }
    };

    fetchOtp();
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [id, navigate]);

  return (
    <div className="flex flex-col h-full bg-white p-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full">
        <div className="w-20 h-20 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={40} />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Partner Arrived</h1>
        <p className="text-gray-500 font-bold mb-8 uppercase text-[10px] tracking-widest">Share this secure PIN to start the service</p>

        {loading ? (
          <div className="flex gap-4 justify-center mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-16 h-20 bg-gray-50 animate-pulse border border-gray-100 rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 justify-center mb-8">
            {otp.split('').map((num, i) => (
              <div key={i} className="w-16 h-20 bg-gray-50 border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center text-4xl font-black text-blue-700">
                {num}
              </div>
            ))}
          </div>
        )}

        <div className="bg-orange-50 border border-orange-100 rounded-[24px] p-6 flex gap-4 text-sm font-bold text-orange-900 text-left">
          <AlertTriangle size={24} className="shrink-0 text-orange-500" />
          <p className="leading-relaxed uppercase text-[10px] tracking-widest opacity-80">
            Security Check: Do not share this PIN until you have verified the partner's identity at your door.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2">
          <Loader2 className="w-4 h-4 text-blue-700 animate-spin" />
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Waiting for partner to enter PIN...</p>
        </div>
      </div>
    </div>
  );
}
