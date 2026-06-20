'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody } from '@heroui/react';
import { Edit3, Trash2, Users, PlusCircle, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function MyListingsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const AMENITY_OPTIONS = ["Whiteboard", "Projector", "Wi-Fi", "Power Outlets", "Quiet Zone", "Air Conditioning"];

  useEffect(() => {
    const token = localStorage.getItem('access-token');
    if (!token) {
      toast.error("Please login to view your listings.");
      router.push('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUser(payload);
      fetchMyRooms(payload.email);
    } catch (e) {
      toast.error("Session expired. Please login again.");
      router.push('/login');
    }
  }, []);

  const fetchMyRooms = async (email) => {
    try {
      const res = await fetch(`${baseUrl}/rooms`);
      if (res.ok) {
        const data = await res.json();
        const myFilteredRooms = data.filter(room => room.createdBy === email);
        setRooms(myFilteredRooms);
      }
    } catch (err) {
      toast.error("Failed to sync listing configurations.");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setSelectedAmenities(room.amenities || []);
    onEditOpen();
  };

  const openDeleteModal = (room) => {
    setSelectedRoom(room);
    onDeleteOpen();
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    const token = localStorage.getItem('access-token');
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
      const res = await fetch(`${baseUrl}/rooms/${selectedRoom._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedPayload)
      });

      if (res.ok) {
        toast.success("Listing updated successfully");
        onEditClose();
        fetchMyRooms(currentUser.email);
      } else {
        toast.error("Failed to apply modifications.");
      }
    } catch (err) {
      toast.error("Network error updating listing.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    const token = localStorage.getItem('access-token');

    try {
      const res = await fetch(`${baseUrl}/rooms/${selectedRoom._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        toast.success("Listing removed permanently");
        onDeleteClose();
        fetchMyRooms(currentUser.email);
      } else {
        toast.error("Unauthorized action.");
      }
    } catch (err) {
      toast.error("Network connection failure.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <p className="text-[#063725] font-semibold animate-pulse">Loading your custom nooks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-[#063725]">My Workspace Sanctuaries</h1>
            <p className="text-stone-500 text-sm mt-1">Manage, modify, and optimize your hosted room rentals.</p>
          </div>
          <Button onClick={() => router.push('/add-room')} className="bg-[#063725] text-white font-bold rounded-xl" startContent={<PlusCircle className="w-4 h-4" />}>
            Host a New Room
          </Button>
        </div>

        {rooms.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed border-stone-300 rounded-[2rem] max-w-xl mx-auto p-6">
            <h3 className="text-lg font-bold text-stone-700">No active listings hosted yet</h3>
            <p className="text-stone-400 text-sm mt-1 mb-6">Start sharing your workspace with students!</p>
            <Button onClick={() => router.push('/add-room')} className="bg-[#063725] text-white font-bold rounded-xl">Create First Listing</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <Card key={room._id} className="bg-white border border-stone-200/60 rounded-[2rem] shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between">
                <CardBody className="p-0 flex flex-col h-full">
                  
                  <div className="h-48 relative bg-stone-100 flex-shrink-0">
                    <img src={room.image} alt={room.roomName} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-emerald-950/90 text-amber-200 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {room.floor}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-lg text-[#063725] line-clamp-1 cursor-pointer" onClick={() => router.push(`/rooms/${room._id}`)}>
                          {room.roomName}
                        </h3>
                        <span className="font-black text-[#063725] flex-shrink-0">${room.hourlyRate}/hr</span>
                      </div>
                      <p className="text-stone-500 text-xs line-clamp-2 mt-1">{room.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-stone-600 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                      <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-emerald-700" /> Caps: {room.capacity}</div>
                      <div className="w-px h-3 bg-stone-200" />
                      <div className="flex items-center gap-1">Bookings: <span className="font-bold text-stone-800">{room.bookingCount || 0}</span></div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                      <Button onClick={() => openEditModal(room)} size="sm" className="flex-1 bg-amber-50 border border-amber-100 text-amber-900 font-bold rounded-lg" startContent={<Edit3 className="w-3.5 h-3.5" />}>
                        Edit
                      </Button>
                      <Button onClick={() => openDeleteModal(room)} size="sm" className="flex-1 bg-rose-50 border border-rose-100 text-rose-700 font-bold rounded-lg" startContent={<Trash2 className="w-3.5 h-3.5" />}>
                        Delete
                      </Button>
                      <Button onClick={() => router.push(`/rooms/${room._id}`)} isIconOnly size="sm" className="bg-stone-100 text-stone-700 rounded-lg">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl" backdrop="blur">
        <ModalContent className="rounded-[2rem] p-4">
          {selectedRoom && (
            <form onSubmit={handleUpdateSubmit}>
              <ModalHeader className="text-xl font-black text-[#063725]">Modify Sanctuary Profile</ModalHeader>
              <ModalBody className="space-y-4">
                <Input label="Room Name" name="roomName" defaultValue={selectedRoom.roomName} required variant="bordered" classNames={{ inputWrapper: "rounded-xl" }} />
                <Textarea label="Description" name="description" defaultValue={selectedRoom.description} required variant="bordered" classNames={{ inputWrapper: "rounded-xl" }} />
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Floor" name="floor" defaultValue={selectedRoom.floor} required variant="bordered" classNames={{ inputWrapper: "rounded-xl" }} />
                  <Input label="Capacity" name="capacity" type="number" defaultValue={selectedRoom.capacity} required variant="bordered" classNames={{ inputWrapper: "rounded-xl" }} />
                  <Input label="Rate ($)" name="hourlyRate" type="number" step="0.01" defaultValue={selectedRoom.hourlyRate} required variant="bordered" classNames={{ inputWrapper: "rounded-xl" }} />
                </div>
                <Input label="Image URL" name="image" defaultValue={selectedRoom.image} type="url" required variant="bordered" classNames={{ inputWrapper: "rounded-xl" }} />
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase">Amenities</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AMENITY_OPTIONS.map((item) => {
                      const isChecked = selectedAmenities.includes(item);
                      return (
                        <button key={item} type="button" onClick={() => setSelectedAmenities(prev => isChecked ? prev.filter(a => a !== item) : [...prev, item])}
                          className={`py-2 px-3 border text-xs font-semibold rounded-xl text-left flex items-center justify-between ${isChecked ? 'bg-emerald-50 border-emerald-600 text-emerald-950' : 'bg-stone-50 text-stone-600'}`}>
                          {item} <span>{isChecked ? '✓' : ''}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="light" onClick={onEditClose}>Close</Button>
                <Button type="submit" isLoading={actionLoading} className="bg-[#063725] text-white font-bold rounded-xl">Save Changes</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} backdrop="blur">
        <ModalContent className="rounded-[2rem] p-4">
          <ModalHeader className="text-xl font-black text-rose-700">Erase Space Listing</ModalHeader>
          <ModalBody>
            <p className="text-stone-600 text-sm">Are you sure you want to completely discard <strong>{selectedRoom?.roomName}</strong>?</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onDeleteClose}>Cancel</Button>
            <Button isLoading={actionLoading} onClick={handleDeleteConfirm} className="bg-rose-600 text-white font-bold rounded-xl">Confirm Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}