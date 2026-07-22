import { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import ReviewCard from '../../components/Seller/ReviewCard';
import Reveal from '../../components/common/Reveal';
import { getReviews } from '../../api/sellerApi';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState('0.0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getReviews();
        if (!res.success) {
          setError(res.message || 'Failed to load reviews.');
          return;
        }
        setReviews(res.data);
        setTotalReviews(res.total_reviews);
        setAverageRating(res.average_rating);
      } catch {
        setError('Server unreachable. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <p className="text-center text-gray-400 py-12 text-sm">Loading reviews...</p>;
  if (error) return <p className="text-center text-red-500 py-12 text-sm">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 sm:px-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-800 tracking-tight">Customer Reviews</h2>
        <p className="text-sm text-gray-500 mt-0.5">See what customers are saying about your menu.</p>
      </div>

      <Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card-hover bg-white border border-gray-200/90 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-400 text-white flex items-center justify-center shrink-0">
              <Star size={20} className="fill-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-black text-gray-800">{averageRating} / 5</h3>
            </div>
          </div>

          <div className="card-hover bg-white border border-gray-200/90 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-500 text-white flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Reviews</p>
              <h3 className="text-2xl font-black text-gray-800">{totalReviews}</h3>
            </div>
          </div>
        </div>
      </Reveal>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Reveal key={review.review_id} delay={Math.min(index, 6) * 80}>
              <ReviewCard review={review} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center max-w-md mx-auto shadow-sm">
          <p className="text-sm font-bold text-gray-800">No Reviews Yet</p>
          <p className="text-xs text-gray-400 mt-1">Customer ratings and comments will show up here once they start reviewing delivered orders.</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
