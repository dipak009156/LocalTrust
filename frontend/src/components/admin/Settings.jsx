import { useState } from 'react';

export default function Settings() {
  const [commission, setCommission] = useState(10);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Plumbing', emoji: '💧' },
    { id: 2, name: 'Electrical', emoji: '⚡' },
    { id: 3, name: 'Cleaning', emoji: '🧹' },
    { id: 4, name: 'AC Repair', emoji: '❄️' }
  ]);
  
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatEmoji, setNewCatEmoji] = useState('');
  
  const [toggles, setToggles] = useState({
    disputes: true,
    verifications: true,
    largeEscrow: false
  });

  const [showPassModal, setShowPassModal] = useState(false);

  const handleSaveCommission = () => {
    // TODO: PATCH /admin/settings
    alert('Commission rate saved.');
  };

  const handleAddCategory = () => {
    if (!newCatName || !newCatEmoji) return;
    setCategories([...categories, { id: Date.now(), name: newCatName, emoji: newCatEmoji }]);
    setShowAddCategory(false);
    setNewCatName('');
    setNewCatEmoji('');
    // TODO: POST /admin/categories
  };

  const handleRemoveCategory = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    // TODO: DELETE /admin/categories/:id
  };

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    // TODO: PATCH /admin/settings/notifications
  };

  return (
    <div className="flex flex-col gap-6 relative h-full">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Configure core platform variables and preferences.</p>
      </div>

      <div className="grid grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-8">
          {/* Platform Commission */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-extrabold text-slate-900 mb-2 text-lg">Platform Commission</h3>
            <p className="text-sm text-slate-500 font-medium mb-4">The percentage taken from every completed job.</p>
            <div className="flex gap-4 items-center">
              <div className="relative w-32">
                <input 
                  type="number" 
                  value={commission}
                  onChange={(e) => setCommission(e.target.value)}
                  className="w-full pl-4 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:border-indigo-600"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
              </div>
              <button onClick={handleSaveCommission} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition-colors">
                Save
              </button>
            </div>
          </div>

          {/* Service Categories */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-slate-900 text-lg">Service Categories</h3>
              <button onClick={() => setShowAddCategory(true)} className="text-indigo-600 font-bold text-sm hover:underline">+ Add New</button>
            </div>
            
            <div className="flex flex-col gap-3">
              {categories.map(c => (
                <div key={c.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm">{c.emoji}</div>
                    <span className="font-bold text-slate-900">{c.name}</span>
                  </div>
                  <button onClick={() => handleRemoveCategory(c.id)} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded-md">Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Admin Account */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-extrabold text-slate-900 mb-4 text-lg">Admin Account</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">A</div>
              <div>
                <p className="font-bold text-slate-900">Super Admin</p>
                <p className="text-sm font-semibold text-slate-500">admin@trustwork.in</p>
              </div>
            </div>
            <button onClick={() => setShowPassModal(true)} className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-100 transition-colors">
              Change Password
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-extrabold text-slate-900 mb-4 text-lg">Notification Preferences</h3>
            <div className="flex flex-col gap-1">
              {[
                { id: 'disputes', label: 'New Dispute Alerts', desc: 'Notify when a customer raises an issue' },
                { id: 'verifications', label: 'New Verifications', desc: 'Notify when a worker submits KYC' },
                { id: 'largeEscrow', label: 'Large Escrow Release', desc: 'Notify on payouts over ₹10k' }
              ].map(n => (
                <div key={n.id} className="py-3 border-b border-slate-100 last:border-0 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{n.label}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                  <button 
                    onClick={() => handleToggle(n.id)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors ${toggles[n.id] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${toggles[n.id] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-3xl shadow-sm border border-red-200 p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <h3 className="font-extrabold text-red-600 mb-4 text-lg">Danger Zone</h3>
            <div className="flex gap-4">
              <button onClick={() => alert('Data exported.')} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50 text-sm">
                Export All Data
              </button>
              <button onClick={() => { if(window.confirm('Are you sure?')) alert('Data cleared.') }} className="flex-1 bg-red-50 border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-100 text-sm">
                Clear Test Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">Add Category</h3>
            
            <div className="flex gap-3 mb-6">
              <div className="w-20">
                <label className="text-xs font-bold text-slate-900 mb-2 block">Emoji</label>
                <input 
                  type="text" 
                  value={newCatEmoji}
                  onChange={(e) => setNewCatEmoji(e.target.value)}
                  placeholder="💧"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-lg outline-none focus:border-indigo-600"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-900 mb-2 block">Name</label>
                <input 
                  type="text" 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Plumbing"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-bold text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowAddCategory(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={handleAddCategory} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-md">Add</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPassModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6">Change Password</h3>
            
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <label className="text-xs font-bold text-slate-900 mb-1 block">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-900 mb-1 block">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-900 mb-1 block">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold text-slate-900 outline-none focus:border-indigo-600" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowPassModal(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={() => { alert('Password updated'); setShowPassModal(false); }} className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 shadow-md">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
