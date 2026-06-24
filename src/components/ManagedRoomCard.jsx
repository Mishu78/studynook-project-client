"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import Image from "next/image";

export default function ManagedRoomCard({ room, onRefresh }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const { _id, roomName, createdBy, capacity, bookingCount, description, amenities, hourlyRate, image } = room;

  // ==========================================
  // HANDLE DELETION
  // ==========================================
  const handleRemoveSpace = async () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${roomName}"? This will clear all pending bookings.`);
    if (!confirmDelete) return;

    setIsDeleting(true);

    try {
      // 1. Get token context cleanly
      const { data: jwtData } = await authClient.token();
      const token = jwtData?.token;

      if (!token) {
        toast.error("Authentication expired. Please log in again.");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/rooms/${_id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success("Study sanctuary removed successfully.");
        if (onRefresh) onRefresh(); // 🔄 Triggers a state update on your My Listings page immediately!
      } else {
        toast.error(data.message || "Failed to remove the space.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network communication failure.");
    } finally {
      setIsDeleting(false);
    }
  };

 // ==========================================
  // HANDLE EDIT DIRECTION
  // ==========================================
  const handleEditRedirect = () => {
    // 🎯 Redirects to the details page where your edit modal is already active and waiting!
    router.push(`/rooms/${_id}`);
  };

  return (
    <div className="flex flex-col md:flex-row bg-white border border-stone-200/80 rounded-[2rem] shadow-xl p-6 gap-6 items-center w-full max-w-4xl mx-auto">
      {/* Image Container */}
      <div className="relative w-full md:w-1/2 aspect-[16/10] md:aspect-square max-h-[280px] overflow-hidden rounded-[1.5rem] bg-stone-100">
        <Image 
          src={image || "https://images.unsplash.com/photo-1497366216548-37526070297c"} 
          alt={roomName}
          fill
          className="object-cover"
        />
      </div>

      {/* Content Details Matrix */}
      <div className="flex-1 w-full space-y-4">
        <div>
          <h2 className="text-2xl font-black text-[#063725] capitalize">{roomName}</h2>
          <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">By: {createdBy}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-bold text-stone-600">
          <span className="bg-stone-100 px-3 py-1.5 rounded-lg">👤 Max Cap: {capacity}</span>
          <span className="bg-stone-100 px-3 py-1.5 rounded-lg">📅 Bookings Run: {bookingCount || 0}</span>
        </div>

        <p className="text-sm text-stone-500 line-clamp-2">{description}</p>

        {/* Amenities Rendering */}
        <div className="flex flex-wrap gap-1">
          {amenities?.map((amenity) => (
            <span key={amenity} className="text-xs font-bold text-emerald-800 bg-emerald-50/60 border border-emerald-100 px-2.5 py-1 rounded-full">
              ✓ {amenity}
            </span>
          ))}
        </div>

        {/* Action Controls interface matching your screenshot design layout */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button 
            onClick={handleEditRedirect}
            className="flex-1 bg-amber-50 border border-amber-200 text-amber-900 font-bold rounded-xl h-11"
          >
            Edit Listing
          </Button>
          <Button 
            isLoading={isDeleting}
            onClick={handleRemoveSpace}
            className="flex-1 bg-rose-50 border border-rose-100 text-rose-700 font-bold rounded-xl h-11"
          >
            Remove Space
          </Button>
        </div>
      </div>

      {/* Price tag block */}
      <div className="text-right self-start md:self-center">
        <span className="text-2xl font-black text-[#063725]">${hourlyRate}</span>
        <p className="text-xs text-stone-400 font-bold">per hour</p>
      </div>
    </div>
  );
}