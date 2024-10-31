import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full relative bg-gray-200">
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to Pirate Chat!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Start chatting and connect with people around the world.
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 font-bold py-3 px-6 rounded-lg 
        shadow-lg transition duration-300 text-white">
          Join the Chat
        </button>
      </div>
    </div>
  );
}
