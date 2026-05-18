import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Phone } from 'lucide-react';
import api from '../../utils/api';

export default function Chat() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const bookingId = location.state?.bookingId;

  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(true);
  const [booking,  setBooking]  = useState(null);
  const bottomRef               = useRef(null);

  // Fetch booking for worker name
  useEffect(() => {
    if (!bookingId) return;
    api.get(`/user/bookings/${bookingId}`)
      .then(r => setBooking(r.data))
      .catch(console.error);
  }, [bookingId]);

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

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (messages.length > 0 && bookingId) {
      localStorage.setItem(`chat_seen_${bookingId}`, messages.length);
    }
  }, [messages, bookingId]);

  const handleSend = async () => {
    if (!input.trim() || !bookingId) return;
    const text = input.trim();
    setInput('');
    // Optimistic add
    setMessages(prev => [...prev, {
      id: `opt-${Date.now()}`, senderRole: 'user', message: text,
      sentAt: new Date().toISOString(), pending: true,
    }]);
    try {
      await api.post(`/booking/${bookingId}/chat`, { message: text });
    } catch (err) {
      console.error(err);
    }
  };

  const fmt = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const workerName  = booking?.worker?.name ?? 'Worker';
  const workerPhone = booking?.worker?.phone;

  return (
    <div className="flex flex-col h-full bg-[#ece5dd] relative">
      {/* Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 sticky top-0 z-10 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center font-black text-white text-lg shadow-sm">
            {workerName.charAt(0)}
          </div>
          <div>
            <h1 className="font-black text-sm leading-tight">{workerName}</h1>
            <p className="text-[10px] text-green-300 font-bold">Worker · In progress</p>
          </div>
        </div>
        {workerPhone && (
          <a href={`tel:${workerPhone}`} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Phone size={18} />
          </a>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 px-3 py-4 flex flex-col gap-2 overflow-y-auto pb-28">
        {loading && (
          <div className="text-center text-gray-500 text-sm font-medium py-4">Loading messages…</div>
        )}
        {!loading && messages.length === 0 && (
          <div className="flex items-center justify-center">
            <span className="bg-white/70 text-gray-600 text-xs font-semibold px-4 py-2 rounded-full shadow-sm">
              No messages yet. Say hello! 👋
            </span>
          </div>
        )}

        {messages.map((msg, idx) => {
          const isMe = msg.senderRole === 'user';
          const showTime = idx === messages.length - 1 ||
            messages[idx + 1]?.senderRole !== msg.senderRole;

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`relative max-w-[78%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                {/* Bubble */}
                <div className={`px-3 py-2 rounded-2xl shadow-sm relative
                  ${isMe
                    ? 'bg-[#dcf8c6] text-gray-900 rounded-br-sm'
                    : 'bg-white text-gray-900 rounded-bl-sm'
                  }`}
                  style={{
                    borderRadius: isMe
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                  }}
                >
                  <p className="text-sm font-medium leading-relaxed pr-10">{msg.message}</p>

                  {/* Time + tick inside bubble */}
                  <div className={`absolute bottom-1.5 right-2.5 flex items-center gap-0.5`}>
                    <span className="text-[9px] text-gray-400 font-semibold">{fmt(msg.sentAt)}</span>
                    {isMe && (
                      <svg
                        className={`w-4 h-3 ${msg.pending ? 'text-gray-400' : 'text-[#53bdeb]'}`}
                        viewBox="0 0 16 11" fill="currentColor"
                      >
                        {/* Double tick like WhatsApp */}
                        {msg.pending ? (
                          // Single grey tick for pending
                          <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.033L5.68 7.357a.368.368 0 0 0-.51.058l-.406.502a.368.368 0 0 0 .058.51l3.5 2.8c.138.11.338.103.467-.015l6.875-8.275a.365.365 0 0 0-.064-.51z" />
                        ) : (
                          // Double blue tick for sent
                          <>
                            <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.033L5.68 7.357a.368.368 0 0 0-.51.058l-.406.502a.368.368 0 0 0 .058.51l3.5 2.8c.138.11.338.103.467-.015l6.875-8.275a.365.365 0 0 0-.064-.51z" />
                            <path d="M11.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.666 9.88a.32.32 0 0 1-.484.033L1.68 7.357a.368.368 0 0 0-.51.058l-.406.502a.368.368 0 0 0 .058.51l3.5 2.8c.138.11.338.103.467-.015l6.875-8.275a.365.365 0 0 0-.064-.51z" />
                          </>
                        )}
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="absolute bottom-0 left-0 right-0 px-3 py-3 bg-[#f0f0f0] flex items-end gap-2">
        <div className="flex-1 bg-white rounded-3xl px-4 py-2.5 shadow-sm flex items-center min-h-[46px]">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Message…"
            className="flex-1 bg-transparent text-sm font-medium text-gray-900 outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm flex-shrink-0
            ${input.trim()
              ? 'bg-[#075e54] text-white active:scale-95'
              : 'bg-[#075e54]/50 text-white/50'}`}
        >
          <Send size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
