import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Api from '../../utils/api';
import { Star, Heart, ArrowLeft, Loader2 } from 'lucide-react';

export default function WorkerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [isFavourite, setIsFavourite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch worker profile and performance history
    // Why: To help the customer decide if this partner is right for their job
    const fetchWorker = async () => {
      try {
        const res = await Api.get(`/workers/${id}`);
        setWorker(res.data.worker);
        setIsFavourite(res.data.isFavourite);
      } catch (err) {
        console.error('Failed to fetch worker details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchWorker();
  }, [id]);

  const handleToggleFavourite = async () => {
    // 2. Add or remove worker from favourites
    // Why: To allow the user to easily find and rebook this partner in the future
    try {
      await Api.post('/users/favourites/toggle', { workerId: id });
      setIsFavourite(!isFavourite);
    } catch (err) {
      console.error('Favourite toggle failed:', err);
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 bg-gray-50">
      <Loader2 className="w-10 h-10 text-blue-700 animate-spin" />
      <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Loading Partner Profile...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <button 
          onClick={handleToggleFavourite}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isFavourite ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}
        >
          <Heart size={20} fill={isFavourite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 overflow-y-auto pb-32 max-w-2xl mx-auto w-full">
        <div className="flex flex-col items-center text-center">
          <img src={worker?.profilePhoto || "https://i.pravatar.cc/150?img=11"} alt={worker?.name} className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-4 object-cover" />
          <h2 className="text-2xl font-extrabold text-gray-900">{worker?.name || 'Partner'}</h2>
          <p className="text-blue-700 font-bold text-sm mt-1 uppercase tracking-widest">{worker?.city || 'Verified Partner'}</p>
          
          <div className="flex gap-4 mt-6">
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-orange-500 font-black flex items-center gap-1 text-lg">
                {worker?.avgRating || '5.0'} <Star size={14} fill="currentColor" />
              </span>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Rating</span>
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-gray-900 font-black text-lg">{worker?.totalJobs || '10+'}</span>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Jobs</span>
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-gray-900 font-black text-lg">{worker?.experience || '3'} Yrs</span>
              <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">Exp</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-black text-gray-900 mb-3 text-lg tracking-tight uppercase text-xs opacity-50">About Partner</h3>
          <p className="text-sm font-medium text-gray-600 leading-relaxed bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            {worker?.bio || "Experienced service professional dedicated to providing high-quality solutions and ensuring complete customer satisfaction with every visit."}
          </p>
        </div>

        <div>
          <h3 className="font-black text-gray-900 mb-3 text-lg tracking-tight uppercase text-xs opacity-50">Verified Reviews</h3>
          <div className="flex flex-col gap-4">
            {worker?.reviews?.length > 0 ? worker.reviews.map((review, idx) => (
              <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-black text-gray-900">{review.user?.name || 'Customer'}</span>
                  <div className="flex items-center gap-1 text-orange-500 text-xs font-black">
                    <Star size={10} fill="currentColor" /> {review.rating}
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{review.comment}</p>
              </div>
            )) : (
              <div className="text-center py-6 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                No reviews yet. Be the first to rate!
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 lg:sticky lg:bg-transparent lg:border-none">
        <button onClick={() => navigate('/customer/book')} className="max-w-2xl mx-auto w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all active:scale-[0.98] uppercase tracking-widest text-xs">
          Direct Book Now
        </button>
      </div>
    </div>
  );
}
