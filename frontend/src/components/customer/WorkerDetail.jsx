import { useNavigate } from 'react-router-dom';

export default function WorkerDetail() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500">
          <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32">
        <div className="flex flex-col items-center text-center">
          <img src="https://i.pravatar.cc/150?img=11" alt="Worker" className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4" />
          <h2 className="text-2xl font-extrabold text-gray-900">Ramesh K.</h2>
          <p className="text-blue-700 font-bold text-sm mt-1">Plumber</p>
          
          <div className="flex gap-4 mt-4">
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-orange-500 font-bold flex items-center gap-1">4.9 <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Rating</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-gray-900 font-bold">124</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Jobs</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-gray-900 font-bold">3 Yrs</span>
              <span className="text-[10px] text-gray-500 font-semibold uppercase">Exp</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-extrabold text-gray-900 mb-3 text-lg">About</h3>
          <p className="text-sm font-medium text-gray-600 leading-relaxed bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            Professional plumber with 3 years of experience. Specializes in tap repairs, pipe leakages, and bathroom fittings. Always ensures a clean workspace after job completion.
          </p>
        </div>

        <div>
          <h3 className="font-extrabold text-gray-900 mb-3 text-lg">Recent Reviews</h3>
          <div className="flex flex-col gap-3">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-900">Amit P.</span>
                <span className="text-orange-500 text-xs font-bold">★ 5</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Very polite and fixed the issue in 20 minutes.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-gray-900">Sneha R.</span>
                <span className="text-orange-500 text-xs font-bold">★ 5</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">Clean work. Replaced the sink pipe perfectly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100">
        <button onClick={() => navigate('/customer/category/plumbing')} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Book This Worker
        </button>
      </div>
    </div>
  );
}
