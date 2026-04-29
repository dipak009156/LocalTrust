import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AddressPicker() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('12/4, Sai Nagar, Near Water Tank, Andheri West, Mumbai');

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Select Address</h1>
      </div>

      <div className="flex-1 bg-gray-200 relative">
        {/* Placeholder Map for GPS selection */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 font-bold gap-2">
          <span className="text-4xl text-blue-700 mb-4 animate-bounce">📍</span>
          [ Interactive Map Placeholder ]
          <p className="text-sm font-medium mt-2">Drag pin to adjust location</p>
        </div>
      </div>

      <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 -mt-6">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <h2 className="text-lg font-extrabold text-gray-900 mb-3">Service Location</h2>
        
        <textarea 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-semibold text-gray-900 outline-none focus:border-blue-700 resize-none h-24 mb-6"
        ></textarea>

        <button onClick={() => navigate(-1)} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Confirm Location
        </button>
      </div>
    </div>
  );
}
