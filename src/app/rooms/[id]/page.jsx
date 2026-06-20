'use client'

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Textarea, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { Users, Calendar, Edit3, Trash2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';


export default function RoomDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const { isOpen: isBookOpen, onOpen: onBookOpen, onClose: onBookClose } = useDisclosure()

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

