"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, authClient } from "@/lib/auth-client";
import { Chip, Button } from "@heroui/react";
import toast from "react-hot-toast";

export default function MyBookings() {
  const { data: session, isPending } = useSession();
  const [bookings, setBookings] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [targetCancel, setTargetCancel] = useState(null);

  const fetchUserBookings = async () => {
    if (!session?.user?.id) return;
    try {
      const { data: jwtData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/user/${session.user.id}`, {
        headers: { Authorization: `Bearer ${jwtData?.token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setBookings(data);
    } catch (err) {
      console.error("Ledger parse error:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!isPending && session) {
      fetchUserBookings();
    }
  }, [session, isPending]);

  const handleCancelReservation = async () => {
    if (!targetCancel) return;
    try {
      const { data: jwtData } = await authClient.token();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${targetCancel}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${jwtData?.token}` }
      });

      if (res.ok) {
        toast.success("Booking cancelled");
        setTargetCancel(null);
        fetchUserBookings(); // Refresh UI layout lists
      } else {
        toast.error("Failed to cancel booking resource slot.");
      }
    } catch (err) {
      toast.error("Error executing cancellation payload request pipelines.");
    }
  };

  // Condition to check if booking date is in the future or today
  const canCancel = (bookingDateStr, status) => {
    if (status !== "confirmed") return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const bDate = new Date(bookingDateStr);
    return bDate >= today;
  };

  if (isPending || fetching) {
    return <div className="min-h-screen bg-[#FAF9F5] p-12 text-center font-bold text-stone-500">Loading booking index entries...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12 px-4 sm:px-6 lg:px-8 text-stone-800">
      <div className="max-w-7xl mx-auto space-y-2 mb-8">
        <h1 className="text-4xl font-black tracking-tight text-stone-900">My Bookings</h1>
        <p className="text-stone-500 font-medium text-sm">Manage your upcoming and past room reservations.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-sm">
          <p className="font-semibold text-stone-500">You have no bookings yet.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-[#FAF8F5] border border-stone-200/80 rounded-[1.5rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200/60 text-[11px] uppercase tracking-wider text-stone-400 font-black bg-stone-50/50">
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Cost</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="text-sm font-semibold text-stone-700 hover:bg-stone-50/40 transition-colors">
                    <td className="px-6 py-5 flex items-center gap-3">
                      <div className="relative w-12 h-8 rounded-lg overflow-hidden border border-stone-200/60 bg-stone-100 shrink-0">
                        <Image 
                          src={booking.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=200"} 
                          alt="room icon" 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-stone-900 truncate max-w-[180px]">{booking.roomName}</span>
                    </td>
                    <td className="px-6 py-5 text-stone-600">
                      {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-5 text-stone-500 font-medium">
                      {booking.startTime} – {booking.endTime}
                    </td>
                    <td className="px-6 py-5 font-extrabold text-stone-900">${booking.totalCost}</td>
                    <td className="px-6 py-5">
                      <Chip 
                        size="sm" 
                        variant="flat"
                        className={booking.status === "confirmed" ? "bg-emerald-50 text-emerald-700 rounded-lg" : "bg-red-50 text-red-600 rounded-lg"}
                      >
                        {booking.status}
                      </Chip>
                    </td>
                    <td className="px-6 py-5 text-right">
                      {canCancel(booking.date, booking.status) ? (
                        <Button 
                          size="sm" 
                          color="danger" 
                          variant="light"
                          className="font-bold rounded-xl"
                          onClick={() => setTargetCancel(booking._id)}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <span className="text-stone-300 font-bold px-3">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation Cancellation Dialog Backdrop Overlay box */}
      {targetCancel && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 border border-stone-200 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-black text-stone-900">Confirm Cancellation</h3>
            <p className="text-sm text-stone-500 mt-2 leading-relaxed">
              Are you sure you want to cancel this reservation slot? This action updates your transaction profile and cannot be undone.
            </p>
            <div className="flex gap-2 justify-end mt-6">
              <Button 
                variant="light" 
                className="font-bold rounded-xl text-stone-600"
                onClick={() => setTargetCancel(null)}
              >
                Keep Booking
              </Button>
              <Button 
                color="danger" 
                className="font-bold rounded-xl bg-red-500 text-white shadow-sm"
                onClick={handleCancelReservation}
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 