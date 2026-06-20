"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import BookingModal from "@/components/BookingModal";

export default function RoomActionWrapper({ room }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="space-y-3 pt-2">
      <Button 
        onClick={() => {
          if (!session) {
            toast.error("Please log in to continue booking.");
            return router.push('/login');
          }
          setIsBookingOpen(true);
        }}
        className="w-full bg-[#063725] text-white font-bold rounded-2xl py-7 text-base shadow-xl shadow-[#063725]/10 tracking-wide"
      >
        Book This Sanctuary
      </Button>

      {isBookingOpen && (
        <BookingModal 
          room={room} 
          session={session} 
          onClose={() => setIsBookingOpen(false)} 
          onBookingSuccess={() => router.push("/my-bookings")}
        />
      )}
    </div>
  );
}