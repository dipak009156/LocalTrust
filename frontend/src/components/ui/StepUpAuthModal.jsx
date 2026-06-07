/**
 * StepUpAuthModal.jsx — Sentinel step-up OTP verification modal.
 *
 * Shown when Sentinel returns sentinelVerdict: 'STEP_UP_AUTH'.
 * Re-uses the same OTP input styling as the login OtpStep.jsx.
 *
 * Props:
 *   onVerified  — called when OTP is confirmed, component retries the original action
 *   onDismiss   — called when user cancels
 *   phone       — masked phone number to display (e.g. "98XXXXX123")
 */
import { useRef, useState, useEffect } from 'react';
import api from '../../utils/api';
import { ShieldAlert } from 'lucide-react';

export default function StepUpAuthModal({ onVerified, onDismiss, phone = '' }) {
    const [digits, setDigits]     = useState(['', '', '', '', '', '']);
    const [loading, setLoading]   = useState(false);
    const [error, setError]       = useState('');
    const [shake, setShake]       = useState(false);
    const [timer, setTimer]       = useState(30);
    const [sending, setSending]   = useState(false);
    const refs                    = useRef([]);

    // Auto-focus first input on mount
    useEffect(() => { refs.current[0]?.focus(); }, []);

    // Resend countdown
    useEffect(() => {
        if (timer <= 0) return;
        const id = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(id);
    }, [timer]);

    const handleInput = (val, i) => {
        const d = val.replace(/\D/g, '').slice(0, 1);
        const next = [...digits];
        next[i] = d;
        setDigits(next);
        if (d && i < 5) refs.current[i + 1]?.focus();
    };

    const handleBackspace = (e, i) => {
        if (e.key === 'Backspace' && !digits[i] && i > 0) {
            refs.current[i - 1]?.focus();
            const next = [...digits];
            next[i - 1] = '';
            setDigits(next);
        }
    };

    const handleResend = async () => {
        setSending(true);
        try {
            // Re-use the same send-otp endpoint already in LocalTrust
            await api.post('/auth/send-otp', { phone, role: 'USER' });
            setTimer(30);
            setError('');
        } catch {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setSending(false);
        }
    };

    const handleVerify = async () => {
        const otp = digits.join('');
        if (otp.length !== 6) return;

        setLoading(true);
        setError('');
        try {
            // Verify the OTP using the existing auth endpoint
            await api.post('/auth/verify-otp', { phone, otp, role: 'USER' });
            // OTP confirmed — tell the parent to retry the original action
            onVerified();
        } catch (err) {
            const msg = err.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(msg);
            setShake(true);
            setTimeout(() => setShake(false), 600);
            setDigits(['', '', '', '', '', '']);
            refs.current[0]?.focus();
        } finally {
            setLoading(false);
        }
    };

    const complete = digits.every(d => d.length === 1);

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
            <div className="w-full max-w-sm mx-4 bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <ShieldAlert size={22} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-extrabold text-base leading-tight">Verification Required</p>
                        <p className="text-blue-100 text-xs font-medium">Sentinel detected an unusual pattern</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">
                        To continue, please enter the OTP sent to{' '}
                        <span className="font-bold text-slate-900">+91 {phone}</span>.
                    </p>

                    {/* OTP inputs — same style as OtpStep.jsx */}
                    <div className={`flex justify-between gap-2 ${shake ? 'animate-shake' : ''}`}>
                        {digits.map((v, i) => (
                            <input
                                key={i}
                                ref={el => refs.current[i] = el}
                                type="number"
                                value={v}
                                onChange={e => handleInput(e.target.value, i)}
                                onKeyDown={e => handleBackspace(e, i)}
                                inputMode="numeric"
                                maxLength={1}
                                className="w-full aspect-square text-center text-xl font-extrabold border-2 border-slate-300 bg-slate-50 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white focus:scale-105 transition-all"
                            />
                        ))}
                    </div>

                    {error && <p className="text-red-500 text-xs font-semibold text-center">{error}</p>}

                    {/* Verify button */}
                    <button
                        onClick={handleVerify}
                        disabled={!complete || loading}
                        className={`w-full py-4 rounded-2xl font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2
                            ${complete && !loading
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Verifying…
                            </>
                        ) : 'Verify & Continue'}
                    </button>

                    {/* Resend + Cancel */}
                    <div className="flex items-center justify-between text-sm">
                        {timer > 0 ? (
                            <span className="text-slate-400">
                                Resend in <span className="font-bold text-slate-600">{timer}s</span>
                            </span>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={sending}
                                className="text-blue-600 font-bold hover:underline disabled:opacity-50"
                            >
                                {sending ? 'Sending…' : 'Resend OTP'}
                            </button>
                        )}
                        <button
                            onClick={onDismiss}
                            className="text-slate-400 hover:text-slate-700 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
