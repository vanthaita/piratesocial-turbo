'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const Hero = () => (
  <section
    className="max-w-7xl h-auto mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-20 px-4 py-6 lg:py-20 relative overflow-hidden"
    aria-label="hero section"
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-transparent to-pink-300 opacity-10 blur-2xl pointer-events-none"></div>
    <div className="flex flex-col gap-6 lg:gap-8 items-center justify-center text-center lg:text-left lg:items-start relative z-10">
      <motion.h1
        className="font-extrabold text-3xl lg:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-900 to-black"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Embark on an Unforgettable Journey of Discovery and Adventure!
      </motion.h1>

      <motion.p
        className="text-base text-gray-700 opacity-90 leading-relaxed"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        Join a community of adventurers and free spirits! Connect with those
        who have a pirate&apos;s mind, ready to explore new horizons and
        create unforgettable stories. Set sail with us and discover a world
        of endless possibilities!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Link href="/sign-in" aria-label="get-started">
          <Button
            className={cn(
                'px-4 py-2 text-base font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none',
              'bg-gray-800 text-white hover:bg-blue-600'
            )}
          >
            Get Started
          </Button>
        </Link>
      </motion.div>
    </div>

    <motion.div
      className="lg:w-full md:block hidden relative z-10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <Image
        src="https://plus.unsplash.com/premium_photo-1677993185868-92b55434333d?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Pirate Social Journey"
        className="w-full rounded-lg shadow-lg object-cover"
        priority={true}
        width={500}
        height={500}
      />
    </motion.div>
  </section>
);

export default Hero;