'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, useDisclosure } from '@heroui/react';
import { Edit3, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import EditRoomModal from './EditRoomModal';

export default function DetailManagementRow({ room }) {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${room.roomName}"?`)) return;

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('access-token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const res = await fetch(`${baseUrl}/rooms/${room._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        toast.success('Room deleted successfully');
        router.push('/my-listings'); // Redirect back to workspace safely
        router.refresh();
      } else {
        toast.error('Failed to perform safe resource removal.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network execution failure.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 w-full pt-2">
        <Button
          fullWidth
          onPress={onOpen}
          className="bg-stone-100 text-stone-800 font-bold rounded-xl h-12 hover:bg-stone-200 transition-colors"
          startContent={<Edit3 className="w-4 h-4" />}
        >
          Edit Room Settings
        </Button>
        <Button
          fullWidth
          color="danger"
          variant="flat"
          isLoading={isDeleting}
          onPress={handleDelete}
          className="bg-red-50 text-red-600 font-bold rounded-xl h-12 hover:bg-red-100/80 transition-colors"
          startContent={<Trash2 className="w-4 h-4" />}
        >
          Delete Sanctuary Space
        </Button>
      </div>

      <EditRoomModal room={room} isOpen={isOpen} onOpenChange={onOpenChange} />
    </>
  );
}