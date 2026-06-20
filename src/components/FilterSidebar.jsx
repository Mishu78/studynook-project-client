"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const AVAILABLE_AMENITIES = [
  "Whiteboard",
  "Projector",
  "Wi-Fi",
  "Power Outlets",
  "Quiet Zone",
  "Air Conditioning"
];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Local component states synced directly to present URL query parameters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get("amenities") ? searchParams.get("amenities").split(",") : []
  );

  // Synchronizes filter queries into reactive URL changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search) params.set("search", search);
      else params.delete("search");

      if (minPrice) params.set("minPrice", minPrice);
      else params.delete("minPrice");

      if (maxPrice) params.set("maxPrice", maxPrice);
      else params.delete("maxPrice");

      if (selectedAmenities.length > 0) {
        params.set("amenities", selectedAmenities.join(","));
      } else {
        params.delete("amenities");
      }

      startTransition(() => {
        router.push(`/rooms?${params.toString()}`);
      });
    }, 400); // 400ms Debounce limit protects backend database overloads

    return () => clearTimeout(delayDebounce);
  }, [search, minPrice, maxPrice, selectedAmenities, router, searchParams]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    );
  };

  const handleReset = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedAmenities([]);
    router.push("/rooms");
  };

  return (
    <aside className="w-full lg:w-72 bg-white border border-stone-200/80 rounded-3xl p-6 shadow-xs h-fit space-y-6">
      <div className="flex items-center justify-between border-b border-stone-100 pb-4">
        <h3 className="font-bold text-stone-900 text-lg">Refine</h3>
        <button 
          onClick={handleReset}
          className="text-xs font-semibold text-stone-400 hover:text-amber-700 transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Text Search Input Field */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Search by name</label>
        <div className="relative flex items-center bg-stone-50 border border-stone-200 rounded-xl focus-within:border-emerald-700 transition-all overflow-hidden px-3">
          <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Quiet Pod"
            className="w-full h-11 outline-none bg-transparent text-sm text-stone-700 placeholder:text-stone-400"
          />
        </div>
      </div>

      {/* Amenities Checkboxes Block */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Amenities</label>
        <div className="space-y-2">
          {AVAILABLE_AMENITIES.map((amenity) => {
            const isChecked = selectedAmenities.includes(amenity);
            return (
              <label 
                key={amenity} 
                className="flex items-center gap-3 text-sm font-medium text-stone-600 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleAmenityChange(amenity)}
                  className="w-4 h-4 rounded border-stone-300 text-emerald-800 focus:ring-emerald-800/20 accent-emerald-800 cursor-pointer"
                />
                <span className={`transition-colors ${isChecked ? 'text-emerald-900 font-bold' : 'group-hover:text-stone-900'}`}>
                  {amenity}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Custom Hourly Price Inputs Block */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Hourly rate ($)</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-sm focus:border-emerald-700 transition-all text-stone-700"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full h-10 px-3 bg-stone-50 border border-stone-200 rounded-xl outline-none text-sm focus:border-emerald-700 transition-all text-stone-700"
          />
        </div>
      </div>

      {isPending && (
        <div className="text-center pt-2">
          <span className="text-xs font-medium text-emerald-800 animate-pulse">Syncing catalog results...</span>
        </div>
      )}
    </aside>
  );
}