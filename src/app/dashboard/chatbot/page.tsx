'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Bot, Sparkles, ShieldCheck, MessageSquare, Send, CheckCircle2, RotateCcw, Save } from 'lucide-react';
import { Salon } from '@/lib/types';

export default function ChatbotSettingsPage() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState(
    'Welcome to our salon! I am your AI concierge. How can I assist you with services, pricing, hours, or reservations?'
  );
  const [saved, setSaved] = useState(false);

  // Chat simulator
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your salon AI concierge. Ask me anything about our services, pricing, or policies.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/salons/john_salon_kkd')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSalon(data.salon);
        }
      });
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon_id: 'john_salon_kkd',
          message: userText
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.answer, sources: data.sources }
        ]);
      }
    } catch (e) {
      console.error('Chat simulator error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
            Conversational Intelligence
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#F7F4EE]">
            AI Chatbot Suite & Settings
          </h1>
          <p className="text-xs text-[#9E988F]">
            Configure greeting personas, review grounding safeguards, and test your chatbot live.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Settings Left */}
          <div className="lg:col-span-6 space-y-5">
            
            {/* Greeting Box */}
            <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4">
              <h3 className="font-serif text-base font-bold text-[#F7F4EE] border-b border-white/[0.08] pb-3">
                Concierge Greeting & Persona
              </h3>

              <div>
                <label className="text-xs font-semibold text-[#F7F4EE] block mb-1">
                  Default Welcome Greeting
                </label>
                <textarea
                  rows={3}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full p-3 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-[#9E988F]">
                  Displays on first client widget load.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2500);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)]"
                >
                  <Save className="w-3.5 h-3.5 text-[#0A0A0A]" />
                  <span>{saved ? 'Saved!' : 'Save Greeting'}</span>
                </button>
              </div>
            </div>

            {/* RAG Guardrails Summary */}
            <div className="p-6 rounded-3xl bg-[#141414] border border-[#C5A880]/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4">
              <div className="flex items-center gap-2 text-[#C5A880]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-serif text-base font-bold text-[#F7F4EE]">Strict RAG Guardrails</h3>
              </div>

              <div className="space-y-3 text-xs text-[#BEB8AE] leading-relaxed">
                <p>
                  Trimorva AI operates under strict architectural constraints to prevent brand risk:
                </p>
                <ul className="space-y-1.5 list-disc pl-4 text-[#9E988F]">
                  <li>Never invents prices, discounts, or policies.</li>
                  <li>Answers only using verified menu items and uploaded files.</li>
                  <li>If info is absent, says: <em className="text-[#E5C590]">"I don't have that information yet. Please contact the salon for confirmation."</em></li>
                  <li>Automatically triggers interactive appointment CTAs when booking intent is detected.</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Chat Simulator Right */}
          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-serif text-base font-bold text-[#F7F4EE]">
              Live Chatbot Test Simulator
            </h3>

            <div className="bg-[#141414] border border-white/[0.08] rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.4)] h-[480px] flex flex-col overflow-hidden">
              
              {/* Simulator Header */}
              <div className="px-5 py-3.5 bg-[#181818] border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-[#C5A880]" />
                  <span className="text-xs font-bold text-[#F7F4EE]">{salon?.name || 'Salon'} AI Concierge</span>
                </div>
                <button
                  onClick={() => setMessages([{ role: 'assistant', content: 'Chat history reset. Ask me anything!' }])}
                  className="text-[11px] text-[#9E988F] hover:text-[#F7F4EE] flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0E0E0E] text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-3.5 rounded-2xl ${
                      m.role === 'user'
                        ? 'bg-[#C5A880] text-[#0A0A0A] font-medium rounded-tr-xs shadow-sm'
                        : 'bg-[#1A1A1A] border border-white/[0.08] text-[#F7F4EE] rounded-tl-xs shadow-xs'
                    }`}>
                      <div className="whitespace-pre-line">{m.content}</div>
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-2 pt-1.5 border-t border-white/[0.08] text-[10px] text-[#C5A880]">
                          Source: {m.sources.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="text-xs text-[#9E988F] italic flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-pulse inline-block" />
                    <span>AI is retrieving verified knowledge...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="p-3 bg-[#141414] border-t border-white/[0.08] flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Test question (e.g. How much is a haircut?)..."
                  className="flex-1 px-3.5 py-2 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] flex items-center justify-center hover:brightness-110 disabled:opacity-40 transition-all shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-[#0A0A0A]" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
