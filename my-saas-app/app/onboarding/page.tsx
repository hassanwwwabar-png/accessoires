"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { submitOnboarding, skipOnboarding } from "@/app/actions";
import { 
  Stethoscope, Calendar, FolderOpen, CreditCard, 
  Users, Target, ChevronRight, ChevronLeft, CheckCircle, Globe, Languages, Loader2 
} from "lucide-react";

const translations = {
  en: { welcome: "Welcome", selectLang: "Select Language", title: "Clinic Setup", step: "Step", of: "of", skip: "Skip", next: "Next", prev: "Prev", finish: "Finish", basicInfo: "Basic Info", specialty: "Specialty", specialtyPlace: "e.g. Dentist", phone: "Phone", city: "City", teamSize: "Team Size", solo: "Solo", smallTeam: "Small Team", largeTeam: "Large Center", workflow: "Workflow", apptSystem: "Appt System", booking: "Booking", walkin: "Walk-in", both: "Both", dailyPatients: "Daily Patients", less10: "< 10", more30: "> 30", storeFiles: "Store Files?", fileTypes: "Types", images: "Images", labs: "Labs", billing: "Billing", enableBilling: "Enable Billing?", methods: "Payment Methods", cash: "Cash", transfer: "Transfer", card: "Card", assistants: "Assistants", hasAssistants: "Have Assistants?", yes: "Yes", no: "No", count: "Count", permissions: "Permissions", view: "View", add: "Add", upload: "Upload", settings: "Settings", currency: "Currency", bigQuestion: "Last Question", problemLabel: "Biggest Problem?", problemPlace: "e.g. No-shows..." },
  fr: { welcome: "Bienvenue", selectLang: "Choisir la langue", title: "Configuration", step: "Étape", of: "sur", skip: "Passer", next: "Suivant", prev: "Précédent", finish: "Terminer", basicInfo: "Infos de Base", specialty: "Spécialité", specialtyPlace: "ex: Dentiste", phone: "Tél", city: "Ville", teamSize: "Taille Équipe", solo: "Solo", smallTeam: "Petite Équipe", largeTeam: "Grand Centre", workflow: "Flux", apptSystem: "Système RDV", booking: "RDV", walkin: "Sans RDV", both: "Les deux", dailyPatients: "Patients/jour", less10: "< 10", more30: "> 30", storeFiles: "Stocker Dossiers?", fileTypes: "Types", images: "Images", labs: "Analyses", billing: "Facturation", enableBilling: "Activer Facture?", methods: "Paiement", cash: "Espèces", transfer: "Virement", card: "Carte", assistants: "Assistants", hasAssistants: "Avez-vous assistants?", yes: "Oui", no: "Non", count: "Combien?", permissions: "Perms", view: "Voir", add: "Ajouter", upload: "Importer", settings: "Paramètres", currency: "Devise", bigQuestion: "Dernière question", problemLabel: "Plus grand problème?", problemPlace: "ex: RDV manqués..." },
  ar: { welcome: "مرحباً", selectLang: "اختر اللغة", title: "إعداد العيادة", step: "خطوة", of: "من", skip: "تخطي", next: "التالي", prev: "السابق", finish: "إنهاء", basicInfo: "المعلومات", specialty: "التخصص", specialtyPlace: "مثلاً: أسنان", phone: "الهاتف", city: "المدينة", teamSize: "الفريق", solo: "وحدي", smallTeam: "فريق صغير", largeTeam: "مركز كبير", workflow: "العمل", apptSystem: "المواعيد", booking: "حجز", walkin: "بدون موعد", both: "معاً", dailyPatients: "المرضى يومياً", less10: "أقل من 10", more30: "أكثر من 30", storeFiles: "تخزين الملفات؟", fileTypes: "النوع", images: "صور", labs: "تحاليل", billing: "الفوترة", enableBilling: "تفعيل الفواتير؟", methods: "الدفع", cash: "نقداً", transfer: "تحويل", card: "بطاقة", assistants: "مساعدين", hasAssistants: "هل يوجد مساعدين؟", yes: "نعم", no: "لا", count: "العدد", permissions: "الصلاحيات", view: "رؤية", add: "إضافة", upload: "رفع", settings: "الإعدادات", currency: "العملة", bigQuestion: "سؤال مهم", problemLabel: "أكبر مشكلة تواجهها؟", problemPlace: "مثلاً: غياب المرضى..." }
};

type LangType = 'en' | 'fr' | 'ar';

export default function OnboardingWizard() {
  const router = useRouter(); 
  const [step, setStep] = useState(0);
  const totalSteps = 4;
  const [lang, setLang] = useState<LangType>('fr');
  const [showAssistants, setShowAssistants] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const t = translations[lang];
  const isRTL = lang === 'ar';

  const selectLanguage = (selectedLang: LangType) => {
    setLang(selectedLang);
    setStep(1);
  };

  // ✅ 1. دالة المعالجة لإصلاح خطأ TypeScript والتوجيه
  async function handleFinalSubmit(formData: FormData) {
    setIsSubmitting(true);
    formData.append("language", lang);

    const result = await submitOnboarding(formData);

    if (result?.success) {
      router.push("/dashboard");
      router.refresh(); 
    } else {
      setIsSubmitting(false);
      alert("Error: " + (result?.error || "Unknown error"));
    }
  }

  async function handleSkip() {
    setIsSubmitting(true);
    await skipOnboarding();
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* STEP 0: Language Selection */}
      {step === 0 && (
        <div className="max-w-4xl w-full animate-in fade-in zoom-in duration-500">
           <div className="text-center mb-12 space-y-4">
             <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6">
               <Languages className="w-10 h-10 text-indigo-600" />
             </div>
             <h1 className="text-4xl font-black text-slate-900">{t.welcome}</h1>
             <p className="text-slate-500 text-lg font-medium">{t.selectLang}</p>
           </div>
           <div className="grid md:grid-cols-3 gap-6">
             <button type="button" onClick={() => selectLanguage('en')} className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border-2 border-transparent hover:border-indigo-600"><span className="text-4xl mb-4 block">🇺🇸</span><h3 className="text-2xl font-black text-slate-900">English</h3></button>
             <button type="button" onClick={() => selectLanguage('fr')} className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border-2 border-transparent hover:border-indigo-600"><span className="text-4xl mb-4 block">🇫🇷</span><h3 className="text-2xl font-black text-slate-900">Français</h3></button>
             <button type="button" onClick={() => selectLanguage('ar')} className="bg-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all border-2 border-transparent hover:border-indigo-600"><span className="text-4xl mb-4 block">🇲🇦</span><h3 className="text-2xl font-black text-slate-900">العربية</h3></button>
           </div>
        </div>
      )}

      {/* STEPS 1-4 */}
      {step > 0 && (
        <div className="max-w-3xl w-full bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden relative mt-10">
          <div className="absolute top-0 left-0 right-0 h-2 bg-slate-100">
            <div className="h-full bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${(step / totalSteps) * 100}%` }} />
          </div>

          {/* ✅ 2. تم إصلاح وسم الـ Form هنا واستخدام handleFinalSubmit */}
          <form action={handleFinalSubmit} className="p-8 md:p-12">
            
            <div className="mb-8 flex justify-between items-start">
               <div>
                 <h1 className="text-3xl font-black text-slate-900 mb-2">{t.title} 🏥</h1>
                 <p className="text-slate-500 font-bold">{t.step} {step} {t.of} {totalSteps}</p>
               </div>
               <button type="button" onClick={handleSkip} className="text-slate-400 text-sm font-bold hover:text-slate-600 underline">
                 {t.skip}
               </button>
            </div>

            {/* ✅ 3. تم استخدام className hidden بدلاً من الحذف الشرطي لحفظ البيانات */}

            {/* Step 1 */}
            <div className={step === 1 ? 'block animate-in fade-in slide-in-from-right-8' : 'hidden'}>
               <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-700 mb-6"><Stethoscope className="w-5 h-5"/> {t.basicInfo}</h3>
               <div className="grid md:grid-cols-2 gap-4">
                 <div><label className="block text-sm font-bold text-slate-700 mb-2">{t.specialty}</label><input name="specialty" placeholder={t.specialtyPlace} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold outline-none" /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-2">{t.phone}</label><input name="phoneNumber" placeholder="+212..." className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold outline-none" /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-2">{t.city}</label><input name="city" placeholder={t.city} className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold outline-none" /></div>
                 <div><label className="block text-sm font-bold text-slate-700 mb-2">{t.teamSize}</label><select name="teamSize" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold outline-none"><option value="Solo">{t.solo}</option><option value="Small">{t.smallTeam}</option><option value="Large">{t.largeTeam}</option></select></div>
               </div>
            </div>

            {/* Step 2 */}
            <div className={step === 2 ? 'block animate-in fade-in slide-in-from-right-8' : 'hidden'}>
               <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-700 mb-6"><Calendar className="w-5 h-5"/> {t.workflow}</h3>
               <div className="grid md:grid-cols-3 gap-4 mb-6">
                 <label className="border-2 border-slate-100 p-4 rounded-xl cursor-pointer hover:border-indigo-500 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50"><input type="radio" name="appointmentSystem" value="Booking" className="hidden" defaultChecked /><span className="font-bold text-center block text-sm">{t.booking}</span></label>
                 <label className="border-2 border-slate-100 p-4 rounded-xl cursor-pointer hover:border-indigo-500 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50"><input type="radio" name="appointmentSystem" value="Walk-in" className="hidden" /><span className="font-bold text-center block text-sm">{t.walkin}</span></label>
                 <label className="border-2 border-slate-100 p-4 rounded-xl cursor-pointer hover:border-indigo-500 has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50"><input type="radio" name="appointmentSystem" value="Both" className="hidden" /><span className="font-bold text-center block text-sm">{t.both}</span></label>
               </div>
               <div className="mb-6"><label className="block text-sm font-bold text-slate-700 mb-2">{t.dailyPatients}</label><select name="dailyPatients" className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 font-bold outline-none"><option value="<10">{t.less10}</option><option value="10-30">10 - 30</option><option value=">30">{t.more30}</option></select></div>
               <div className="p-4 bg-slate-50 rounded-2xl"><div className="flex items-center justify-between mb-4"><span className="font-bold flex items-center gap-2"><FolderOpen className="w-4 h-4"/> {t.storeFiles}</span><input type="checkbox" name="storeMedicalFiles" className="w-5 h-5 accent-indigo-600" /></div><div className="flex gap-4 text-sm text-slate-600"><label className="flex items-center gap-2 font-bold"><input type="checkbox" name="fileTypes" value="Images" /> {t.images}</label><label className="flex items-center gap-2 font-bold"><input type="checkbox" name="fileTypes" value="PDF" /> PDF</label><label className="flex items-center gap-2 font-bold"><input type="checkbox" name="fileTypes" value="Labs" /> {t.labs}</label></div></div>
            </div>

            {/* Step 3 */}
            <div className={step === 3 ? 'block animate-in fade-in slide-in-from-right-8' : 'hidden'}>
               <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-700 mb-6"><CreditCard className="w-5 h-5"/> {t.billing}</h3>
               <div className="p-6 border border-slate-200 rounded-2xl mb-6"><div className="flex items-center justify-between mb-4"><span className="font-bold text-slate-700">{t.enableBilling}</span><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" name="billingEnabled" className="sr-only peer" /><div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div></label></div><div className="grid grid-cols-3 gap-2 text-sm font-bold text-slate-600"><label className="flex items-center gap-1"><input type="checkbox" name="paymentMethods" value="Cash" /> {t.cash}</label><label className="flex items-center gap-1"><input type="checkbox" name="paymentMethods" value="Transfer" /> {t.transfer}</label><label className="flex items-center gap-1"><input type="checkbox" name="paymentMethods" value="Card" /> {t.card}</label></div></div>
               <div className="p-6 border border-slate-200 rounded-2xl"><h3 className="text-lg font-bold flex items-center gap-2 text-indigo-700 mb-4"><Users className="w-5 h-5"/> {t.assistants}</h3><div className="mb-4"><span className="font-bold text-slate-700 block mb-2">{t.hasAssistants}</span><div className="flex gap-4"><label className="flex items-center gap-2 cursor-pointer font-bold"><input type="radio" name="hasAssistants" value="yes" onChange={() => setShowAssistants(true)} className="accent-indigo-600" /> {t.yes}</label><label className="flex items-center gap-2 cursor-pointer font-bold"><input type="radio" name="hasAssistants" value="no" onChange={() => setShowAssistants(false)} defaultChecked className="accent-indigo-600" /> {t.no}</label></div></div><div className={showAssistants ? 'block' : 'hidden'}><div className="bg-slate-50 p-4 rounded-xl space-y-3"><div><label className="text-xs font-bold uppercase text-slate-500">{t.count}</label><input type="number" name="assistantsCount" className="w-20 p-2 ltr:ml-2 rtl:mr-2 rounded border font-bold" min="1" /></div><div><label className="text-xs font-bold uppercase text-slate-500 block mb-1">{t.permissions}</label><div className="flex gap-3 text-sm font-medium"><label className="flex items-center gap-1"><input type="checkbox" name="assistantPermissions" value="View" /> {t.view}</label><label className="flex items-center gap-1"><input type="checkbox" name="assistantPermissions" value="Add" /> {t.add}</label><label className="flex items-center gap-1"><input type="checkbox" name="assistantPermissions" value="Upload" /> {t.upload}</label></div></div></div></div></div>
            </div>

            {/* Step 4 */}
            <div className={step === 4 ? 'block animate-in fade-in slide-in-from-right-8' : 'hidden'}>
               <div className="flex gap-4 mb-6"><div className="flex-1"><label className="block text-sm font-bold text-slate-700 mb-2">{t.currency}</label><select name="currency" className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none"><option value="MAD">MAD (DH)</option><option value="USD">USD ($)</option><option value="EUR">EUR (€)</option></select></div></div>
               <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl"><h3 className="text-lg font-black flex items-center gap-2 text-indigo-800 mb-3"><Target className="w-6 h-6"/> {t.bigQuestion}</h3><label className="block text-sm font-bold text-indigo-900 mb-2">{t.problemLabel}</label><textarea name="mainProblem" placeholder={t.problemPlace} className="w-full p-4 bg-white border border-indigo-100 rounded-xl font-medium h-28 focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex gap-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 group">
                  {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />} {t.prev}
                </button>
              )}
              
              {step < totalSteps ? (
                <button type="button" onClick={() => setStep(s => s + 1)} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  {t.next} {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                </button>
              ) : (
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>{t.finish} <CheckCircle className="w-5 h-5" /></>
                  )}
                </button>
              )}
            </div>

          </form>
        </div>
      )}
    </div>
  );
}