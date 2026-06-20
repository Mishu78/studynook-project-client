'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// ✅ FIXED: Removed loose Modal sub-exports; importing Modal and TextArea correctly
import { Modal, Button, Input, TextArea } from '@heroui/react';
import toast from 'react-hot-toast';

const AMENITY_OPTIONS = ["Whiteboard", "Projector", "Wi-Fi", "Power Outlets", "Quiet Zone", "Air Conditioning"];

export default function EditRoomModal({ room, isOpen, onOpenChange, onRefresh }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Sync state data safely whenever the room selection changes or modal toggles
  useEffect(() => {
    if (isOpen && room?.amenities) {
      setSelectedAmenities(room.amenities);
    }
  }, [room, isOpen]);

  const handleAmenityChange = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const updatedPayload = {
      roomName: formData.get('roomName'),
      description: formData.get('description'),
      image: formData.get('image'),
      floor: formData.get('floor'),
      capacity: formData.get('capacity'),
      hourlyRate: formData.get('hourlyRate'),
      amenities: selectedAmenities,
    };

    try {
      const token = localStorage.getItem('access-token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const res = await fetch(`${baseUrl}/rooms/${room._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedPayload)
      });

      if (res.ok) {
        toast.success('Room updated successfully');
        onOpenChange(false); // Close Modal safely
        if (onRefresh) onRefresh(); 
        router.refresh(); 
      } else {
        toast.error('Failed to update sanctuary parameters.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network update call failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl" scrollBehavior="inside" backdrop="blur">
      {/* ✅ FIXED: Accessing content layouts via standard chained dot-notation wrappers */}
      <Modal.Content className="rounded-[2rem] p-4 bg-white">
        {(onClose) => (
          <form onSubmit={handleUpdate}>
            <Modal.Header className="flex flex-col gap-1 text-xl font-black text-stone-900">
              Modify Studio Sanctuary Settings
            </Modal.Header>
            
            <Modal.Body className="space-y-4 py-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600">Room Name</label>
                <Input
                  name="roomName"
                  required
                  defaultValue={room?.roomName}
                  variant="bordered"
                  classNames={{ inputWrapper: "h-11 border-stone-200 focus-within:!border-emerald-700 rounded-xl" }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600">Description</label>
                <TextArea
                  name="description"
                  required
                  defaultValue={room?.description}
                  variant="bordered"
                  minRows={2}
                  classNames={{ inputWrapper: "border-stone-200 focus-within:!border-emerald-700 rounded-xl py-2" }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600">Floor</label>
                  <Input
                    name="floor"
                    required
                    defaultValue={room?.floor}
                    variant="bordered"
                    classNames={{ inputWrapper: "h-11 border-stone-200 focus-within:!border-emerald-700 rounded-xl" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600">Capacity</label>
                  <Input
                    name="capacity"
                    required
                    type="number"
                    defaultValue={room?.capacity}
                    variant="bordered"
                    classNames={{ inputWrapper: "h-11 border-stone-200 focus-within:!border-emerald-700 rounded-xl" }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-600">Hourly Rate ($)</label>
                  <Input
                    name="hourlyRate"
                    required
                    type="number"
                    step="0.01"
                    defaultValue={room?.hourlyRate}
                    variant="bordered"
                    classNames={{ inputWrapper: "h-11 border-stone-200 focus-within:!border-emerald-700 rounded-xl" }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-600">Image URL</label>
                <Input
                  name="image"
                  required
                  type="url"
                  defaultValue={room?.image}
                  variant="bordered"
                  classNames={{ inputWrapper: "h-11 border-stone-200 focus-within:!border-emerald-700 rounded-xl" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-600">Utilities / Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AMENITY_OPTIONS.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => handleAmenityChange(amenity)}
                        className={`h-10 text-xs px-3 rounded-xl border font-semibold flex items-center justify-between transition-all ${
                          isChecked 
                            ? 'bg-emerald-50 border-emerald-700 text-emerald-900' 
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        {amenity}
                        <span className="text-[10px]">{isChecked ? '●' : '○'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="border-t border-stone-100 pt-3">
              <Button size="sm" variant="flat" onPress={onClose} className="rounded-xl font-bold bg-stone-100 text-stone-700">
                Discard Changes
              </Button>
              <Button size="sm" type="submit" isLoading={loading} className="rounded-xl font-black bg-[#063725] text-white">
                Save Sanctuary Configuration
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Modal.Content>
    </Modal>
  );
}