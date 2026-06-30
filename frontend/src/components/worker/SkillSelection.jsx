import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle2, ChevronLeft, Search } from 'lucide-react';
import api from '../../utils/api';
import { securePost } from '../../utils/securePost';

export default function SkillSelection() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/booking/categories')
      .then(res => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleSkill = (catId) => {
    setSelected(prev => 
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) return alert('Select at least one skill');
    setSaving(true);
    setError('');
    try {
      const result = await securePost('/worker/skills', {
        skills: selected.map(id => ({ categoryId: id }))
      });
      if (result?.sentinelVerdict === 'BLOCK' || result?.sentinelVerdict === 'TERMINATE_SESSION') {
        setError('Action blocked due to unusual activity.');
        return;
      }
      navigate('/worker/profile');
    } catch (err) {
      setError('Failed to save skills. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-4 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="text-gray-900"><ChevronLeft size={24} /></button>
        <h1 className="text-xl font-extrabold text-gray-900">Select Your Skills</h1>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-500">Pick the services you can provide to customers.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {categories.map(cat => (
              <div 
                key={cat.id}
                onClick={() => toggleSkill(cat.id)}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${selected.includes(cat.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{cat.iconUrl || '🔧'}</div>
                  <span className={`font-bold ${selected.includes(cat.id) ? 'text-blue-900' : 'text-gray-700'}`}>{cat.name}</span>
                </div>
                {selected.includes(cat.id) && <CheckCircle2 size={20} className="text-blue-600" />}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-gray-100">
        {error && <p className="text-red-500 text-sm font-semibold text-center mb-3">{error}</p>}
        <button 
          onClick={handleSave}
          disabled={saving || selected.length === 0}
          className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 uppercase tracking-widest text-sm disabled:opacity-50"
        >
          {saving ? 'Saving...' : `Save ${selected.length} Skills`}
        </button>
      </div>
    </div>
  );
}
