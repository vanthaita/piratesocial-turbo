import React from 'react';
import { FaNetworkWired, FaCoins, FaShieldAlt } from 'react-icons/fa';
const featuresData = [
  {
    title: "Decentralized Network",
    description: "No central authority; full control of your data.",
    icon: <FaNetworkWired />, 
  },
  {
    title: "Earn Tokens",
    description: "Get rewarded for engaging and contributing to the community.",
    icon: <FaCoins />, 
  },
  {
    title: "Secure and Private",
    description: "Your data, your privacy. Protected by blockchain technology.",
    icon: <FaShieldAlt />, 
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20 px-6  overflow-hidden mb-10">
      <div className="bg-gradient-to-r from-orange-400 to-red-500 opacity-20 w-80 h-80 rounded-full blur-xl absolute"></div>
      <div className="bg-gradient-to-r from-blue-300 to-purple-500 opacity-20 w-64 h-64 rounded-full blur-xl absolute bottom-0 right-20"></div>

      <div className="relative max-w-6xl mx-auto text-center">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-12 drop-shadow-lg">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-4 rounded-full mb-4 text-white text-4xl">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
