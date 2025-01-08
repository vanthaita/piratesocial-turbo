import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Navbar = () => {
  return (
    <nav
      className="h-[10vh] flex justify-between items-center max-w-7xl mx-auto  px-4 md:px-8  transition-colors duration-300"
      aria-label="main navigation"
    >
      <div className="text-2xl font-bold text-gray-800">Pirate Social</div>
      <div>
        <Link href="/sign-in" aria-label="get-started">
          <Button
            variant="default"
            className={cn(
                'font-medium py-2 px-4 rounded-full border border-gray-700 bg-white text-gray-800 transition-colors duration-200 focus:outline-none',
            'hover:bg-blue-600 hover:text-white',
            )}
          >
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;