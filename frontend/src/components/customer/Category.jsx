import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../utils/api';

export default function CategoryDetail() {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [parent, setParent]       = useState(null);
  const [children, setChildren]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/booking/categories')
      .then(r => {
        const all  = r.data;
        const par  = all.find(c => c.id === id);
        const kids = all.filter(c => c.parentId === id);
        setParent(par);
        setChildren(kids);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={20} /></button>
        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-100" />)}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">{parent?.name ?? 'Services'}</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
        {children.length === 0 && !loading && (
          <p className="text-gray-400 font-semibold text-center col-span-2 mt-10">No services available right now.</p>
        )}

        {children.map(sub => (
          <Link
            key={sub.id}
            to="/customer/book"
            state={{ categoryId: sub.id, categoryName: sub.name, price: sub.fixedPrice }}
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-blue-500 hover:shadow-md transition-all active:scale-95"
          >
            <div className="flex-1 pr-4">
              <h3 className="font-black text-gray-900 text-lg leading-tight">{sub.name}</h3>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-lg font-black text-blue-700">₹{sub.fixedPrice ?? '—'}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">Starter Price</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-colors">
                <PlusCircle size={24} />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 group-hover:text-blue-700 transition-colors">
                Book <ChevronRight size={10} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
