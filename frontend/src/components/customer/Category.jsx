import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight, PlusCircle } from 'lucide-react';
import Api from '../../utils/api';

export default function CategoryDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [categoryName, setCategoryName] = useState('Services');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch sub-categories for the selected category
    // Why: To show the user specific service types (e.g. Tap Repair under Plumbing)
    const fetchSubcategories = async () => {
      try {
        const res = await Api.get(`/categories/${id}`);
        setSubcategories(res.data.category?.children || []);
        setCategoryName(res.data.category?.name || 'Services');
      } catch (err) {
        console.error('Failed to fetch subcategories:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchSubcategories();
  }, [id]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-gray-900 tracking-tight">{categoryName}</h1>
      </div>

      <div className="max-w-4xl mx-auto w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
        {loading ? (
           [1,2,3,4].map(i => (
            <div key={i} className="bg-gray-100 animate-pulse h-32 rounded-3xl"></div>
          ))
        ) : subcategories.length > 0 ? subcategories.map((sub) => (
          <Link 
            key={sub.id} 
            to={`/customer/book?service=${sub.id}`} 
            className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center group hover:border-blue-500 hover:shadow-md transition-all active:scale-95"
          >
            <div className="flex-1 pr-4">
              <h3 className="font-black text-gray-900 text-lg leading-tight">{sub.name}</h3>
              <p className="text-sm text-gray-500 mt-1 font-medium">{sub.desc || 'Quality service guaranteed'}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-lg font-black text-blue-700">₹{sub.fixedPrice || sub.price || '---'}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">Fixed Price</span>
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
        )) : (
          <div className="col-span-full py-12 text-center text-gray-400 font-bold">
            No services found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
