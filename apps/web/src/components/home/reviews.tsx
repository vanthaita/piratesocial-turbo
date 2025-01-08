/* eslint-disable @next/next/no-img-element */
import { cn } from '@/lib/utils';
import Marquee from '../ui/marquee';

const reviews = [
  {
    name: 'Jack',
    username: '@jack',
    body: 'Pirate Sociaal is unlike anything else. It’s a thrilling journey, meeting people who share the same passion for adventure. I\'m hooked!',
    img: 'https://avatar.vercel.sh/jack',
  },
  {
    name: 'Jill',
    username: '@jill',
    body: 'This platform makes you feel like you\'re truly setting sail with fellow explorers. I’ve found my pirate crew!',
    img: 'https://avatar.vercel.sh/jill',
  },
  {
    name: 'John',
    username: '@john',
    body: 'The sense of community here is incredible. It’s like stepping into a world of endless possibilities. Pirate Sociaal is a game-changer!',
    img: 'https://avatar.vercel.sh/john',
  },
  {
    name: 'Jane',
    username: '@jane',
    body: 'Every day on Pirate Sociaal feels like an exciting new adventure. I’ve met so many amazing people, all ready to chart new courses.',
    img: 'https://avatar.vercel.sh/jane',
  },
  {
    name: 'Jenny',
    username: '@jenny',
    body: 'Pirate Sociaal brings together free spirits like no other platform. It’s all about discovering new experiences and creating unforgettable stories.',
    img: 'https://avatar.vercel.sh/jenny',
  },
  {
    name: 'James',
    username: '@james',
    body: 'I joined for the adventure, but I stayed for the friendships. Pirate Sociaal is where I belong. Ready to explore more!',
    img: 'https://avatar.vercel.sh/james',
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }: any) => {
  return (
    <figure
      className={cn(
        'relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
        // light styles
        'border-gray-200 bg-gray-100 hover:bg-gray-200',
        // dark styles
        'dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700',
      )}
    aria-label={`review-${name}`}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full object-cover" width="32" height="32" alt="" src={img}
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-gray-800 dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {username}
          </p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        {body}
      </blockquote>
    </figure>
  );
};

export default function MarqueeReviews() {
  return (
    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900">
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-transparent to-pink-300 opacity-10 blur-2xl"></div>
           </div>

      <Marquee pauseOnHover className="[--duration:25s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:25s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-gray-50 dark:from-gray-900"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-gray-50 dark:from-gray-900"></div>
    </div>
  );
}