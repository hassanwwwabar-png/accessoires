"use client";

import { useLanguage } from "@/components/language-context";
import { useState } from "react";
import { Calendar, Plus, Clock, User, Search, X, Trash2, Phone, Info, AlertTriangle, CalendarDays } from "lucide-react";
import { createGeneralAppointment, deleteAppointment } from "@/app/actions";
import { AppointmentStatusSelect } from "@/components/dashboard/appointment-status-select";

interface AppointmentsListProps {
  appointments: any[];
  patients: any[];
}

export function AppointmentsList({ appointments, patients }: AppointmentsListProps) {
  const { t, isRTL } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filter, setFilter] = useState("");
  
  // 🗓️ Date Filter State
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'tomorrow' | 'specific'>('all');
  const [specificDate, setSpecificDate] = useState(""); // لتخزين التاريخ المخصص

  // 🧠 Smart Input State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const activePatient = patients.find(p => p.id === selectedPatientId);

  const dayAppointments = selectedDate ? appointments.filter(apt => {
    const aptDate = new Date(apt.date).toDateString();
    const pickDate = new Date(selectedDate).toDateString();
    return aptDate === pickDate;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) : [];

  // 🔥 FILTER LOGIC (Updated)
  const filteredAppointments = appointments.filter(apt => {
    // 1. Text Search
    const matchesSearch = 
      apt.patient.firstName.toLowerCase().includes(filter.toLowerCase()) || 
      apt.patient.lastName.toLowerCase().includes(filter.toLowerCase());

    // 2. Date Filter logic
    let matchesDate = true;
    const aptDate = new Date(apt.date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateFilter === 'today') {
      matchesDate = aptDate.toDateString() === today.toDateString();
    } else if (dateFilter === 'tomorrow') {
      matchesDate = aptDate.toDateString() === tomorrow.toDateString();
    } else if (dateFilter === 'specific' && specificDate) {
      // مقارنة التاريخ المختار مع تاريخ الموعد
      matchesDate = aptDate.toDateString() === new Date(specificDate).toDateString();
    }

    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isRTL ? 'text-right' : ''}`}>
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" /> {t.appointments}
          </h1>
          <p className="text-slate-500 text-sm font-bold">Manage your schedule</p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
        >
          {isFormOpen ? <X className="w-4 h-4"/> : <Plus className="w-4 h-4"/>} 
          {t.newAppointment}
        </button>
      </div>

      {/* 🧠 Smart Add Form (Code folded for brevity - same as before) */}
      {isFormOpen && (
        <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-2xl animate-in slide-in-from-top-4 duration-300">
           {/* ... Form Content ... */}
           {/* (هذا الجزء لم يتغير، ولكن تأكد من نسخه إذا لم يكن موجوداً) */}
           <h3 className="font-bold text-lg mb-6 flex items-center gap-2 border-b border-slate-700 pb-4">
            <div className="p-2 bg-blue-600 rounded-lg"><Plus className="w-4 h-4"/></div>
            {t.scheduleAppointment}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <form action={async (formData) => { await createGeneralAppointment(formData); setIsFormOpen(false); }} className="space-y-4">
               <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{t.selectPatient}</label>
                <div className="relative">
                  <User className={`absolute top-3.5 w-4 h-4 text-slate-500 ${isRTL ? 'left-auto right-4' : 'left-4'}`}/>
                  <select name="patientId" required onChange={(e) => setSelectedPatientId(e.target.value)} className={`w-full py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold focus:border-blue-500 outline-none appearance-none ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}>
                    <option value="">-- {t.selectPatient} --</option>
                    {patients.map(p => (<option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{t.dateTime}</label>
                <input type="datetime-local" name="date" required onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:border-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{t.consultationType}</label>
                  <select name="type" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:border-blue-500 outline-none appearance-none">
                    <option value="Consultation">Consultation</option>
                    <option value="Checkup">Checkup</option>
                    <option value="Emergency">🚨 Emergency</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">{t.fee}</label>
                  <input type="number" name="price" placeholder="0.00" className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-sm font-bold text-white focus:border-blue-500 outline-none" />
                </div>
              </div>
              <div className="pt-2">
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-black text-sm shadow-lg shadow-blue-900/50 transition-all">{t.save}</button>
              </div>
            </form>
            <div className="space-y-6 border-t lg:border-t-0 lg:border-l border-slate-700 pt-6 lg:pt-0 lg:pl-6">
               {activePatient ? (
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 animate-in fade-in"><h4 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2"><Info className="w-4 h-4"/> Patient Info</h4><div className="flex items-center gap-4"><div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-black">{activePatient.firstName[0]}</div><div><p className="font-bold text-lg">{activePatient.firstName} {activePatient.lastName}</p><p className="text-slate-400 text-xs font-mono flex items-center gap-1"><Phone className="w-3 h-3"/> {activePatient.phone || "No phone"}</p></div></div></div>
              ) : (<div className="p-4 rounded-2xl border border-slate-800 border-dashed text-center text-slate-500 text-xs">Select a patient to see details here.</div>)}
              <div>
                 <h4 className="text-xs font-black text-slate-400 uppercase mb-3 flex items-center gap-2"><Calendar className="w-4 h-4"/> {selectedDate ? `Schedule for ${new Date(selectedDate).toLocaleDateString()}` : "Select a date to check schedule"}</h4>
                 <div className="bg-slate-800/50 rounded-2xl p-2 max-h-[250px] overflow-y-auto space-y-2">
                    {selectedDate && dayAppointments.length === 0 && (<p className="text-green-400 text-xs font-bold text-center py-4">No appointments yet. Free day! 🎉</p>)}
                    {dayAppointments.map((apt: any) => { const isEmergency = apt.type === "Emergency"; return (<div key={apt.id} className={`flex justify-between items-center p-2 rounded-xl border ${isEmergency ? "bg-red-900/20 border-red-500/50" : "bg-slate-800 border-slate-700/50"}`}><div className="flex items-center gap-2"><span className={`text-xs font-bold px-2 py-1 rounded-lg ${isEmergency ? "bg-red-600 text-white" : "bg-slate-700 text-white"}`}>{new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span><div><span className={`text-xs font-bold block ${isEmergency ? "text-red-200" : "text-slate-300"}`}>{apt.patient.firstName} {apt.patient.lastName}</span>{isEmergency && <span className="text-[10px] text-red-400 font-black flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> EMERGENCY</span>}</div></div></div>); })}
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 Controls: Filter & Search (Updated with Date Picker) */}
      <div className="flex flex-col xl:flex-row gap-4">
        
        {/* 1. Date Filter Tabs + Picker */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 xl:pb-0">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center shrink-0">
            <button 
              onClick={() => { setDateFilter('all'); setSpecificDate(""); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${dateFilter === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.filterAll}
            </button>
            <button 
              onClick={() => { setDateFilter('today'); setSpecificDate(""); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${dateFilter === 'today' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.filterToday}
            </button>
            <button 
              onClick={() => { setDateFilter('tomorrow'); setSpecificDate(""); }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${dateFilter === 'tomorrow' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {t.filterTomorrow}
            </button>
          </div>

          {/* 🗓️ Specific Date Picker */}
          <div className={`relative flex items-center bg-slate-100 rounded-2xl p-1 transition-all ${dateFilter === 'specific' ? 'ring-2 ring-blue-200 bg-white' : ''}`}>
             <div className="absolute left-3 pointer-events-none text-slate-500">
               <CalendarDays className="w-4 h-4" />
             </div>
             <input 
               type="date"
               value={specificDate}
               onChange={(e) => {
                 setSpecificDate(e.target.value);
                 if (e.target.value) setDateFilter('specific');
                 else setDateFilter('all');
               }}
               className="pl-9 pr-3 py-2 bg-transparent text-xs font-bold text-slate-700 border-none outline-none rounded-xl cursor-pointer w-[140px]"
             />
          </div>
        </div>

        {/* 2. Search Bar */}
        <div className="relative w-full">
          <Search className={`absolute top-3.5 w-4 h-4 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} />
          <input 
            placeholder={t.searchPlaceholder}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className={`w-full py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-100 outline-none shadow-sm ${isRTL ? 'pr-10' : 'pl-10'}`}
          />
        </div>
      </div>

      {/* 📅 Appointments List Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-bold text-sm flex flex-col items-center gap-2">
            <Calendar className="w-8 h-8 text-slate-300" />
            {t.noAppointmentsYet}
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {filteredAppointments.map((apt) => {
               const isEmergency = apt.type === "Emergency";
               return (
                <div key={apt.id} className={`p-4 hover:bg-slate-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isEmergency ? "bg-red-50/50" : ""}`}>
                  
                  {/* Patient & Time */}
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm ${
                      isEmergency ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"
                    }`}>
                      {new Date(apt.date).getDate()}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm flex items-center gap-2">
                        {apt.patient.firstName} {apt.patient.lastName}
                        {isEmergency && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full border border-red-200">URGENT</span>}
                      </h4>
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(apt.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500">{apt.type}</span>
                        {/* عرض التاريخ الكامل إذا لم نكن في فلتر اليوم أو الغد */}
                        {(dateFilter === 'all' || dateFilter === 'specific') && (
                          <span className="text-slate-300 hidden sm:inline">• {new Date(apt.date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-3">
                    <AppointmentStatusSelect 
                        id={apt.id} 
                        currentStatus={apt.status} 
                    />
                    <form 
                        action={deleteAppointment}
                        onSubmit={(e) => {
                          if (!confirm(t.deleteAppointmentConfirm)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="id" value={apt.id} />
                        <button 
                          className="p-2 bg-slate-100 text-slate-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                          title={t.delete}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}