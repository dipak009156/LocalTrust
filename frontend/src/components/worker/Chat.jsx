import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Phone } from 'lucide-react';
import api from '../../utils/api';

export default function WorkerChat() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(true);
  const bottomRef               = useRef(null);

  const fetchMessages = async () => {
    if (!bookingId) return;
    try {
      const { data } = await api.get(`/booking/${bookingId}/chat`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !bookingId) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, {
      id: Date.now(), senderRole: 'worker', message: text,
      sentAt: new Date().toISOString(),
    }]);
    try {
      await api.post(`/booking/${bookingId}/chat`, { message: text });
    } catch (err) {
      console.error(err);
    }
  };

  const fmt = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-white px-6 py-4 sticky top-0 z-10 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-900">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-black text-gray-900 leading-tight">Customer</h1>
            <p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Chat</p>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <Phone size={18} />
        </button>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto pb-28">
        {loading && <div className="text-center text-gray-400 text-sm font-medium">Loading messages…</div>}
        {!loading && messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm font-medium">No messages yet.</div>
        )}
        {messages.map(msg => {
          const isMe = msg.senderRole === 'worker';
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className={`px-5 py-3.5 rounded-[24px] max-w-[85%] shadow-sm ${
                isMe
                  ? 'bg-blue-700 text-white rounded-br-none'
                  : 'bg-white border border-gray-100 text-gray-900 rounded-bl-none'
              }`}>
                <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
              </div>
              <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1.5 px-2">
                {fmt(msg.sentAt)}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-50 via-gray-50/95 to-transparent">
        <div className="bg-white p-2 rounded-[28px] shadow-xl border border-gray-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Send a message…"
            className="flex-1 bg-transparent px-4 py-2 text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${
              input.trim() ? 'bg-blue-700 text-white shadow-lg shadow-blue-200 active:scale-95' : 'bg-gray-50 text-gray-300'
            }`}
          >
            <Send size={18} fill={input.trim() ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
