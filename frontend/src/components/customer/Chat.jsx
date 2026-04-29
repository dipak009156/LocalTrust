import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
      <div className="bg-white px-6 py-5 sticky top-0 z-10 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </button>
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/150?img=11" alt="Worker" className="w-10 h-10 rounded-full border border-gray-200" />
          <div>
            <h1 className="font-extrabold text-gray-900 leading-tight">Ramesh K.</h1>
            <p className="text-xs text-green-600 font-bold">Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto pb-24">
        <div className="text-center text-xs text-gray-400 font-semibold mb-2">Today</div>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}>
            <div className={`px-4 py-3 rounded-2xl max-w-[80%] ${msg.sender === 'customer' ? 'bg-blue-700 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-900 rounded-bl-sm shadow-sm'}`}>
              <p className="text-sm font-medium">{msg.text}</p>
            </div>
            <span className="text-[10px] text-gray-400 font-semibold mt-1 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm font-medium text-gray-900 outline-none focus:border-blue-700"
          />
          <button onClick={handleSend} className="w-12 h-12 bg-blue-700 text-white rounded-full flex items-center justify-center shadow-md shadow-blue-200 active:scale-95 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
