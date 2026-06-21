import { Button } from "@heroui/react";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import AvailableCard from "./AvailableCard";

export const fetchFeaturedRooms = async () => {
  try {
    // 1. Force the exact local loopback IP address to bypass bad local DNS configs
    const baseUrl = "http://127.0.0.1:5000"; 
    
    // 2. Set up a 3-second timeout controller so the page NEVER hangs forever
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    console.log(`📡 Attempting to fetch live featured spaces from: ${baseUrl}/featured`);

    const res = await fetch(`${baseUrl}/featured`, {
      cache: "no-store", // Get fresh data every time
      signal: controller.signal,
    });

    clearTimeout(timeoutId); // Clear timeout if successful

    if (!res.ok) {
      console.error(`❌ Backend returned an error status: ${res.status}`);
      return [];
    }

    const data = await res.json();
    console.log("✅ Successfully retrieved live spaces:", data.length);
    return data || [];

  } catch (error) {
    // This will print the exact reason (e.g., Connection Refused, Timed Out) in your terminal
    console.error("⚠️ Live fetch failed:", error.message);
    return []; // Return empty array gracefully so your website still loads!
  }
};

const AvailableRooms = async () => {
  const rooms = await fetchFeaturedRooms();
//console.log("DEBUG FEATURED ROOMS DATA:", rooms);
  return (
    <section className="py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading Header matching sample flow */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#063725] font-bold uppercase tracking-widest text-sm">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Newly Added</span>
            </div>
            <h3 className="text-4xl font-extrabold text-stone-900 tracking-tight">
              Available Study Rooms
            </h3>
            <p className="text-stone-500 max-w-xl font-medium">
              Hand-picked quiet sanctuaries recently added to StudyNook. Reserve your optimized productivity spot today.
            </p>
          </div>

          <Link href="/rooms">
            <Button
              variant="flat"
              className="rounded-full font-bold group bg-[#063725]/10 text-[#063725] hover:bg-[#063725] hover:text-white transition-colors"
            >
              View all rooms{" "}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Responsive Grid Layout Layout: 3 Columns Desktop, 2 Tablet, 1 Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms?.slice(0, 6).map((room) => (
            <AvailableCard key={room?._id} room={room} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default AvailableRooms;