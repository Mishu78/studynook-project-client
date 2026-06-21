'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter, useParams } from 'next/navigation';

// ✅ Import from the unified library entrypoint
import { Button, Input, TextArea, Modal } from '@heroui/react';

import { Users, Calendar, Edit3, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';

// ✅ Safe implementation mapping for TextArea
const Textarea = TextArea;

// ✅ Pull useDisclosure safely directly from the core Modal component context
const useDisclosure = Modal.useDisclosure || (() => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, onOpen: () => setIsOpen(true), onClose: () => setIsOpen(false) };
});

// ✅ Create local definitions extracting HeroUI v3's compound property nodes
const ModalContent = Modal.Container || (({ children, ...props }) => <div {...props}>{children}</div>);
const ModalHeader = Modal.Header || (({ children, ...props }) => <div {...props}>{children}</div>);
const ModalBody = Modal.Body || (({ children, ...props }) => <div {...props}>{children}</div>);
const ModalFooter = Modal.Footer || (({ children, ...props }) => <div {...props}>{children}</div>);


export default function RoomDetailsPage() {



  const { id } = useParams();



  const router = useRouter();


const { data: session} = useSession(); 
  const currentUser = session?.user;

  const [room, setRoom] = useState(null);



  const [loading, setLoading] = useState(true);


  const [actionLoading, setActionLoading] = useState(false);



  const [selectedAmenities, setSelectedAmenities] = useState([]);


  const { isOpen: isBookOpen, onOpen: onBookOpen, onClose: onBookClose } = useDisclosure();



  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();



  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();



  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';



  const AMENITY_OPTIONS = ["Whiteboard", "Projector", "Wi-Fi", "Power Outlets", "Quiet Zone", "Air Conditioning"];







  useEffect(() => {



    const token = localStorage.getItem('access-token');



    if (token) {



      try {



        const payload = JSON.parse(atob(token.split('.')[1]));



        setCurrentUser(payload);



      } catch (e) { console.error(e); }



    }



    fetchRoomDetails();



  }, [id]);







  const fetchRoomDetails = async () => {



    try {



      const res = await fetch(`${baseUrl}/rooms/${id}`);



      if (res.ok) {



        const data = await res.json();



        setRoom(data);



        setSelectedAmenities(data.amenities || []);



      }



    } catch (err) {



      toast.error("Failed to recover room metadata.");



    } finally {



      setLoading(false);



    }



  };







  const handleBookingSubmit = async (e) => {



    e.preventDefault();



    setActionLoading(true);



    const token = localStorage.getItem('access-token');







    try {



      const res = await fetch(`${baseUrl}/bookings`, {



        method: 'POST',



        headers: {



          'Content-Type': 'application/json',



          'Authorization': `Bearer ${token}`



        },



        body: JSON.stringify({ roomId: id, date: e.target.bookingDate.value })



      });







      if (res.ok) {



        toast.success("Room booked successfully!");



        onBookClose();



        fetchRoomDetails();



      } else {



        toast.error("Failed to secure booking.");



      }



    } catch (err) {



      toast.error("Execution error.");



    } finally {



      setActionLoading(false);



    }



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



      const res = await fetch(`${baseUrl}/rooms/${id}`, {



        method: 'PUT',



        headers: {



          'Content-Type': 'application/json',



          'Authorization': `Bearer ${token}`



        },



        body: JSON.stringify(updatedPayload)



      });







      if (res.ok) {



        toast.success("Room updated successfully");



        onEditClose();



        fetchRoomDetails();



      }



    } catch (err) {



      toast.error("Network runtime failure.");



    } finally {



      setActionLoading(false);



    }



  };







  const handleDeleteConfirm = async () => {



    setActionLoading(true);



    const token = localStorage.getItem('access-token');







    try {



      const res = await fetch(`${baseUrl}/rooms/${id}`, {



        method: 'DELETE',



        headers: { 'Authorization': `Bearer ${token}` }



      });







      if (res.ok) {



        toast.success("Room deleted successfully");



        onDeleteClose();



        router.push('/rooms');



      }



    } catch (err) {



      toast.error("Network layer crash.");



    } finally {



      setActionLoading(false);



    }



  };







  if (loading) return <div className="text-center py-20">Syncing Study Sanctuary Content...</div>;



  if (!room) return null;







  const isOwner = currentUser?.email === room.createdBy;







  return (



    <div className="min-h-screen bg-[#FAF8F5] p-6 md:p-12">



      <div className="max-w-5xl mx-auto space-y-6">



        <button onClick={() => router.back()} className="flex items-center gap-2 text-stone-600 hover:text-emerald-800 text-sm font-bold">



          <ArrowLeft className="w-4 h-4" /> Back to Spaces



        </button>







        <div className="bg-white border border-stone-200 rounded-[2rem] shadow-xl overflow-hidden flex flex-col md:flex-row">



          <div className="w-full md:w-[45%] min-h-[300px] relative bg-stone-100">



            <img src={room.image} alt={room.roomName} className="w-full h-full object-cover absolute inset-0" />



          </div>







          <div className="flex-1 p-8 flex flex-col justify-between space-y-6">



            <div className="space-y-4">



              <div className="flex justify-between items-start">



                <div>



                  <h1 className="text-2xl font-black text-[#063725]">{room.roomName}</h1>



                  <p className="text-xs text-stone-400 mt-1 uppercase font-bold">By: {room.createdBy}</p>



                </div>



                <div className="text-right">



                  <span className="text-2xl font-black text-[#063725]">${room.hourlyRate}</span>



                  <p className="text-[10px] text-stone-500 font-bold">per hour</p>



                </div>



              </div>







              <div className="flex items-center gap-4 text-xs bg-stone-50 p-3 rounded-xl border border-stone-100 w-fit">



                <div className="flex items-center gap-1 font-bold text-stone-700"><Users className="w-4 h-4 text-emerald-700" /> Max Cap: {room.capacity}</div>



                <div className="flex items-center gap-1 font-bold text-stone-700"><Calendar className="w-4 h-4 text-emerald-700" /> Bookings Run: {room.bookingCount || 0}</div>



              </div>







              <p className="text-stone-600 text-sm leading-relaxed">{room.description}</p>







              <div className="grid grid-cols-2 gap-2 pt-2">



                {room.amenities?.map((amenity) => (



                  <div key={amenity} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs font-semibold text-emerald-900">



                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> {amenity}



                  </div>



                ))}



              </div>



            </div>







            <div className="flex gap-3 pt-4 border-t border-stone-100">



              {isOwner ? (



                <>



                  <Button onClick={onEditOpen} className="flex-1 font-bold rounded-xl bg-amber-50 text-amber-900 border border-amber-200" startContent={<Edit3 className="w-4 h-4" />}>Edit Listing</Button>



                  <Button onClick={onDeleteOpen} className="flex-1 font-bold rounded-xl bg-rose-50 text-rose-700 border border-rose-200" startContent={<Trash2 className="w-4 h-4" />}>Remove Space</Button>



                </>



              ) : (



                <Button onClick={() => currentUser ? onBookOpen() : router.push('/login')} className="w-full font-black rounded-xl bg-[#063725] text-white h-12 shadow-lg">



                  {currentUser ? "Book Sanctuary Room" : "Login to Book"}



                </Button>



              )}



            </div>



          </div>



        </div>



      </div>







      {/* BOOKING MODAL */}



      <Modal isOpen={isBookOpen} onClose={onBookClose}>



        <ModalContent className="rounded-[2rem] p-4">



          <form onSubmit={handleBookingSubmit}>



            <ModalHeader className="text-xl font-black text-[#063725]">Schedule Rent Period</ModalHeader>



            <ModalBody>



              <Input type="date" name="bookingDate" required variant="bordered" classNames={{ inputWrapper: "h-12 rounded-xl" }} />



            </ModalBody>



            <ModalFooter>



              <Button variant="light" onClick={onBookClose}>Cancel</Button>



              <Button type="submit" isLoading={actionLoading} className="bg-[#063725] text-white font-bold rounded-xl">Confirm Booking</Button>



            </ModalFooter>



          </form>



        </ModalContent>



      </Modal>







      {/* UPDATE ROOM MODAL */}



      <Modal isOpen={isEditOpen} onClose={onEditClose} size="2xl">



        <ModalContent className="rounded-[2rem] p-4">



          <form onSubmit={handleUpdateSubmit}>



            <ModalHeader className="text-xl font-black text-[#063725]">Modify Room parameters</ModalHeader>



            <ModalBody className="space-y-4">



              <Input label="Room Name" name="roomName" defaultValue={room.roomName} required variant="bordered" />



              <Textarea label="Description" name="description" defaultValue={room.description} required variant="bordered" />



              <div className="grid grid-cols-3 gap-3">



                <Input label="Floor" name="floor" defaultValue={room.floor} required variant="bordered" />



                <Input label="Capacity" name="capacity" type="number" defaultValue={room.capacity} required variant="bordered" />



                <Input label="Rate ($)" name="hourlyRate" type="number" step="0.01" defaultValue={room.hourlyRate} required variant="bordered" />



              </div>



              <Input label="Image URL" name="image" defaultValue={room.image} type="url" required variant="bordered" />



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



            </ModalBody>



            <ModalFooter>



              <Button variant="light" onClick={onEditClose}>Close</Button>



              <Button type="submit" isLoading={actionLoading} className="bg-[#063725] text-white font-bold rounded-xl">Save Changes</Button>



            </ModalFooter>



          </form>



        </ModalContent>



      </Modal>







      {/* DELETE CONFIRMATION MODAL */}



      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>



        <ModalContent className="rounded-[2rem] p-4">



          <ModalHeader className="text-xl font-black text-rose-700">Confirm Room Elimination</ModalHeader>



          <ModalBody>



            <p className="text-stone-600 text-sm">Are you certain you want to erase <strong>{room.roomName}</strong> from database?</p>



          </ModalBody>



          <ModalFooter>



            <Button variant="light" onClick={onDeleteClose}>Abort</Button>



            <Button isLoading={actionLoading} onClick={handleDeleteConfirm} className="bg-rose-600 text-white font-bold rounded-xl">Confirm Delete</Button>



          </ModalFooter>



        </ModalContent>



      </Modal>



    </div>



  );



} 