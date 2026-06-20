"use client";

import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Menu, 
  X, 
  LogOut, 
} from "lucide-react";
import Link from "next/link";
import { Button, Avatar } from "@heroui/react";

import { signOut, useSession } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const [mounted, setMounted] = useState(false);

  // Set mounted true on client entry to completely sync up SSR steps
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Handle sticky navbar background transitions
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const handleLogOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? "bg-[#FAF8F5]/90 backdrop-blur-md shadow-sm py-2" : "bg-[#FAF8F5] py-4"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-blue-600 rounded-xl transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-stone-900">
                StudyNook
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="font-semibold text-stone-700 hover:text-[#063725] transition-colors">Home</Link>
            <Link href="/rooms" className="font-semibold text-stone-700 hover:text-[#063725] transition-colors">Rooms</Link>
            
            {/* ✅ Hydration Guard added for desktop custom routing paths */}
            {mounted && !isPending && session && (
              <>
                <Link href="/add-room" className="font-semibold text-stone-700 hover:text-[#063725] transition-colors">Add Room</Link>
                <Link href="/my-listings" className="font-semibold text-stone-700 hover:text-[#063725] transition-colors">My Listings</Link>
                <Link href="/my-bookings" className="font-semibold text-stone-700 hover:text-[#063725] transition-colors">My Bookings</Link>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-6">
            {/* ✅ Neutral placeholder skeleton wrapper while loading or unmounted */}
            {!mounted || isPending ? (
              <div className="w-24 h-9 bg-stone-200/60 animate-pulse rounded-xl" />
            ) : !session ? (
              /* Public View */
              <>
                <Link href="/login" className="font-semibold text-stone-700 hover:text-[#063725] transition-colors">
                  Login
                </Link>
                <Link href="/register">
                  <Button className="font-bold rounded-xl px-5 bg-[#063725] text-white shadow-md">
                    Join Free
                  </Button>
                </Link>
              </>
            ) : (
              /* Private Route View */
              <div className="relative flex items-center gap-4">
                
                {/* Decorative Moon icon */}
                <button className="p-2 text-stone-700 hover:text-stone-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                </button>

                {/* Click Outside Invisible Overlay Panel */}
                {isProfileOpen && (
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)} />
                )}

                {/* Dropdown Toggle Target */}
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2.5 focus:outline-none relative z-50 group select-none"
                >
                  <Avatar
                    size="sm"
                    src={session?.user?.image || "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=400"}
                    className="w-8 h-8 ring-2 ring-[#063725]/10"
                  />
                  <span className="text-sm font-bold text-stone-800 group-hover:text-stone-900 transition-colors">
                    {session?.user?.name || "Guest"}
                  </span>
                </button>

                {/* Dropdown Options Drawer Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl border border-stone-200/70 shadow-xl py-1.5 z-50 text-left animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="px-4 py-2.5">
                      <p className="text-sm font-bold text-stone-800 truncate">
                        {session?.user?.name || "Guest Scholar"}
                      </p>
                      <p className="text-xs font-medium text-stone-400 truncate mt-0.5">
                        {session?.user?.email || "guest.google@studynook.demo"}
                      </p>
                    </div>

                    <div className="border-t border-stone-100 my-1" />

                    <Link 
                      href="/my-listings" 
                      className="block px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      My Listings
                    </Link>
                    <Link 
                      href="/my-bookings" 
                      className="block px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                      My Bookings
                    </Link>

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={handleLogOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50/50 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg hover:bg-stone-100 transition-colors text-stone-800">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 space-y-2 bg-white border-b border-stone-200 animate-in slide-in-from-top duration-300">
          <Link href="/" className="block px-4 py-3 text-base font-semibold text-stone-900 hover:bg-stone-50 rounded-xl">Home</Link>
          <Link href="/rooms" className="block px-4 py-3 text-base font-semibold text-stone-900 hover:bg-stone-50 rounded-xl">Rooms</Link>
          
          {/* ✅ Hydration Guarded mobile link elements */}
          {mounted && !isPending && session && (
            <>
              <Link href="/add-room" className="block px-4 py-3 text-base font-semibold text-stone-900 hover:bg-stone-50 rounded-xl">Add Room</Link>
              <Link href="/my-listings" className="block px-4 py-3 text-base font-semibold text-stone-900 hover:bg-stone-50 rounded-xl">My Listings</Link>
              <Link href="/my-bookings" className="block px-4 py-3 text-base font-semibold text-stone-900 hover:bg-stone-50 rounded-xl">My Bookings</Link>
            </>
          )}

          <div className="pt-4 border-t border-stone-100 mt-4">
            {/* ✅ Added layout matching guard inside structural drawer block splits */}
            {!mounted || isPending ? (
              <div className="w-full h-11 bg-stone-100 animate-pulse rounded-xl" />
            ) : !session ? (
              <div className="grid grid-cols-2 gap-4">
                <Link href="/login" className="w-full">
                  <Button variant="bordered" className="rounded-xl w-full font-semibold border-stone-200">Login</Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="rounded-xl w-full font-bold bg-[#063725] text-white">Join Free</Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="px-4 py-2 flex items-center gap-3 bg-stone-50 rounded-xl mb-2">
                  <Avatar size="sm" src={session?.user?.image || ""} />
                  <div className="truncate">
                    <p className="text-sm font-bold text-stone-800 truncate">{session?.user?.name}</p>
                    <p className="text-xs text-stone-500 truncate">{session?.user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogOut}
                  className="w-full text-left px-4 py-3 text-base font-semibold text-red-500 hover:bg-red-50 rounded-xl flex items-center gap-3"
                >
                  <LogOut className="w-5 h-5" /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}