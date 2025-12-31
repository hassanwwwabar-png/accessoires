import { getSystemSettings, updateSystemSettings } from "@/app/actions";
import { 
  Settings, Save, Landmark, DollarSign, AlertCircle 
} from "lucide-react";

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();

  // ✅✅ الحل: التحقق مما إذا كانت الإعدادات فارغة
  if (!settings) {
    return (
      <div className="p-10 text-center text-red-500 font-bold flex flex-col items-center">
        <AlertCircle className="w-10 h-10 mb-2" />
        <p>Failed to load system settings.</p>
        <p className="text-sm opacity-70">Please check your database connection.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
          <div className="p-2 bg-slate-200 rounded-xl text-slate-600">
            <Settings className="w-8 h-8" />
          </div>
          Platform Settings
        </h1>
        <p className="text-slate-500 font-bold mt-2 ml-14">
          Control subscription pricing and payment methods.
        </p>
      </div>

      <form action={updateSystemSettings} className="space-y-8">
        
        {/* 💰 1. Subscription Pricing */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
              <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                 <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-slate-800">Subscription Pricing</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                 <label className="text-xs font-black text-slate-400 uppercase ml-1">Monthly Price</label>
                 <input 
                   name="monthlyPrice" 
                   type="number" 
                   // ✅ الآن TypeScript سعيد لأننا تحققنا من settings في الأعلى
                   defaultValue={settings.monthlyPrice}
                   className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-colors"
                 />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-400 uppercase ml-1">Currency Symbol</label>
                 <input 
                   name="currency" 
                   type="text" 
                   defaultValue={settings.currency}
                   className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none focus:border-blue-500 transition-colors"
                 />
              </div>
           </div>
        </div>

        {/* 🏦 2. Bank Details (How to Pay) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <Landmark className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-slate-800">Payment Instructions (Bank Details)</h3>
           </div>

           <div className="space-y-6">
              <div>
                 <label className="text-xs font-black text-slate-400 uppercase ml-1">Bank Name</label>
                 <input 
                   name="bankName" 
                   type="text" 
                   defaultValue={settings.bankName}
                   className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                 />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-400 uppercase ml-1">Account Number (RIB)</label>
                 <input 
                   name="rib" 
                   type="text" 
                   defaultValue={settings.rib}
                   className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors tracking-wider"
                 />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-400 uppercase ml-1">Beneficiary Name (Account Owner)</label>
                 <input 
                   name="accountName" 
                   type="text" 
                   defaultValue={settings.accountName}
                   className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-blue-500 transition-colors"
                 />
              </div>
           </div>
        </div>
{/* ... قسم البنك السابق ... */}

        {/* 🚀 3. Alternative Payment Method (New) */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
           <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                 <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="font-black text-lg text-slate-800">Alternative Method (e.g. Cash Plus / Wafacash)</h3>
           </div>
           
           <p className="text-sm text-slate-400 font-bold mb-4">Leave empty if you don't want to use this.</p>

           <div className="space-y-6">
              <div>
                 <label className="text-xs font-black text-slate-400 uppercase ml-1">Service Name</label>
                 <input 
                   name="extraMethodName" 
                   type="text" 
                   placeholder="e.g. Cash Plus"
                   defaultValue={settings.extraMethodName}
                   className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-orange-500 transition-colors"
                 />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-400 uppercase ml-1">Account / Phone Number</label>
                 <input 
                   name="extraMethodNumber" 
                   type="text" 
                   placeholder="e.g. 06 00 00 00 00"
                   defaultValue={settings.extraMethodNumber}
                   className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-700 outline-none focus:border-orange-500 transition-colors tracking-wider"
                 />
              </div>
              <div>
                 <label className="text-xs font-black text-slate-400 uppercase ml-1">Receiver Name</label>
                 <input 
                   name="extraMethodOwner" 
                   type="text" 
                   defaultValue={settings.extraMethodOwner}
                   className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:border-orange-500 transition-colors"
                 />
              </div>
           </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
           <button className="flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-black shadow-lg hover:bg-slate-800 transition-transform active:scale-95">
              <Save className="w-5 h-5" /> Save Changes
           </button>
        </div>

      </form>
    </div>
  );
}