import CallToAction from "@/components/home/callToAction";
import Features from "@/components/home/features";
import Footer from "@/components/home/footer";
import HeroSection from "@/components/home/heroSection";
import MarqueeReviews from "@/components/home/reviews";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br via-white  from-purple-400 to-blue-500">
      <Navbar />
      <HeroSection />
      {/* <Features /> */}
      <MarqueeReviews />
      <CallToAction />
      <Footer />
    </div>
  );
}
