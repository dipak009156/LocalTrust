import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Star } from 'lucide-react';
import api from '../../utils/api';

export default function Favourites() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavourites = () => {
    api.get('/user/favourites')
      .then(r => setWorkers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFavourites(); }, []);

  const handleRemove = async (workerId) => {
    try {
      await api.delete(`/user/favourites/${workerId}`);
      setWorkers(prev => prev.filter(w => w.id !== workerId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Favourite Workers</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
        {loading && [...Array(2)].map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-[28px] animate-pulse border border-gray-100" />
        ))}

        {!loading && workers.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-400">
            <span className="text-4xl block mb-3">💔</span>
            <p className="font-bold">No saved workers yet.</p>
            <p className="text-sm mt-1">Tap the heart on any worker profile to save them.</p>
          </div>
        )}

        {workers.map(worker => (
          <div key={worker.id} className="bg-white p-6 rounded-[28px] shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-blue-300 hover:shadow-md transition-all">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-2xl border-2 border-white shadow-md">
                {worker.name?.[0]?.toUpperCase() ?? 'W'}
              </div>
              <button
                onClick={() => handleRemove(worker.id)}
                className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-red-600 transition-colors"
              >
                <Heart size={10} fill="currentColor" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="font-black text-gray-900 text-base">{worker.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 font-semibold">
                {worker.avgRating > 0 && (
                  <span className="flex items-center gap-1 text-amber-500">
                    <Star size={12} fill="currentColor" /> {worker.avgRating.toFixed(1)}
                  </span>
                )}
                {worker.city && <span>· {worker.city}</span>}
              </div>
              {worker.skills?.length > 0 && (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                  {worker.skills.map(s => s.category?.name).filter(Boolean).join(' · ')}
                </p>
              )}
              <button
                onClick={() => navigate('/customer/home')}
                className="mt-3 bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl shadow-sm hover:bg-blue-800 transition-colors"
              >
                Book Again
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
