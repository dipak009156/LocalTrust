import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function LoginOTP() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  // App.jsx sets role via RoleBootstrap based on URL
  const role = useSelector((state) => state.auth.role);

  // TODO: Replace with real Firebase OTP auth
  const handleSendOTP = () => setStep(2);
  
  const handleVerifyOTP = () => {
    // Route based on role
    if (role === 'WORKER') {
      navigate('/worker/dashboard'); // Will be built later
    } else {
      navigate('/customer/home');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white px-6 py-12 relative overflow-y-auto">
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {step === 1 ? 'Welcome to TrustWork' : 'Enter OTP'}
        </h1>
        <p className="text-gray-600 mb-8 font-medium">
          {step === 1 
            ? 'Enter your mobile number to get started.' 
            : 'We sent a 4-digit code to your number.'}
        </p>

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl p-4 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
              <span className="text-gray-500 font-bold mr-2">+91</span>
              <input 
                type="tel" 
                placeholder="Mobile Number" 
                className="bg-transparent w-full outline-none text-gray-900 font-semibold"
                maxLength={10}
              />
            </div>
            <button 
              onClick={handleSendOTP}
              className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors mt-4"
            >
              Get OTP
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between gap-3">
              {[1, 2, 3, 4].map((i) => (
                <input 
                  key={i}
                  type="text" 
                  maxLength={1} 
                  className="w-16 h-16 text-center text-2xl font-extrabold text-gray-900 bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-700 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              ))}
            </div>
            <button 
              onClick={handleVerifyOTP}
              className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors"
            >
              Verify & Login
            </button>
            <p className="text-center text-blue-700 font-semibold text-sm cursor-pointer mt-2 hover:underline">
              Resend Code
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
