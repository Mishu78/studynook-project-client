import { Button } from "@heroui/react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] py-20 lg:py-32">
      {/* Premium Ambient Background Accents */}
      <div className="absolute top-0 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#063725]/5 to-transparent blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="space-y-6 lg:col-span-6 text-center lg:text-left">
            
            {/* Premium Mini-Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#063725]/5 border border-[#063725]/10 text-[#063725] text-xs font-bold uppercase tracking-wider mx-auto lg:mx-0 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Your Ultimate Library Sanctuary</span>
            </div>

            {/* Main Catchy Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.1]">
              Find Your Perfect <br />
              <span className="text-[#063725] relative inline-block">
                Study Room
                <span className="absolute bottom-1 left-0 w-full h-2 bg-amber-200/60 -z-10 rounded-full" />
              </span>
            </h1>

            {/* Subtext Description */}
            <p className="text-base sm:text-lg text-stone-600 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Browse and book quiet, private study rooms in your library. List your own room and earn seamlessly.
            </p>

            {/* Call to Action Button Interlocking Layout */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link href="/rooms" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  endContent={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  className="w-full sm:w-auto font-bold rounded-2xl bg-[#063725] text-white shadow-xl shadow-[#063725]/20 hover:bg-[#042419] hover:shadow-2xl hover:shadow-[#063725]/30 transition-all duration-300 group px-8 py-7 text-base"
                >
                  Explore Rooms
                </Button>
              </Link>
              
              <Link href="/dashboard/list-room" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="bordered"
                  startContent={<Search className="w-4 h-4 text-stone-500" />}
                  className="w-full sm:w-auto font-bold rounded-2xl border-2 border-stone-200 text-stone-700 bg-white hover:bg-stone-50 hover:border-stone-300 px-7 py-7 text-base transition-colors"
                >
                  List Your Room
                </Button>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="pt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-stone-400 border-t border-stone-200/60 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-700 text-sm font-extrabold">100%</span> Private Spaces
              </div>
              <div className="w-1 h-1 bg-stone-300 rounded-full" />
              <div className="flex items-center gap-1.5">
                <span className="text-stone-700 text-sm font-extrabold">Instant</span> Secure Booking
              </div>
            </div>

          </div>

          {/* Right Image Mask Column */}
          <div className="lg:col-span-6 relative w-full h-[350px] sm:h-[450px] lg:h-[500px] animate-fade-in-right">
            
            {/* Background Geometric Decor Blocks */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-100 rounded-3xl -z-10 opacity-70 blur-sm" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#063725]/10 rounded-[3rem] -z-10 blur-md" />

            {/* Premium Framed Container */}
            <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shadow-stone-300/80 bg-stone-100">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200" // Premium modern minimalist workspace fallback
                alt="Find Your Perfect Study Room"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transform hover:scale-105 transition duration-700 ease-out"
              />
            </div>

            {/* Absolute Overlay Float Card (Simulating live activity) */}
            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-100 max-w-[200px] hidden sm:flex items-center gap-3 animate-bounce-slow">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Active Spots</p>
                <p className="text-sm font-black text-stone-800">12 Rooms Open Now</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;