import { Link, useNavigate } from 'react-router-dom';

export default function CategoryDetail() {
  const navigate = useNavigate();
  
  const subcategories = [
    { id: '1', name: 'Tap Repair', desc: 'Fix leaking or broken taps', price: 249 },
    { id: '2', name: 'Toilet Repair', desc: 'Flush, blocks, or leaks', price: 349 },
    { id: '3', name: 'Shower Fitting', desc: 'Install or repair shower heads', price: 299 },
    { id: '4', name: 'Pipe Blockage', desc: 'Clear sink or drain blocks', price: 449 },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">Plumbing</h1>
      </div>

      <div className="p-6 flex flex-col gap-4 overflow-y-auto">
        {subcategories.map((sub) => (
          <Link key={sub.id} to="/customer/book" className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center active:scale-95 transition-transform">
            <div>
              <h3 className="font-bold text-gray-900 text-base">{sub.name}</h3>
              <p className="text-sm text-gray-500 mt-0.5">{sub.desc}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-bold text-blue-700">₹{sub.price}</span>
              <span className="text-xs text-gray-400 font-semibold mt-1 flex items-center gap-1">Select <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
