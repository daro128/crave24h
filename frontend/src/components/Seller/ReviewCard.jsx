import React from 'react';
import { Star } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const customerName = review.Customer?.User?.full_name ?? 'Anonymous';
  const initials = customerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const date = review.review_date
    ? new Date(review.review_date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="card-hover bg-white border border-gray-200/90 rounded-2xl p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-teal-50 text-[#004D40] text-xs font-bold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 text-sm truncate">{customerName}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
            />
          ))}
        </div>
      </div>

      {review.comment && (
        <p className="text-sm text-gray-600 mt-3 leading-relaxed">{review.comment}</p>
      )}

      <span className="inline-block text-xs font-bold text-teal-700 bg-teal-50/60 px-2.5 py-1 rounded-lg mt-3">
        {review.Product?.product_name ?? 'Product'}
      </span>
    </div>
  );
};

export default ReviewCard;
