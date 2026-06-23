"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import RoomCard from "@/components/RoomCard";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function MyListings() {
  const { data: session, isPending } = useSession();
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch if session loading has finished and a valid user email exists
    if (!isPending && session?.user?.email) {
      
      // ✅ OPTIMIZED: Fetching using the query filter directly to lighten payload sizes
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/rooms?createdBy=${encodeURIComponent(session.user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setMyRooms(data);
          }
        })
        .catch((err) => {
          console.error("Failed loading listings:", err);
        })
        .finally(() => {
          // ✅ SAFE STATE CLOSURE: Ensures loading is disabled perfectly exactly once
          setLoading(false);
        });
    }
  }, [session?.user?.email, isPending]); // 🎯 Pinning down to the explicit email string dependency stops tracking context changes

  if (isPending || loading) {
    return <div className="text-center py-20 font-bold text-stone-500">Syncing ownership parameters...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-12 text-stone-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">My Managed Rooms</h1>
            <p className="text-sm text-stone-500 font-medium mt-1">Monitor and modify your listed private study sanctuaries.</p>
          </div>
          <Link href="/add-room">
            <button className="flex items-center gap-2 px-5 py-3 bg-[#063725] text-white rounded-xl text-sm font-bold shadow-md hover:bg-emerald-950 transition-all">
              <PlusCircle className="w-4 h-4" /> Add New Space
            </button>
          </Link>
        </div>

        {myRooms.length === 0 ? (
          <div className="text-center py-20 bg-white border border-stone-200/60 rounded-[2rem] p-8 max-w-md mx-auto">
            <p className="text-stone-500 font-semibold">You haven't listed any study spaces yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myRooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}