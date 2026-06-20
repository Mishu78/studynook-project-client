import { Button, Chip } from "@heroui/react";
import { Layers, Users, Bookmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AvailableCard = ({ room }) => {
  // Destructure matching your exact working database fields
  const { 
    _id, 
    roomName, 
    image, 
    description, 
    floor, 
    capacity, 
    hourlyRate, 
    amenities = [],
    bookingCount = 0
  } = room;

  // Safe truncation to ~100 characters max
  const truncatedDesc = description?.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;

  // Split calculations for amenities pills array limits
  const visibleAmenities = amenities.slice(0, 3);
  const remainingCount = amenities.length - 3;

  return (
    <div
      className="group flex flex-col bg-white rounded-[2rem] border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 justify-between h-full"
    >
      <div>
        {/* Uniform Image Size Layer Box */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
          <Image 
            src={image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600'}
            alt={roomName || "Study Room"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform transition duration-500 group-hover:scale-102"
          />
          {/* Absolute Floating Hourly Pricing Badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-stone-200/30 font-extrabold text-sm text-[#063725] shadow-sm">
            <span>${hourlyRate || 0}/hr</span>
          </div>
        </div>

        {/* Primary Context Structural Content Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Link href={`/rooms/${_id}`}>
              <h4 className="text-xl font-bold text-stone-800 tracking-tight group-hover:text-[#063725] transition-colors line-clamp-1">
                {roomName}
              </h4>
            </Link>
            <p className="text-sm font-medium text-stone-500 leading-relaxed min-h-[40px]">
              {truncatedDesc || "No dynamic summary descriptive guidelines set for this space."}
            </p>
          </div>

          {/* Micro-spec Details Bar (Floor, Seats, Bookings) */}
          <div className="flex items-center gap-4 text-xs font-bold text-stone-600 bg-stone-50/80 p-3 rounded-xl border border-stone-100">
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-stone-400" /> 
              <span>Floor {floor || "N/A"}</span>
            </div>
            <div className="h-3 w-px bg-stone-200" />
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-400" /> 
              <span>{capacity || "2-4"} people</span>
            </div>
            <div className="h-3 w-px bg-stone-200" />
            <div className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-stone-400" /> 
              <span>{bookingCount || 0} bookings</span>
            </div>
          </div>

          {/* Dynamic Amenities Chips Rendering Row */}
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

      {/* Lower Level Button Tier */}
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
};

export default AvailableCard;