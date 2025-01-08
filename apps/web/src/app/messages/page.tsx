import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative bg-gray-100 transition-colors duration-300">
      <div className="flex items-center justify-center w-full h-full">
        <Image
          src="/logo.png"
          alt="App Logo"
          width={450}
          height={450}
          className="object-contain max-w-[80%] max-h-[80%] transition-transform duration-500 hover:scale-105"
            priority
        />
      </div>
    </div>
  );
}