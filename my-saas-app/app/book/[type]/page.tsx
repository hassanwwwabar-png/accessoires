import { Calendar, Clock, MapPin, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

// استقبال البارامتر من الرابط (hospital, clinic, etc.)
export default async function BookingFormPage({ params }: { params: { type: string } }) {
  // انتظار قراءة البارامتر (Next.js 15)
  const { type } = await params;
  
  // تحويل "hospital" إلى "Hospital" (Capitalize)
  const categoryName = type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex justify-center items-start">
      
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 max-w-5xl w-full flex flex-col lg:flex-row overflow-hidden">
        
        {/* --- Left Side: Booking Info (مثل Calendly) --- */}
        <div className="w-full lg:w-1/3 bg-slate-50 p-8 border-r border-slate-200">
          <Link href="/book" className="flex items-center text-slate-500 text-sm hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>

          <h4 className="text-slate-500 font-medium mb-2">MyClinic Sales Team</h4>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{categoryName} Consultation</h2>
          
          <div className="space-y-4 text-slate-600">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-0.5 text-slate-400" />
              <div>
                <span className="font-bold block text-slate-900">45 min</span>
                <span className="text-sm">Web conferencing details provided upon confirmation.</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-slate-900 font-medium">04:00 - 04:45, Wed, Dec 31</span>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <span>Morocco Time</span>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-500 leading-relaxed">
            Book a call after picking a convenient time. Do provide relevant information that will allow us to review your business requirements prior to the call.
          </p>
        </div>

        {/* --- Right Side: The Form (استمارتك) --- */}
        <div className="w-full lg:w-2/3 p-8 lg:p-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Enter Details</h2>
          
          <form className="space-y-6">
            
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Name *</label>
                <input required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Email *</label>
                <input required type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Guests & Phone */}
            <div className="space-y-1">
              <button type="button" className="text-blue-600 text-sm font-medium hover:underline border border-blue-600 px-3 py-1 rounded-full mb-2">
                + Add Guests
              </button>
              <label className="block text-sm font-bold text-slate-700">Phone Number *</label>
              <input required type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Dynamic Entity Name (يتغير حسب الرابط) */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">{categoryName} Name *</label>
              <input required type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">{categoryName} Address *</label>
              <textarea required rows={2} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>

            {/* Role Radio Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Your Role *</label>
              <div className="space-y-2">
                {['Owner/Director/Partner', 'Manager/Admin', 'Healthcare Provider', 'Marketing/Sales'].map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="role" value={role} className="w-4 h-4 text-blue-600" required />
                    <span className="text-sm text-slate-700">{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Website & Doctors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Website/Online Profile *</label>
                <input required type="url" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Number of Doctors/Providers</label>
                <input type="number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Features Checkboxes */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Features you are interested in *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  'Website/SEO', 'Reputation Management/Reviews', 
                  'Advertisements, Digital Marketing', 'Telehealth (Video Calls)', 
                  'Patient Records', 'Treatment Notes', 
                  'Patient Portal', 'Mobile Apps', 
                  'Appointment Management', 'Patient Messaging'
                ].map((feature) => (
                  <label key={feature} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded">
                    <input type="checkbox" name="features" value={feature} className="w-4 h-4 rounded text-blue-600" />
                    <span className="text-sm text-slate-600">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Requirements Textarea */}
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Tell us about your requirements *</label>
              <textarea required rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full text-lg transition-all">
                Schedule Event
              </button>
              <p className="text-xs text-slate-400 text-center mt-4">
                By proceeding, you agree to our Terms of Use and Privacy Notice.
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}