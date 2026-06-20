import { ShieldCheck, Award, Star, ThumbsUp } from "lucide-react";

const WhyChooseUs = () => {
  const stats = [
    { value: "4.9★", label: "Average Room Rating" },
    { value: "18k+", label: "Productive Hours Logged" },
    { value: "99.4%", label: "Satisfaction Rate" },
  ];

  const highlights = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50",
      title: "Verified Quiet Zones",
      desc: "Every single listed sanctuary goes through rigorous sound and structural standard evaluations.",
    },
    {
      icon: <Award className="w-5 h-5 text-amber-600" />,
      bg: "bg-amber-50",
      title: "Host Merit Rewards",
      desc: "Earn passive income by sharing your idle workspace with peer student circles securely.",
    },
  ];

  return (
    <section className="py-20 bg-[#FAF8F5] border-t border-stone-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Description Area */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#063725]">Premium Standards</p>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                Why Students Trust StudyNook
              </h3>
              <p className="text-stone-500 font-medium leading-relaxed">
                We bridge the gap between noisy public campus benches and hyper-optimized, private work hubs so you can achieve peak academic execution.
              </p>
            </div>

            {/* Feature Blocks Stack */}
            <div className="space-y-4 pt-2">
              {highlights.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white border border-stone-200/50 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-800 text-sm sm:text-base">{item.title}</h4>
                    <p className="text-xs sm:text-sm font-medium text-stone-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Metrics Grid Container */}
          <div className="lg:col-span-6 lg:col-start-7 bg-white border border-stone-200/80 rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-stone-200/40 relative overflow-hidden">
            {/* Top Abstract Graphic Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-bl-full -z-0" />

            <div className="flex items-center gap-2 text-amber-500 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
              <span className="text-stone-400 font-bold text-xs ml-2 uppercase tracking-wider">Top Rated Platform</span>
            </div>

            <h4 className="text-2xl font-black text-stone-900 tracking-tight mb-8">
              Empowering better study habits, one session at a time.
            </h4>

            {/* Data Stats Divider Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-100">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center sm:text-left">
                  <p className="text-2xl sm:text-3xl font-black text-[#063725] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs font-bold text-stone-400 mt-1 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;