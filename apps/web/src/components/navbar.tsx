import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';

const Navbar = () => {
  
  return (
    <nav className='h-[10vh] flex justify-between items-center max-w-7xl mx-auto bg-base-100 px-8'>
      <div className='text-2xl font-bold'>
        Pirate Social
      </div>
      <div>
        <Link href='/sign-in'>
          <Button variant='default' className=' hover:bg-blue-700 hover:text-white text-black font-bold py-2 px-4 rounded-full border border-solid border-gray-700 bg-white'>
            Get Started
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
