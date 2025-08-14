const classNames = (...classes) => classes.filter(Boolean).join(' ');

const ReviewCard = ({ review }) => (
  <div className="border border-gray-200 rounded-xl p-6">
    <div className="flex items-center mb-3">
      {[0, 1, 2, 3, 4].map((rating) => (
        <span
          key={rating}
          className={classNames(
            (review.rating || 0) > rating ? 'text-yellow-400' : 'text-gray-300',
            'text-lg'
          )}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
    <h4 className="font-semibold text-md text-gray-800">{review.title}</h4>
    <p className="text-gray-600 mt-2 text-sm leading-relaxed">{review.content}</p>
    <div className="flex items-center mt-6">
      <div className="w-10 h-10 bg-gray-200 rounded-full mr-4 bg-cover bg-center" style={{backgroundImage: `url(${review.avatarUrl})`}}></div>
      <div>
        <p className="text-sm font-medium text-gray-800">{review.author}</p>
        <p className="text-xs text-gray-500">{review.date}</p>
      </div>
    </div>
  </div>
);

export default function ReviewSection({ product }) {
  // Placeholder reviews matching the design
  const reviews = [
    { id: 1, rating: 0, title: 'Review title', content: 'Sed venenatis ac sapien non consectetur. Suspendisse laor...', author: 'Reviewer name', date: 'Date', avatarUrl: 'https://i.pravatar.cc/40?img=1' },
    { id: 2, rating: 0, title: 'Review title', content: 'Nulla vestibulum odio ut erat aliquam congue.', author: 'Reviewer name', date: 'Date', avatarUrl: 'https://i.pravatar.cc/40?img=2' },
    { id: 3, rating: 0, title: 'Review title', content: 'Suspendisse laoreet bibendum velit, vel tristique.', author: 'Reviewer name', date: 'Date', avatarUrl: 'https://i.pravatar.cc/40?img=3' },
  ];

  return (
    <div className="mt-20" id="reviews">
      <h2 className="text-3xl font-normal text-gray-800 mb-8">Latest reviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
