import RoomCard from "@/components/RoomCard";



import FilterSidebar from "@/components/FilterSidebar";



import { BookOpen } from "lucide-react";







// Server data fetching matching your core fetch guidelines cleanly



async function fetchFilteredRooms(searchParamsObj) {



  try {



    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";



   



    // Construct request parameters smoothly from Next.js server search params object



    const queryParams = new URLSearchParams();



    if (searchParamsObj?.search) queryParams.append("search", searchParamsObj.search);



    if (searchParamsObj?.amenities) queryParams.append("amenities", searchParamsObj.amenities);



    if (searchParamsObj?.minPrice) queryParams.append("minPrice", searchParamsObj.minPrice);



    if (searchParamsObj?.maxPrice) queryParams.append("maxPrice", searchParamsObj.maxPrice);







    const res = await fetch(`${baseUrl}/rooms?${queryParams.toString()}`, {



      cache: "no-store",



    });



   



    if (!res.ok) return [];



    return await res.json() || [];



  } catch (error) {



    console.error("Failed to fetch custom filtered catalog rooms:", error);



    return [];



  }



}







export default async function RoomsPage({ searchParams }) {



  const sParams = await searchParams;



  const rooms = await fetchFilteredRooms(sParams);







  return (



    <div className="min-h-screen bg-[#FAF8F5]">



      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">



       



        {/* Header Section */}



        <div className="flex justify-between items-center mb-10 border-b border-stone-200/60 pb-6">



          <h2 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">



            <div className="p-2 bg-[#063725] rounded-xl text-white">



              <BookOpen className="w-5 h-5" />



            </div>



            All Study Rooms



          </h2>



          <span className="text-sm font-semibold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-xl">



            Showing {rooms?.length || 0} rooms



          </span>



        </div>







        {/* Layout Grid Layout Setup (Sidebar + Rooms Container grid) */}



        <div className="flex flex-col lg:flex-row gap-8 items-start">



         



          {/* Left Layout Column: Filter Navigation Menu */}



          <FilterSidebar />







          {/* Right Layout Column: Reactive Catalog Grid Results */}



          <div className="flex-1 w-full">



            {(!rooms || rooms.length === 0) ? (



              <div className="max-w-md mx-auto text-center py-20 bg-white border border-stone-200/80 rounded-[2rem] shadow-xs px-6">



                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600">



                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">



                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />



                  </svg>



                </div>



                <h3 className="text-xl font-bold text-stone-800">No rooms found</h3>



                <p className="text-sm font-medium text-stone-500 mt-2">



                  We couldn't find any premium study sanctuaries matching your current filter set.



                </p>



              </div>



            ) : (



              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">



                {rooms.map((room) => (



                  <RoomCard key={room._id} room={room} />



                ))}



              </div>



            )}



          </div>







        </div>



      </main>



    </div>



  );



}