import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Review() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const tags = ['On Time', 'Polite', 'Clean Work', 'Good Price', 'Professional'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 relative overflow-y-auto pb-32">
      <div className="flex flex-col items-center justify-center pt-8">
        <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Job Completed</h1>
        <p className="text-gray-500 font-medium mb-10">Your payment of ₹249 was released.</p>

        <h3 className="text-lg font-extrabold text-gray-900 mb-6 text-center">How was your experience with Ramesh?</h3>
        
        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg 
              key={star} 
              onClick={() => setRating(star)}
              className={`w-10 h-10 cursor-pointer transition-all ${star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-200 hover:scale-110'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {rating > 0 && (
          <div className="mb-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
            <p className="text-center text-sm font-bold text-gray-500 mb-4">What stood out?</p>
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <span 
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 font-bold text-sm rounded-full border cursor-pointer transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <textarea className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm font-medium text-gray-900 outline-none focus:border-blue-700 h-28 resize-none mb-6" placeholder="Leave a review (optional)..."></textarea>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex flex-col gap-3 z-10">
        <button onClick={() => navigate('/customer/receipt')} className="w-full bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-800 transition-colors">
          Submit Review
        </button>
        <button onClick={() => navigate('/customer/receipt')} className="w-full text-gray-500 font-bold py-3 text-sm">
          Skip for now
        </button>
      </div>
    </div>
  );
}
