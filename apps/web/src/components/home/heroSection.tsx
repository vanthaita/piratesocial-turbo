'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => (
  <section className="max-w-7xl h-auto mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-6 lg:py-20 relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-transparent to-pink-300 opacity-20 blur-3xl pointer-events-none"></div>
    <div className="flex flex-col gap-8 lg:gap-12 items-center justify-center text-center lg:text-left lg:items-start relative z-10">
      <motion.h1
        className="font-extrabold text-4xl lg:text-6xl tracking-tight bg-clip-text text-transparent bg-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Embark on an Unforgettable Journey of Discovery and Adventure!
      </motion.h1>

      <motion.p
        className="text-lg text-gray-700 opacity-90 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Join a community of adventurers and free spirits! Connect with those
        who have a pirate&apos;s mind, ready to explore new horizons and
        create unforgettable stories. Set sail with us and discover a world
        of endless possibilities!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Link href="/sign-in">
          <Button className="px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-transform transform hover:scale-105">
            Get Started
          </Button>
        </Link>
      </motion.div>
    </div>

    <motion.div
      className="lg:w-full md:block hidden relative z-10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
    >
      <Image
        src="https://plus.unsplash.com/premium_photo-1677993185868-92b55434333d?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Pirate Social Journey"
        className="w-full rounded-lg shadow-lg"
        priority={true}
        width={500}
        height={500}
      />
    </motion.div>
  </section>
);

export default Hero;
