import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Send, MoreVertical, Phone } from 'lucide-react';

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'worker', text: 'Hi, I am on my way!', time: '10:30 AM' },
    { id: 2, sender: 'customer', text: 'Great, thanks! Please ring the bell when you arrive.', time: '10:32 AM' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'customer', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src="https://i.pravatar.cc/150?img=11" alt="Worker" className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-black text-gray-900 leading-tight tracking-tight">Ramesh K.</h1>
              <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Active Now</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            <Phone size={18} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto pb-28 max-w-3xl mx-auto w-full">
        <div className="text-center">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-gray-50 shadow-sm">Today</span>
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}>
            <div className={`px-5 py-3.5 rounded-[24px] max-w-[85%] shadow-sm ${
              msg.sender === 'customer' 
                ? 'bg-blue-700 text-white rounded-br-none' 
                : 'bg-white border border-gray-100 text-gray-900 rounded-bl-none'
            }`}>
              <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
            </div>
            <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1.5 px-2">{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent">
        <div className="max-w-3xl mx-auto w-full">
          <div className="bg-white p-2 rounded-[28px] shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Message Ramesh..." 
              className="flex-1 bg-transparent px-4 py-2 text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
            />
            <button 
              onClick={handleSend} 
              disabled={!input.trim()}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
                input.trim() 
                  ? 'bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-95' 
                  : 'bg-gray-50 text-gray-300'
              }`}
            >
              <Send size={18} fill={input.trim() ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
