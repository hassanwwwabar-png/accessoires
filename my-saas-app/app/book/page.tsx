import Link from "next/link";
import { Building2, Home, Stethoscope, Users, Rocket, Phone, ArrowRight } from "lucide-react";

const options = [
  {
    title: "Homecare Service",
    slug: "homecare", // <---
    description: "Book a call to discuss how we can streamline your home visits and remote patient monitoring.",
    icon: Home,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    title: "Hospital / Medical Center",
    slug: "hospital", // <--- وهذا
    description: "Enterprise solutions for managing multiple departments, large staff, and complex billing.",
    icon: Building2,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Clinic / Private Practice",
    slug: "clinic", // <--- و
    description: "Perfect for doctors running their own clinic. Manage appointments and patients easily.",
    icon: Stethoscope,
    color: "bg-indigo-100 text-indigo-600",
  },
  {
    title: "Healthcare Provider",
    description: "Individual practitioners looking for a digital way to manage records and payments.",
    icon: Users,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Healthcare Startup",
    description: "Building something new? Let's discuss API integrations and custom solutions.",
    icon: Rocket,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "General Inquiry",
    description: "Not sure where you fit? Let's have a quick introductory call to find out.",
    icon: Phone,
    color: "bg-slate-100 text-slate-600",
  },
];

export default function BookDemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Book a Consultation
        </h1>
        <p className="text-lg text-slate-500">
          Select the category that best describes your business so we can prepare the right solution for you.
        </p>
      </div>

      {/* Grid of Options */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {options.map((option, index) => (
          <Link 
            key={index}
            href="#" // هنا من بعد ممكن نربطوه بـ Calendly
            className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-14 h-14 rounded-xl ${option.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <option.icon className="w-7 h-7" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
              {option.title}
            </h3>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {option.description}
            </p>

            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
              Schedule Call <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-12 text-slate-400 text-sm">
        <p>Note: Please provide relevant information prior to the call.</p>
      </div>

    </div>
  );
}
