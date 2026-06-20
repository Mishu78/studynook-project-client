 import { Search, CalendarCheck, BookOpen } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-6 h-6 text-[#063725]" />,
      title: "1. Discover Spaces",
      desc: "Filter through premium, distraction-free study rooms tailored to your exact capacity and layout needs.",
    },
    {
      icon: <CalendarCheck className="w-6 h-6 text-[#063725]" />,
      title: "2. Instant Reserve",
      desc: "Select your preferred hour slot and securely book your space instantly with zero complex approval loops.",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#063725]" />,
      title: "3. Unlock Productivity",
      desc: "Show up, check into your quiet sanctuary, and crush your academic study milestones without interruptions.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-600">Simplified Workflow</p>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
            Three Steps to Your Sanctuary
          </h3>
          <p className="text-stone-500 font-medium text-sm sm:text-base">
            We've eliminated the friction of finding real estate inside crowded campus libraries.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Subtle connecting line layout for desktop */}
          <div className="hidden md:block absolute top-1/4 left-[15%] right-[15%] h-px bg-stone-100 -z-10" />

          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="group bg-[#FAF8F5] border border-stone-200/60 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:bg-white"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200/50 flex items-center justify-center shadow-sm group-hover:bg-[#063725]/10 group-hover:border-transparent transition-colors mb-6">
                {step.icon}
              </div>
              <h4 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-[#063725] transition-colors">
                {step.title}
              </h4>
              <p className="text-sm font-medium text-stone-500 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;