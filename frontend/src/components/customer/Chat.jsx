import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MoreVertical, Phone, Loader2 } from 'lucide-react';
import Api from '../../utils/api';

export default function Chat() {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    // 1. Fetch chat history for the specific booking
    // Why: To allow communication between customer and partner for coordination
    const fetchMessages = async () => {
      try {
        const res = await Api.get(`/chat/${bookingId}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    // 2. Send a new message to the other party
    // Why: To provide real-time updates (e.g., location details, delay notifications)
    if (!input.trim()) return;
    const tempMsg = { id: Date.now(), sender: 'customer', text: input, time: 'Just now' };
    setMessages([...messages, tempMsg]);
    setInput('');
    
    try {
      await Api.post(`/chat/${bookingId}`, { text: input });
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Message failed to send. Please check your connection.');
    }
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
              <img src="https://i.pravatar.cc/150?img=11" alt="Partner" className="w-10 h-10 rounded-2xl object-cover border-2 border-white shadow-sm" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-black text-gray-900 leading-tight tracking-tight uppercase text-[10px] opacity-40 mb-0.5">Chatting with</h1>
              <h1 className="font-black text-gray-900 leading-tight tracking-tight">Partner</h1>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
            <Phone size={18} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto pb-28 max-w-3xl mx-auto w-full">
        <div className="text-center">
          <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-gray-50 shadow-sm">Secure Chat</span>
        </div>
        
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-blue-700 animate-spin" />
          </div>
        ) : messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}>
            <div className={`px-5 py-3.5 rounded-[24px] max-w-[85%] shadow-sm ${
              msg.sender === 'customer' 
                ? 'bg-blue-700 text-white rounded-br-none' 
                : 'bg-white border border-gray-100 text-gray-900 rounded-bl-none'
            }`}>
              <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
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
              placeholder="Type your message..." 
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
