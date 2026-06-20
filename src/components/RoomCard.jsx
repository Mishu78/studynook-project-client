import { Button, Chip } from "@heroui/react";
import { Layers, Users, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RoomCard({ room }) {
  const { 
    _id, 
    name, 
    thumbnail, 
    description, 
    floor, 
    capacity, 
    price, 
    amenities = [] 
  } = room;

  // Truncate description safely to ~100 characters
  const truncatedDesc = description?.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;

  // Slice amenities for preview pills (Max 3 visible)
  const visibleAmenities = amenities.slice(0, 3);
  const remainingCount = amenities.length - 3;

  return (
    <div className="group bg-white border border-stone-200/70 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Uniform Size Object-Fit Cover Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
          <Image
            src={room.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'}
            alt={name || "Study Room"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform transition duration-500 group-hover:scale-102"
          />
          {/* Price Badge over Image */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-stone-200/30 font-extrabold text-sm text-[#063725] shadow-sm flex items-center gap-0.5">
            <DollarSign className="w-3.5 h-3.5 stroke-[3]" />
            <span>{room.hourlyRate || 0}/hr</span>
          </div>
        </div>

        {/* Metadata Context Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <h3 className="text-xl font-bold text-stone-800 tracking-tight group-hover:text-[#063725] transition-colors line-clamp-1">
              {room.roomName}
            </h3>
            <p className="text-sm font-medium text-stone-500 leading-relaxed min-h-[40px]">
              {room.description || "No dynamic summary descriptive guidelines set for this space."}
            </p>
          </div>

          {/* Floor and Capacity Spec Tags */}
          <div className="flex items-center gap-4 text-xs font-bold text-stone-600 bg-stone-50/80 p-3 rounded-xl border border-stone-100">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-stone-400" />
              <span>Floor {room.floor || "N/A"}</span>
            </div>
            <div className="h-3 w-px bg-stone-200" />
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>{room.capacity || "2-4"} people</span>
            </div>
            
  <div className="h-3 w-px bg-stone-200" />
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" />
              <span>$ {room.bookingCount || "N/A"} booking</span>
            </div>

          </div>

          {/* Amenities Chips Rendering Container */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {visibleAmenities.map((amenity, index) => (
                <Chip
                  key={index}
                  size="sm"
                  variant="flat"
                  className="bg-stone-100 text-stone-700 font-bold px-2 rounded-lg text-[11px]"
                >
                  {amenity}
                </Chip>
              ))}
              {remainingCount > 0 && (
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-amber-50 text-amber-700 border border-amber-100 font-bold px-2 rounded-lg text-[11px]"
                >
                  +{remainingCount} more
                </Chip>
              )}
            </div>
          )}
        </div>
      </div>

      {/* View Details Redirect Action Component */}
      <div className="p-6 pt-0">
        <Link href={`/rooms/${_id}`} className="w-full block">
          <Button
            className="w-full font-bold rounded-xl bg-[#063725] text-white shadow-sm hover:shadow-md hover:bg-[#042419] transition-all"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}