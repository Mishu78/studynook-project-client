"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function BookingModal({ room, session, onClose, onBookingSuccess }) {
  const todayStr = new Date().toISOString().split("T")[0];
  
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [specialNote, setSpecialNote] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [loading, setLoading] = useState(false);

  // Generate hourly time slots: 08:00 to 20:00
  const hourlySlots = [];
  for (let i = 8; i <= 20; i++) {
    const hr = i < 10 ? `0${i}:00` : `${i}:00`;
    hourlySlots.push(hr);
  }

  // Calculate costs reactively
  useEffect(() => {
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);
    
    if (endHour > startHour) {
      const calculated = (endHour - startHour) * (room?.hourlyRate || 0);
      setTotalCost(calculated);
    } else {
      setTotalCost(0);
    }
  }, [startTime, endTime, room?.hourlyRate]);

  const handleConfirmBooking = async () => {
    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);

    if (endHour <= startHour) {
      toast.error("End time must be after start time slot.");
      return;
    }

    setLoading(true);
    try {
      const { data: jwtData } = await authClient.token();
      const token = jwtData?.token;
      
      if (!token) {
        toast.error("Authentication expired. Please log in again.");
        setLoading(false);
        return;
      }

      const payload = {
        roomId: room._id,
        roomName: room.roomName,
        image: room.image,
        date,
        startTime,
        endTime,
        specialNote,
        hourlyRate: room.hourlyRate,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userName: session?.user?.name
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Conflict or server system fault.");
      }

      toast.success("Room booked successfully!");
      if (onBookingSuccess) onBookingSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to finalize reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-[#FAF8F5] max-w-md w-full rounded-[2rem] p-8 border border-stone-200/80 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        {/* Close Button Trigger */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-1 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <h2 className="text-2xl font-black text-stone-900 tracking-tight">Book {room?.roomName || "Study Pod"}</h2>
        <p className="text-xs text-stone-500 font-medium mt-1">Pick a date and time slot. Bookings run on the hour.</p>

        <div className="space-y-5 mt-6">
          {/* Date Picker Input */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Date</label>
            <div className="relative">
              <input 
                type="date" 
                min={todayStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-4 py-3 text-sm font-semibold text-stone-800 focus:outline-none focus:border-[#063725]"
              />
            </div>
          </div>

          {/* Time Selection Fields row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">Start</label>
              <select 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-3 py-3 text-sm font-semibold text-stone-800 focus:outline-none"
              >
                {hourlySlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">End</label>
              <select 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white border border-stone-200/80 rounded-xl px-3 py-3 text-sm font-semibold text-stone-800 focus:outline-none"
              >
                {hourlySlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Notes Option */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">Special note (optional)</label>
            <textarea 
              placeholder="Any setup needed?"
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              rows={3}
              className="w-full bg-white border border-stone-200/80 rounded-xl p-4 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#063725] resize-none"
            />
          </div>

          {/* Computed Financial Display Wrapper block */}
          <div className="bg-[#FAF8F5] border border-stone-200/60 rounded-xl px-4 py-3.5 flex justify-between items-center">
            <span className="text-sm font-bold text-stone-400">Total cost</span>
            <span className="text-xl font-black text-[#063725]">${totalCost}</span>
          </div>

          {/* Confirmation Call to Action controls */}
          <div className="flex gap-3 justify-end pt-2">
            <Button 
              variant="light" 
              onClick={onClose} 
              className="rounded-xl font-bold text-stone-600"
            >
              Cancel
            </Button>
            <Button 
              isLoading={loading}
              onClick={handleConfirmBooking}
              className="bg-[#063725] text-white font-bold rounded-xl px-6 shadow-md"
            >
              Confirm Booking
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}