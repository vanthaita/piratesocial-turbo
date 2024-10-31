import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero = () => (
  <section className="max-w-7xl h-auto mx-auto bg-base-100 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-20 px-8 py-6 lg:py-20 ">
    <div className="flex flex-col gap-10 lg:gap-14 items-center justify-center text-center lg:text-left lg:items-start mb-10">
      <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4">
        Embark on an Unforgettable Journey of Discovery and Adventure!
      </h1>
      <p className="text-lg opacity-80 leading-relaxed">
        Join a community of adventurers and free spirits! Connect with those who have a pirate&apos;s mind, ready to explore new horizons and create unforgettable stories. Set sail with us and discover a world of endless possibilities!
      </p>
      <Link href='/sign-in'>
        <Button>
          Get Started
        </Button>
      </Link>
    </div>
    <div className="lg:w-full mb-10 md:block hidden">
      <Image
        src="https://plus.unsplash.com/premium_photo-1677993185868-92b55434333d?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Pirate Sociaal Journey"
        className="w-full"
        priority={true}
        width={500}
        height={500} 
      />
    </div>
  </section>
);

export default Hero;
