import React from 'react';

export default function CallToAction() {
  return (
    <section className="text-black py-20 px-6 text-center relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full flex justify-center items-center">
        <div className="bg-gradient-to-r from-orange-400 to-red-500 opacity-20 w-80 h-80 rounded-full blur-xl"></div>
        <div className="bg-gradient-to-r from-blue-300 to-purple-500 opacity-20 w-64 h-64 rounded-full blur-xl absolute top-20 right-20"></div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-6 drop-shadow-md">
          Join Pirate Social Today
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto drop-shadow-md">
          Sign up now and be a part of a new era of decentralized social networking with Pirate Social.
        </p>
        <button className="bg-orange-500 hover:bg-orange-600 font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 duration-300 ease-in-out">
          Get Started
        </button>
      </div>
    </section>
  );
}
