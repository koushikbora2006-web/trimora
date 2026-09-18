'use client';

import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Scissors, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  FileText,
  MapPin
} from 'lucide-react';
import { Salon, Service, Appointment } from '@/lib/types';

interface AppointmentModalProps {
  salon: Salon;
  services: Service[];
  initialServiceId?: string;
  initialNotes?: string;
  stylescanReference?: {
    hairstyle_name: string;
    analysis_summary?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (appointment: Appointment) => void;
}

const TIME_SLOTS = [
  '09:30 AM', '10:15 AM', '11:00 AM', '11:45 AM',
  '01:15 PM', '02:00 PM', '02:45 PM', '03:30 PM',
  '04:15 PM', '05:00 PM', '06:00 PM', '06:45 PM'
];

export default function AppointmentModal({
  salon,
  services,
  initialServiceId,
  initialNotes,
  stylescanReference,
  isOpen,
  onClose,
  onSuccess
}: AppointmentModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || (services.length > 0 ? services[0].id : '')
  );
  const [departmentFilter, setDepartmentFilter] = useState<'all' | 'salon' | 'spa'>(() => {
    if (initialServiceId) {
      const s = services.find(srv => srv.id === initialServiceId);
      if (s?.department) return s.department;
    }
    return 'all';
  });
  
  // Date selection (defaults to tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState<string>(tomorrow.toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>(TIME_SLOTS[2]);

  // Customer fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [notes, setNotes] = useState(initialNotes || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  if (!isOpen) return null;

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const filteredServices = services.filter((s) => {
    if (!s.is_active) return false;
    if (departmentFilter === 'all') return true;
    return (s.department || 'salon') === departmentFilter;
  });

  // Generate next 7 days for quick date picker
  const upcomingDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' })
    };
  });

  const handleSubmit = async () => {
    if (!customerName || !customerPhone || !selectedServiceId) {
      setError('Please provide your name, phone number, and selected service.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        salon_id: salon.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail || undefined,
        service_id: selectedServiceId,
        preferred_date: selectedDate,
        preferred_time: selectedTime,
        notes: notes || undefined,
        stylescan_reference: stylescanReference || undefined
      };

      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setConfirmedAppointment(data.appointment);
        setStep(4);
        if (onSuccess) onSuccess(data.appointment);
      } else {
        setError(data.error || 'Failed to submit appointment request.');
      }
    } catch (e: any) {
      setError('An unexpected network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#121212] border border-white/[0.12] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#171717] text-[#F7F4EE] flex items-center justify-between border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold">
                Priority Reservation
              </span>
              {stylescanReference && (
                <span className="text-[10px] bg-[#C5A880]/20 text-[#E5C590] px-2 py-0.5 rounded-full border border-[#C5A880]/30 font-mono">
                  StyleScan Attached
                </span>
              )}
            </div>
            <h3 className="font-serif text-xl font-bold tracking-wide mt-1 text-[#F7F4EE]">
              {salon.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#9E988F] hover:text-[#F7F4EE] rounded-full hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        {step < 4 && (
          <div className="px-6 py-3 bg-[#151515] border-b border-white/[0.06] flex items-center justify-between text-xs text-[#9E988F]">
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 1 ? 'bg-[#C5A880] text-[#0A0A0A]' : 'bg-[#222222] text-[#9E988F]'
              }`}>1</span>
              <span className={step === 1 ? 'font-semibold text-[#F7F4EE]' : ''}>Service</span>
            </div>
            <div className="h-[1px] w-8 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 2 ? 'bg-[#C5A880] text-[#0A0A0A]' : 'bg-[#222222] text-[#9E988F]'
              }`}>2</span>
              <span className={step === 2 ? 'font-semibold text-[#F7F4EE]' : ''}>Date & Time</span>
            </div>
            <div className="h-[1px] w-8 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step >= 3 ? 'bg-[#C5A880] text-[#0A0A0A]' : 'bg-[#222222] text-[#9E988F]'
              }`}>3</span>
              <span className={step === 3 ? 'font-semibold text-[#F7F4EE]' : ''}>Your Details</span>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-[#0E0E0E]">
          
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* STEP 1: Select Service */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  Select Your Treatment or Service
                </h4>
                <p className="text-xs text-[#9E988F]">
                  Curated bespoke salon grooming and beauty spa rituals at John Salon KKD.
                </p>
              </div>

              {/* Department Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[#161616] rounded-xl border border-white/[0.08] w-fit">
                <button
                  type="button"
                  onClick={() => setDepartmentFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    departmentFilter === 'all'
                      ? 'bg-[#C5A880] text-[#0A0A0A] font-semibold'
                      : 'text-[#9E988F] hover:text-[#F7F4EE]'
                  }`}
                >
                  All Services
                </button>
                <button
                  type="button"
                  onClick={() => setDepartmentFilter('salon')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    departmentFilter === 'salon'
                      ? 'bg-[#C5A880] text-[#0A0A0A] font-semibold'
                      : 'text-[#9E988F] hover:text-[#F7F4EE]'
                  }`}
                >
                  Salon Grooming
                </button>
                <button
                  type="button"
                  onClick={() => setDepartmentFilter('spa')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    departmentFilter === 'spa'
                      ? 'bg-[#C5A880] text-[#0A0A0A] font-semibold'
                      : 'text-[#9E988F] hover:text-[#F7F4EE]'
                  }`}
                >
                  Beauty Spa
                </button>
              </div>

              {stylescanReference && (
                <div className="p-3.5 rounded-2xl bg-[#161616] border border-[#C5A880]/30 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <div className="font-semibold text-[#F7F4EE]">
                      StyleScan Selected: {stylescanReference.hairstyle_name}
                    </div>
                    <div className="text-[#9E988F] text-[11px] mt-0.5 leading-relaxed">
                      {stylescanReference.analysis_summary || 'Your personalized hairstyle consultation notes will be attached to your appointment.'}
                    </div>
                  </div>
                </div>
              )}

              {filteredServices.length === 0 ? (
                <div className="p-8 text-center bg-[#151515] rounded-2xl border border-white/[0.08] text-[#9E988F] text-xs">
                  No services found in this category.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {filteredServices.map((service) => {
                    const isSelected = selectedServiceId === service.id;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#1D1B18] text-[#F7F4EE] border-[#C5A880] shadow-[0_0_20px_rgba(197,168,128,0.15)]'
                            : 'bg-[#151515] border-white/[0.08] hover:border-[#C5A880]/40 text-[#9E988F] hover:text-[#F7F4EE]'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs tracking-wide text-[#F7F4EE]">
                              {service.name}
                            </span>
                            {service.department === 'spa' ? (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#C5A880]/20 text-[#E5C590] border border-[#C5A880]/30 font-semibold tracking-wider uppercase">
                                Spa Ritual
                              </span>
                            ) : (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.08] text-[#9E988F] font-semibold tracking-wider uppercase">
                                Salon
                              </span>
                            )}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              isSelected ? 'bg-[#C5A880]/20 text-[#E5C590]' : 'bg-[#222222] text-[#9E988F]'
                            }`}>
                              {service.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#9E988F] line-clamp-1">
                            {service.description}
                          </p>
                        </div>

                        <div className="text-right shrink-0 ml-4">
                          <div className={`font-serif text-sm font-bold ${isSelected ? 'text-[#E5C590]' : 'text-[#F7F4EE]'}`}>
                            ₹{service.price}
                          </div>
                          <div className="text-[10px] text-[#9E988F] flex items-center gap-1 justify-end">
                            <Clock className="w-3 h-3 text-[#C5A880]" />
                            <span>{service.duration_minutes}m</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Select Date & Time */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  Select Preferred Arrival Window
                </h4>
                <p className="text-xs text-[#9E988F]">
                  Real-time slots verified with John Salon's Bhanugudi studio schedule.
                </p>
              </div>

              {/* Day Selection Strip */}
              <div>
                <label className="text-xs font-semibold text-[#F7F4EE] block mb-2">
                  Select Date
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {upcomingDays.map((day) => {
                    const isSelected = selectedDate === day.iso;
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        onClick={() => setSelectedDate(day.iso)}
                        className={`p-2.5 rounded-2xl border text-center transition-all ${
                          isSelected
                            ? 'bg-[#C5A880] text-[#0A0A0A] border-[#C5A880] font-semibold shadow-[0_0_15px_rgba(197,168,128,0.3)]'
                            : 'bg-[#151515] border-white/[0.08] hover:border-[#C5A880]/40 text-[#9E988F] hover:text-[#F7F4EE]'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-medium tracking-wider opacity-80">
                          {day.dayName}
                        </div>
                        <div className="font-serif text-base font-bold my-0.5">
                          {day.dayNum}
                        </div>
                        <div className="text-[10px] opacity-80">
                          {day.month}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Grid */}
              <div>
                <label className="text-xs font-semibold text-[#F7F4EE] block mb-2">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-[#C5A880] text-[#0A0A0A] border-[#C5A880] font-semibold shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                            : 'bg-[#151515] border-white/[0.08] hover:border-[#C5A880]/40 text-[#9E988F] hover:text-[#F7F4EE]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected summary */}
              {selectedService && (
                <div className="p-3 bg-[#151515] border border-white/[0.06] rounded-xl text-xs text-[#9E988F] flex items-center justify-between">
                  <span>Selected: <strong className="text-[#F7F4EE]">{selectedService.name}</strong></span>
                  <span className="font-serif font-bold text-[#E5C590]">₹{selectedService.price}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Customer Details */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-serif text-lg font-bold text-[#F7F4EE]">
                  Your Guest Details
                </h4>
                <p className="text-xs text-[#9E988F]">
                  We will send your reservation code and reminder to this phone number.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9E988F] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Anand Varma"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#151515] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#9E988F] absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="+91 98480 XXXXX"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#151515] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#9E988F] absolute left-3 top-3" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="anand@example.com"
                        className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#151515] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                    {selectedService?.department === 'spa' ? 'Spa Therapist Notes or Requests' : 'Stylist Notes or Preferences'}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder={
                      selectedService?.department === 'spa'
                        ? 'Mention skin sensitivities, pressure preferences, aromatic oil allergies, or custom requests...'
                        : 'Tell your stylist about preferred fade depth, scalp therapy requests, or allergy notes...'
                    }
                    className="w-full p-3 text-xs bg-[#151515] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation Screen */}
          {step === 4 && confirmedAppointment && (
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-[#182618] text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[10px] font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
                  Reservation Dispatched
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#F7F4EE] mt-1">
                  Thank You, {customerName}!
                </h4>
                <p className="text-xs text-[#9E988F] mt-1 max-w-sm mx-auto leading-relaxed">
                  Your appointment request has been reserved with John Salon. Our atelier concierge will confirm your slot via phone.
                </p>
              </div>

              {/* Reference Card */}
              <div className="p-5 bg-[#151515] border border-white/[0.1] rounded-2xl max-w-sm mx-auto text-left space-y-3 shadow-xl">
                <div className="flex justify-between items-center pb-2.5 border-b border-white/[0.08]">
                  <span className="text-[11px] text-[#9E988F]">Booking Reference</span>
                  <span className="font-mono text-xs font-bold text-[#E5C590] bg-black/60 px-2.5 py-0.5 rounded border border-[#C5A880]/30">
                    {confirmedAppointment.reference_code}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#9E988F]">Service:</span>
                  <span className="font-semibold text-[#F7F4EE]">{confirmedAppointment.service_name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#9E988F]">Date & Time:</span>
                  <span className="font-semibold text-[#F7F4EE]">{confirmedAppointment.preferred_date} at {confirmedAppointment.preferred_time}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#9E988F]">Location:</span>
                  <span className="text-[#9E988F] text-[11px]">Bhanugudi Junc., Kakinada</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-white/[0.06]">
                  <span className="text-[#9E988F]">Status:</span>
                  <span className="text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-amber-500/30">
                    Pending Confirmation
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-7 py-3 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(197,168,128,0.2)]"
              >
                Close & Return to Salon
              </button>
            </div>
          )}

        </div>

        {/* Footer Navigation Buttons */}
        {step < 4 && (
          <div className="px-6 py-4 bg-[#141414] border-t border-white/[0.08] flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1) as any)}
                className="flex items-center gap-1.5 text-xs font-medium text-[#9E988F] hover:text-[#F7F4EE] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                disabled={!selectedServiceId}
                onClick={() => setStep((s) => Math.min(3, s + 1) as any)}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all disabled:opacity-30 shadow-[0_0_15px_rgba(197,168,128,0.2)]"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={loading || !customerName || !customerPhone}
                onClick={handleSubmit}
                className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all disabled:opacity-30 shadow-[0_0_20px_rgba(197,168,128,0.25)]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#0A0A0A]" />
                    <span>Reserving...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#0A0A0A]" />
                    <span>Confirm Priority Reservation</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
