import AvailableRooms from "@/components/AvailableRooms";
import HeroBanner from "@/components/HeroBanner";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
    <HeroBanner />
      <AvailableRooms/>
      <HowItWorks/>
      <WhyChooseUs />
    </div>
  );
}
