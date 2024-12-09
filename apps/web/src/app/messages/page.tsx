import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full relative bg-gray-200">
      <div className="flex items-center justify-center w-full h-full">
        <Image
          src="/logo.png"
          alt="Logo"
          width={450}
          height={450}
          className="w-[450px] h-[450px] object-fill" 
        />
      </div>
    </div>
  );
}
