import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, ChevronRight, User } from 'lucide-react';

export default function Favourites() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">Favourite Partners</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
        {[
          { name: 'Ramesh K.', role: 'Expert Plumber', rating: 4.8, img: 'https://i.pravatar.cc/150?img=11' },
          { name: 'Suresh M.', role: 'Senior Electrician', rating: 4.9, img: 'https://i.pravatar.cc/150?img=68' },
        ].map((worker, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-5 group hover:border-blue-300 hover:shadow-md transition-all">
            <div className="relative">
              <img src={worker.img} alt={worker.name} className="w-16 h-16 rounded-2xl border-2 border-white shadow-md object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                <Heart size={10} fill="currentColor" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-gray-900 text-lg leading-none">{worker.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1.5">{worker.role}</p>
                </div>
                <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg">
                  <Star size={10} fill="currentColor" />
                  <span className="text-[10px] font-black">{worker.rating}</span>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => navigate('/customer/book')}
                  className="flex-1 bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest py-2 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-800 transition-colors"
                >
                  Quick Book
                </button>
                <button className="w-9 h-9 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-gray-100 hover:text-gray-900 transition-colors">
                  <User size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
