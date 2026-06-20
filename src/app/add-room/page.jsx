'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea } from '@heroui/react';
import { PlusCircle, Layers, Users, DollarSign, Image } from 'lucide-react';
import { authClient } from '@/lib/auth-client'; // Replace with your exact Better Auth client path
import { toast } from 'react-hot-toast';

export default function AddRoomPage() {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const AMENITY_OPTIONS = ["Whiteboard", "Projector", "Wi-Fi", "Power Outlets", "Quiet Zone", "Air Conditioning"];

  const handleToggleAmenity = (item) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleAddRoomSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    // 1. Grab session data from your Better Auth Client setup
    const session = await authClient.getSession();
    const token = session?.data?.session?.token;

    if (!token) {
      toast.error("Please log in to publish a workspace listing.");
      router.push('/login');
      setActionLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    const newRoomPayload = {
      roomName: formData.get('roomName'),
      description: formData.get('description'),
      floor: formData.get('floor'),
      capacity: parseInt(formData.get('capacity')),
      hourlyRate: parseFloat(formData.get('hourlyRate')),
      image: formData.get('image'),
      amenities: selectedAmenities,
    };

    try {
      const res = await fetch(`${baseUrl}/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Pass JWT cleanly to JWKS verification layer
        },
        body: JSON.stringify(newRoomPayload)
      });

      if (res.ok) {
        toast.success("Sanctuary room posted successfully!");
        router.push('/my-listings');
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to publish room listing.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network communication failure.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white border border-stone-200/80 rounded-[2rem] shadow-xl p-8 space-y-6">
        
        <div>
          <h1 className="text-2xl font-black text-[#063725] flex items-center gap-2">
            <PlusCircle className="w-6 h-6 text-emerald-800" /> Host a New Workspace Sanctuary
          </h1>
          <p className="text-stone-500 text-xs mt-1">Configure your room details, setup floor environments, and declare pricing rates.</p>
        </div>

        <form onSubmit={handleAddRoomSubmit} className="space-y-5">
          
          {/* 01. BASIC DETAILS */}
          <div className="space-y-3">
            <Input label="Room Name" name="roomName" required variant="bordered" radius="xl" placeholder="e.g., Emerald Core Lab" />
            <Textarea label="Description" name="description" required variant="bordered" radius="xl" placeholder="Describe layout configurations, sound insulation..." minRows={3} />
          </div>

          {/* 02. SPATIAL MATRIX CONTEXT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Floor" name="floor" required variant="bordered" radius="xl" placeholder="e.g., 3rd Floor" startContent={<Layers className="w-4 h-4 text-stone-400" />} />
            <Input label="Capacity" name="capacity" type="number" required variant="bordered" radius="xl" placeholder="e.g., 6" startContent={<Users className="w-4 h-4 text-stone-400" />} />
            <Input label="Hourly Rate ($)" name="hourlyRate" type="number" step="0.01" required variant="bordered" radius="xl" placeholder="e.g., 15.00" startContent={<DollarSign className="w-4 h-4 text-stone-400" />} />
          </div>

          {/* 03. GALLERY UTILITY LINK */}
          <Input label="Image URL From Internet" name="image" type="url" variant="bordered" radius="xl" placeholder="https://unsplash.com/..." startContent={<Image className="w-4 h-4 text-stone-400" />} />

          {/* 04. AMENITIES CONTROL CHIPS */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">Included Utilities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITY_OPTIONS.map((item) => {
                const isChecked = selectedAmenities.includes(item);
                return (
                  <button key={item} type="button" onClick={() => handleToggleAmenity(item)}
                    className={`py-2.5 px-4 border text-xs font-bold rounded-xl transition-all text-left flex items-center justify-between ${
                      isChecked ? 'bg-emerald-50 border-emerald-600 text-emerald-950 shadow-sm' : 'bg-stone-50/50 border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}>
                    {item} {isChecked && <span className="text-emerald-700">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTION BUTTON DECKS */}
          <div className="flex gap-3 pt-4 border-t border-stone-100">
            <Button type="button" variant="light" radius="xl" onClick={() => router.back()} className="flex-1 font-bold">Cancel</Button>
            <Button type="submit" isLoading={actionLoading} className="flex-1 bg-[#063725] text-white font-black rounded-xl h-12 shadow-lg">
              Publish Room Sanctuary
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}