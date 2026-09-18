'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Camera, 
  Upload, 
  Trash2, 
  ShieldCheck, 
  Check, 
  AlertTriangle, 
  ChevronRight, 
  Calendar, 
  Share2, 
  Info, 
  Scissors,
  CheckCircle,
  SlidersHorizontal,
  Loader2,
  Scan
} from 'lucide-react';
import { 
  FaceAnalysisResult, 
  HairstyleRecommendation, 
  Salon, 
  Service 
} from '@/lib/types';
import AppointmentModal from '@/components/booking/AppointmentModal';
import SalonChatbot from '@/components/chatbot/SalonChatbot';

export default function StyleScanPage() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // User preferences
  const [lengthPref, setLengthPref] = useState<'short' | 'medium' | 'long' | 'any'>('any');
  const [aestheticPref, setAestheticPref] = useState<'trendy' | 'professional' | 'casual' | 'traditional'>('trendy');
  const [maintPref, setMaintPref] = useState<'low-maintenance' | 'medium' | 'styling-focused'>('low-maintenance');
  const [texturePref, setTexturePref] = useState<'straight' | 'wavy' | 'curly' | 'coily' | 'unknown'>('wavy');
  const [includeBeard, setIncludeBeard] = useState(false);

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FaceAnalysisResult | null>(null);
  const [recommendations, setRecommendations] = useState<HairstyleRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Booking modal integration
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedStyleForBooking, setSelectedStyleForBooking] = useState<HairstyleRecommendation | null>(null);
  const [featuredSalon, setFeaturedSalon] = useState<Salon | null>(null);
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);

  // Fetch John Salon KKD for booking conversion
  useEffect(() => {
    fetch('/api/salons/john_salon_kkd')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFeaturedSalon(data.salon);
          setFeaturedServices(data.services || []);
        }
      })
      .catch((err) => console.warn('Could not load salon for booking', err));
  }, []);

  // Handle webcam
  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 640 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      setError('Unable to access webcam. Please upload an image instead.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File is too large. Please select a photo under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = () => {
    stopCamera();
    setImagePreview(null);
    setAnalysisResult(null);
    setRecommendations([]);
    setError(null);
  };

  // Run StyleScan Analysis
  const handleAnalyze = async () => {
    if (!consentGiven) {
      setError('Please review and check the privacy consent box to proceed.');
      return;
    }

    if (!imagePreview) {
      setError('Please upload or capture a photo before initiating analysis.');
      return;
    }

    setAnalyzing(true);
    setError(null);

    try {
      const payload = {
        image_base64: imagePreview,
        consent_given: true,
        preferences: {
          length: lengthPref,
          aesthetic: aestheticPref,
          maintenance: maintPref,
          texture: texturePref,
          includeBeard: includeBeard
        }
      };

      const res = await fetch('/api/stylescan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        setAnalysisResult(data.analysis);
        setRecommendations(data.recommendations || []);
        // Smooth scroll to results
        setTimeout(() => {
          document.getElementById('scan-results')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        setError(data.error || 'Failed to complete face analysis.');
      }
    } catch (e: any) {
      setError('Network error occurred during style scan.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCopyShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto bg-[#0A0A0A] text-[#F7F4EE]">
      
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#151515] border border-[#C5A880]/30 text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>John Salon · StyleScan AI</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#F7F4EE]">
          AI Face Analysis & Hairstyle Consultation
        </h1>
        <p className="text-sm text-[#9E988F] leading-relaxed">
          Discover personalized hairstyle recommendations aligned with your facial geometry, hair texture, and grooming habits before sitting in our chair.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Privacy Consent & Photo Viewport */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Privacy & Safety Consent Notice */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-2xl space-y-4">
            <div className="flex items-center gap-2.5 text-[#F7F4EE] font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Ethics Protection</span>
            </div>

            <p className="text-xs text-[#9E988F] leading-relaxed">
              Your photo is analyzed in-memory purely for geometric hairstyle proportion recommendations. We strictly uphold your privacy:
            </p>

            <ul className="space-y-2 text-[11px] text-[#BEB8AE]">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Photos are never permanently stored or used to train public models.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero biometric identification; only geometric proportions evaluated.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Instant photo purge option available at any moment.</span>
              </li>
            </ul>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#1A1A1A] border border-white/[0.08] cursor-pointer transition-colors hover:border-[#C5A880]/40">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#C5A880] focus:ring-[#C5A880] accent-[#C5A880]"
              />
              <span className="text-xs text-[#F7F4EE] font-medium leading-snug">
                I understand and consent to in-memory geometric facial analysis for hairstyle recommendations.
              </span>
            </label>
          </div>

          {/* Photo Capture & Upload Box */}
          <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#F7F4EE]">
                Face Scan Capture
              </span>
              {imagePreview && (
                <button
                  onClick={handleDeleteImage}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Purge Photo</span>
                </button>
              )}
            </div>

            {/* Live Camera View */}
            {cameraActive ? (
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-black border border-[#C5A880]/40">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                  <div className="scan-laser" />
                  <div className="absolute inset-8 border border-[#C5A880]/40 rounded-full pointer-events-none" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={capturePhoto}
                    className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(197,168,128,0.25)]"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Snapshot</span>
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-5 py-3 rounded-full bg-[#202020] text-[#F7F4EE] text-xs font-medium hover:bg-[#282828] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : imagePreview ? (
              /* Image Preview Box */
              <div className="space-y-3">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#181818] border border-white/[0.1]">
                  <img
                    src={imagePreview}
                    alt="Uploaded face portrait"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl text-[11px] text-[#F7F4EE] flex items-center justify-between border border-white/[0.08]">
                    <span>Portrait validated for geometry</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>
            ) : (
              /* Upload / Camera Pick Area */
              <div className="space-y-3">
                <div className="border-2 border-dashed border-white/[0.1] hover:border-[#C5A880]/50 rounded-2xl p-8 text-center space-y-4 bg-[#111111]/60 transition-all">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#C5A880]/30 text-[#C5A880] flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(197,168,128,0.1)]">
                    <Scan className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-[#F7F4EE]">
                      Upload face portrait or take a snapshot
                    </p>
                    <p className="text-[11px] text-[#9E988F]">
                      JPG, PNG, or WebP up to 10MB. Front-facing, well-lit photo recommended.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                    <label className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#F7F4EE] hover:bg-white text-[#0A0A0A] text-xs font-semibold transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5 text-[#0A0A0A]" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={startCamera}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1A1A1A] border border-white/[0.15] text-[#F7F4EE] text-xs font-semibold hover:border-[#C5A880]/40 transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Use Camera</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Style Preferences & Trigger */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-2xl space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/[0.08]">
              <SlidersHorizontal className="w-4 h-4 text-[#C5A880]" />
              <h3 className="font-serif text-xl font-bold text-[#F7F4EE]">
                Personalize Your Style Goals
              </h3>
            </div>

            {/* Length Preference */}
            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-2">
                Desired Hair Length
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['short', 'medium', 'long', 'any'] as const).map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setLengthPref(len)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                      lengthPref === len
                        ? 'bg-[#C5A880] text-[#0A0A0A] border-[#C5A880] font-semibold shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                        : 'bg-[#181818] border-white/[0.08] hover:border-[#C5A880]/40 text-[#9E988F] hover:text-[#F7F4EE]'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </div>
            </div>

            {/* Aesthetic Vibe */}
            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-2">
                Desired Aesthetic
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['trendy', 'professional', 'casual', 'traditional'] as const).map((aes) => (
                  <button
                    key={aes}
                    type="button"
                    onClick={() => setAestheticPref(aes)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium capitalize transition-all ${
                      aestheticPref === aes
                        ? 'bg-[#C5A880] text-[#0A0A0A] border-[#C5A880] font-semibold shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                        : 'bg-[#181818] border-white/[0.08] hover:border-[#C5A880]/40 text-[#9E988F] hover:text-[#F7F4EE]'
                    }`}
                  >
                    {aes}
                  </button>
                ))}
              </div>
            </div>

            {/* Maintenance Commitment */}
            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-2">
                Daily Maintenance Commitment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'low-maintenance', label: 'Low Effort' },
                  { id: 'medium', label: 'Balanced' },
                  { id: 'styling-focused', label: 'Styling Focused' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMaintPref(item.id as any)}
                    className={`py-2.5 px-2.5 rounded-xl border text-xs font-medium transition-all ${
                      maintPref === item.id
                        ? 'bg-[#C5A880] text-[#0A0A0A] border-[#C5A880] font-semibold shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                        : 'bg-[#181818] border-white/[0.08] hover:border-[#C5A880]/40 text-[#9E988F] hover:text-[#F7F4EE]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hair Texture */}
            <div>
              <label className="text-xs font-semibold text-[#F7F4EE] block mb-2">
                Natural Hair Texture
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(['straight', 'wavy', 'curly', 'coily', 'unknown'] as const).map((tex) => (
                  <button
                    key={tex}
                    type="button"
                    onClick={() => setTexturePref(tex)}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-medium capitalize transition-all ${
                      texturePref === tex
                        ? 'bg-[#C5A880] text-[#0A0A0A] border-[#C5A880] font-semibold shadow-[0_0_15px_rgba(197,168,128,0.25)]'
                        : 'bg-[#181818] border-white/[0.08] hover:border-[#C5A880]/40 text-[#9E988F] hover:text-[#F7F4EE]'
                    }`}
                  >
                    {tex}
                  </button>
                ))}
              </div>
            </div>

            {/* Facial Hair / Beard Option */}
            <div className="pt-2 border-t border-white/[0.08]">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBeard}
                  onChange={(e) => setIncludeBeard(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C5A880] accent-[#C5A880]"
                />
                <span className="text-xs text-[#F7F4EE] font-medium">
                  Include beard and grooming harmonization advice
                </span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Trigger Button */}
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !consentGiven || !imagePreview}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] font-semibold text-xs tracking-wider uppercase hover:brightness-110 transition-all duration-300 disabled:opacity-30 flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(197,168,128,0.3)] group"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0A0A0A]" />
                  <span>Evaluating Face Proportions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0A0A0A] group-hover:rotate-12 transition-transform" />
                  <span>Generate Style Recommendations</span>
                </>
              )}
            </button>

          </div>

        </div>

      </div>

      {/* Results Section */}
      {analysisResult && recommendations.length > 0 && (
        <div id="scan-results" className="mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
          
          {/* Analysis Summary Header Card */}
          <div className="p-8 rounded-3xl bg-[#141414] border border-[#C5A880]/30 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-xs font-semibold text-[#C5A880] uppercase tracking-[0.2em]">
                  StyleScan Consultation Profile
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#F7F4EE] capitalize mt-1">
                  {analysisResult.face_shape_guidance} Facial Balance Profile
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyShare}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1C1C1C] border border-white/[0.1] text-xs font-medium text-[#F7F4EE] hover:border-[#C5A880]/40 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>{copiedShare ? 'Link Copied!' : 'Share Results'}</span>
                </button>
              </div>
            </div>

            <p className="text-sm text-[#BEB8AE] leading-relaxed">
              {analysisResult.facial_balance_notes}
            </p>

            <div className="p-3.5 bg-[#181818] border border-white/[0.06] rounded-2xl text-xs text-[#9E988F] flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
              <span>{analysisResult.disclaimer}</span>
            </div>
          </div>

          {/* Hairstyle Recommendation Cards */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A880]">
                  Personalized Recommendations
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F7F4EE] mt-1">
                  Hairstyles Engineered for Your Features
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec) => {
                const style = rec.hairstyle;
                return (
                  <div
                    key={style.id}
                    className="bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Hairstyle Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                      <img
                        src={style.image_url}
                        alt={style.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-[#E5C590] text-xs font-bold px-3 py-1 rounded-full border border-[#C5A880]/40 shadow-sm font-mono">
                        {rec.match_score}% Harmony
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-[#F7F4EE] text-[10px] font-semibold px-2.5 py-0.5 rounded-full capitalize border border-white/[0.1]">
                        {style.category}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <h4 className="font-serif text-xl font-bold text-[#F7F4EE] group-hover:text-[#E5C590] transition-colors">
                          {style.name}
                        </h4>
                        <p className="text-xs text-[#9E988F] line-clamp-2">
                          {style.description}
                        </p>

                        <div className="p-3 rounded-xl bg-[#1A1A1A] border border-white/[0.06] text-xs text-[#BEB8AE] leading-snug">
                          <strong className="text-[#C5A880]">Why it fits:</strong> {rec.why_it_suits}
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          <div className="bg-[#1A1A1A] p-2.5 rounded-xl border border-white/[0.05]">
                            <span className="text-[#66615B] block text-[10px]">Length</span>
                            <span className="font-semibold text-[#F7F4EE] capitalize">{style.length}</span>
                          </div>
                          <div className="bg-[#1A1A1A] p-2.5 rounded-xl border border-white/[0.05]">
                            <span className="text-[#66615B] block text-[10px]">Daily Styling</span>
                            <span className="font-semibold text-[#C5A880]">{rec.styling_effort_text}</span>
                          </div>
                        </div>

                        {includeBeard && style.optional_beard_compatibility && (
                          <div className="text-[11px] text-[#9E988F] italic pt-1">
                            🧔 {style.optional_beard_compatibility}
                          </div>
                        )}
                      </div>

                      {/* Card CTA: 1-Click Booking */}
                      <div className="pt-3 border-t border-white/[0.08]">
                        <button
                          onClick={() => {
                            setSelectedStyleForBooking(rec);
                            setBookingOpen(true);
                          }}
                          className="w-full py-3 rounded-full bg-[#1F1F1F] hover:bg-[#C5A880] text-[#F7F4EE] hover:text-[#0A0A0A] text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-2 group/btn"
                        >
                          <Calendar className="w-3.5 h-3.5 text-[#C5A880] group-hover/btn:text-[#0A0A0A]" />
                          <span>Book This Style at John Salon</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Integrated Appointment Modal with StyleScan pre-selection */}
      {featuredSalon && bookingOpen && (
        <AppointmentModal
          salon={featuredSalon}
          services={featuredServices}
          initialServiceId={featuredServices[0]?.id}
          initialNotes={
            selectedStyleForBooking
              ? `StyleScan Request: ${selectedStyleForBooking.hairstyle.name}. Client Facial Harmony Score: ${selectedStyleForBooking.match_score}%. Note: ${selectedStyleForBooking.why_it_suits}`
              : undefined
          }
          stylescanReference={
            selectedStyleForBooking
              ? {
                  hairstyle_name: selectedStyleForBooking.hairstyle.name,
                  analysis_summary: selectedStyleForBooking.why_it_suits
                }
              : undefined
          }
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
        />
      )}

      {/* Floating John Salon Concierge */}
      {featuredSalon && (
        <SalonChatbot
          salon={featuredSalon}
          onOpenBooking={() => setBookingOpen(true)}
        />
      )}

    </div>
  );
}
