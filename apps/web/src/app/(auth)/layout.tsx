
import { ArrowBigDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import Loading from '../loading';
const AuthLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex flex-col md:flex-row h-screen w-full overflow-hidden max-h-screen">
      <div className="flex-grow h-full w-full flex items-center justify-center bg-gray-100 relative">
        <Link href="/">
          <div className='absolute left-10 top-10 cursor-pointer'>
            <FaArrowLeft />
          </div>
        </Link>
        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>
      </div>
      <div className="flex-grow h-full overflow-hidden relative w-full bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 flex flex-col justify-center items-start p-8 text-white">
        <div className="flex-shrink-0 w-full h-full absolute inset-0 z-0">
          <Image
            src="/iil.jpg"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 opacity-50"
            alt="ill"
          />
        </div>

        <div className="relative z-10 lg:w-2/3 space-y-6 overflow-hidden">
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Pirate Social
          </h1>
          <p className='text-3xl font-bold mb-6 leading-snug text-white drop-shadow-lg'>
            Embark on an Unforgettable Journey of Discovery and Adventure!
          </p>
          <p className="mb-6 text-lg leading-relaxed text-white drop-shadow-lg animate-slide-in-left">
            Join a community of adventurers and free spirits! Connect with those who have a pirate&apos;s mind, ready to explore new horizons and create unforgettable stories. Set sail with us and discover a world of endless possibilities!
          </p>

          <div className="flex justify-center items-center gap-4 max-w-full relative overflow-hidden h-12  rounded-lg shadow-lg">
            <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
              <div className="whitespace-nowrap animate-marquee text-white flex justify-center items-center w-full h-full">
                <div className="flex justify-center items-center gap-4 bg-gradient-to-rw-full h-full px-4">
                  <button className="text-white text-lg p-2 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 shadow-md hover:from-pink-500 hover:to-purple-500 transition-all duration-300 ease-in-out">
                    Set sail with us!
                  </button>
                  <ArrowBigDown className="-rotate-90 text-white opacity-80 hover:opacity-100 transition-opacity duration-300 ease-in-out" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
