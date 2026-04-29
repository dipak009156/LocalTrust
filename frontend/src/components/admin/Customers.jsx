import { useState } from 'react';
import { mockData } from '../../utils/mockData';

export default function Customers() {
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');

  // TODO: GET /admin/customers

  const filtered = mockData.customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search)
  );

  const handleToggleStatus = () => {
    if (selectedCustomer.status === 'Active') {
      setShowBanModal(true);
    } else {
      // TODO: PATCH /admin/customers/:id/unban
      alert('Customer unbanned.');
      setSelectedCustomer({ ...selectedCustomer, status: 'Active' });
    }
  };

  const handleConfirmBan = () => {
    // TODO: PATCH /admin/customers/:id/ban
    alert(`Customer banned. Reason: ${banReason}`);
    setShowBanModal(false);
    setSelectedCustomer({ ...selectedCustomer, status: 'Banned' });
    setBanReason('');
  };

  return (
    <div className="flex flex-col gap-6 relative h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 font-medium mt-1">Manage all registered users on the platform.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="relative w-96">
            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-600"
            />
          </div>
          <span className="text-sm font-bold text-slate-500">{filtered.length} total customers</span>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50 shadow-sm z-10">
              <tr className="text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="p-4 border-b border-slate-200">Name</th>
                <th className="p-4 border-b border-slate-200">Phone</th>
                <th className="p-4 border-b border-slate-200">City</th>
                <th className="p-4 border-b border-slate-200">Bookings</th>
                <th className="p-4 border-b border-slate-200">Join Date</th>
                <th className="p-4 border-b border-slate-200">Status</th>
                <th className="p-4 border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
                  <td className="p-4 font-bold text-slate-900">{c.name}</td>
                  <td className="p-4 font-medium text-slate-700">{c.phone}</td>
                  <td className="p-4 font-medium text-slate-700">{c.city}</td>
                  <td className="p-4 font-bold text-slate-900">{c.bookings}</td>
                  <td className="p-4 font-medium text-slate-500">{c.joinDate}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => setSelectedCustomer(c)}
                      className="text-indigo-600 font-bold text-sm hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 text-sm font-semibold text-slate-500">
          <span>Showing 1-10 of 124</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100">Prev</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100">Next</button>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedCustomer(null)}></div>
          <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-extrabold text-slate-900">Customer Profile</h2>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xl font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-sm font-semibold text-slate-500">{selectedCustomer.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-2xl font-black text-slate-900">{selectedCustomer.bookings}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Bookings</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                  <p className="text-2xl font-black text-slate-900">1</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mt-1">Disputes</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3">Recent Bookings</h4>
                <div className="flex flex-col gap-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white border border-slate-200 p-3 rounded-xl flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-sm font-bold text-slate-900">AC Repair</p>
                        <p className="text-xs font-medium text-slate-500">12 Oct 2023</p>
                      </div>
                      <span className="text-sm font-extrabold text-slate-900">₹499</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={handleToggleStatus}
                className={`w-full font-bold py-3 rounded-xl border transition-colors ${selectedCustomer.status === 'Active' ? 'bg-white border-red-200 text-red-600 hover:bg-red-50' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                {selectedCustomer.status === 'Active' ? 'Ban Customer' : 'Unban Customer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {showBanModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Ban Customer</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Are you sure you want to ban {selectedCustomer?.name}? They will no longer be able to log in or book services.</p>
            
            <label className="text-sm font-bold text-slate-900 mb-2 block">Reason for ban</label>
            <textarea 
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="e.g., Fraudulent activity..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-medium outline-none focus:border-red-500 h-24 resize-none mb-6"
            ></textarea>

            <div className="flex gap-3">
              <button onClick={() => setShowBanModal(false)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-50">Cancel</button>
              <button onClick={handleConfirmBan} disabled={!banReason} className={`flex-1 font-bold py-3 rounded-xl ${banReason ? 'bg-red-600 text-white hover:bg-red-700 shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Confirm Ban</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
