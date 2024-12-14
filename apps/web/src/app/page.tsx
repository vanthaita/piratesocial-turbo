import { FaShip } from "react-icons/fa";
import Feed from "@/components/feed/Feed";
import { PiWavesLight } from "react-icons/pi";
import { useAuth } from "@/context/AuthContext";
export default function Home() {
  return (
    <div className="w-full h-auto flex flex-col items-center">
      {/* Logo */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative">
          <FaShip className="text-blue-500 text-6xl" />
          <PiWavesLight className="text-blue-400 text-5xl absolute bottom-[-20px] left-2" /> 
        </div>
        <h1 className="text-lg font-bold text-black mt-2">Pirates Social</h1>
      </div>
      <Feed />
    </div>
  );
}
