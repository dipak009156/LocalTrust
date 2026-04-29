import { useNavigate } from 'react-router-dom';

export default function Favourites() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Favourite Workers</h1>
      </div>

      <div className="p-6 flex flex-col gap-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <img src="https://i.pravatar.cc/150?img=11" alt="Worker" className="w-16 h-16 rounded-full border border-gray-200" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-900 text-lg">Ramesh K.</h3>
              <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-sm font-semibold text-gray-500">Plumber</p>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-50 text-blue-700 text-xs font-bold py-1.5 px-3 rounded-lg border border-blue-100">Book</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <img src="https://i.pravatar.cc/150?img=68" alt="Worker" className="w-16 h-16 rounded-full border border-gray-200" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-gray-900 text-lg">Suresh M.</h3>
              <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            </div>
            <p className="text-sm font-semibold text-gray-500">Electrician</p>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-50 text-blue-700 text-xs font-bold py-1.5 px-3 rounded-lg border border-blue-100">Book</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
