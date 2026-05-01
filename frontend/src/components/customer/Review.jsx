import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Api from '../../utils/api';
import { Star, Check, Loader2 } from 'lucide-react';

export default function Review() {
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Extract booking details from URL or state
  const queryParams = new URLSearchParams(location.search);
  const bookingId = queryParams.get('bookingId');
  const workerName = "Partner"; // Should ideally be passed in state

  const tags = ['On Time', 'Polite', 'Clean Work', 'Good Price', 'Professional'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = async () => {
    // 1. Submit customer feedback to the backend
    // Why: To maintain partner quality and help other users make informed decisions
    if (rating === 0) return alert('Please select a rating');
    
    setLoading(true);
    try {
      await Api.post('/reviews', {
        bookingId,
        rating,
        comment: `${selectedTags.join(', ')}. ${comment}`.trim()
      });
      navigate('/customer/receipt');
    } catch (err) {
      console.error('Review submission failed:', err);
      // Fallback to next screen so user isn't stuck
      navigate('/customer/receipt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 relative overflow-y-auto pb-32">
      <div className="flex flex-col items-center justify-center pt-8 max-w-xl mx-auto w-full">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
          <Check size={40} strokeWidth={3} />
        </div>

        <h1 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase text-xs opacity-50">Job Completed</h1>
        <p className="text-gray-500 font-bold mb-10">Payment released to partner.</p>

        <h3 className="text-lg font-black text-gray-900 mb-6 text-center tracking-tight">How was your experience with {workerName}?</h3>
        
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star 
              key={star} 
              onClick={() => setRating(star)}
              className={`w-10 h-10 cursor-pointer transition-all ${star <= rating ? 'text-yellow-400 fill-current scale-110' : 'text-gray-200 hover:scale-110'}`} 
            />
          ))}
        </div>

        {rating > 0 && (
          <div className="mb-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">What stood out?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <span 
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 font-black text-[10px] uppercase tracking-widest rounded-full border cursor-pointer transition-colors ${isSelected ? 'bg-blue-700 text-white border-blue-700' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-3xl p-6 text-sm font-bold text-gray-900 outline-none focus:border-blue-700 h-32 resize-none mb-6" 
          placeholder="Share more details about the service (optional)..."
        ></textarea>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3 z-10 lg:sticky lg:border-none lg:bg-transparent">
        <div className="max-w-xl mx-auto w-full flex flex-col gap-3">
          <button 
            onClick={handleSubmitReview} 
            disabled={loading || rating === 0}
            className="w-full bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-800 transition-all active:scale-[0.98] uppercase tracking-widest text-xs flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Submit Review'}
          </button>
          <button onClick={() => navigate('/customer/receipt')} className="w-full text-gray-400 font-black py-3 text-[10px] uppercase tracking-widest hover:text-gray-900 transition-colors">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
