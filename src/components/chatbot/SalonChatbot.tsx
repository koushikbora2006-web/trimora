'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Calendar, 
  ChevronRight,
  ShieldCheck,
  Loader2,
  Scissors
} from 'lucide-react';
import { Salon } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  suggestedAction?: {
    type: 'book_appointment' | 'view_service' | 'view_offer';
    label: string;
  };
  timestamp: string;
}

interface SalonChatbotProps {
  salon: Salon;
  onOpenBooking?: () => void;
  initialMessage?: string;
  suggestedQuestions?: string[];
}

const DEFAULT_SUGGESTED_QUESTIONS = [
  'What services do you offer?',
  'How much is a haircut?',
  'What are your working hours?',
  'Do you offer hair spa or facial treatments?',
  'Where are you located in Kakinada?',
  'What are your current offers?'
];

export default function SalonChatbot({ 
  salon, 
  onOpenBooking,
  initialMessage,
  suggestedQuestions = DEFAULT_SUGGESTED_QUESTIONS
}: SalonChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: initialMessage || `Welcome to John Salon. I am your personal salon concierge. How may I assist you today with our bespoke services, authentic pricing, opening hours, or scheduling your priority appointment?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon_id: salon.id,
          message: query
        })
      });

      const data = await res.json();

      if (data.success) {
        const assistantMsg: Message = {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          suggestedAction: data.suggestedAction,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: "I don't have that information yet. Please contact John Salon directly at +91 98480 12345.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: "I don't have that information yet. Please contact John Salon directly at +91 98480 12345.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Chat history cleared. How may I assist you with John Salon's grooming services or reservations?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#121212]/95 backdrop-blur-xl text-[#F7F4EE] shadow-[0_10px_35px_rgba(0,0,0,0.8)] hover:bg-[#1A1A1A] border border-[#C5A880]/40 hover:border-[#C5A880] transition-all duration-300 hover:scale-105"
          aria-label="Open John Salon Concierge"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#C5A880]/50 flex items-center justify-center text-[#C5A880]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880] animate-pulse" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-[#121212]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold tracking-wide text-[#F7F4EE]">
              John Salon Concierge
            </span>
            <span className="text-[10px] text-[#C5A880] font-medium tracking-wider uppercase">
              Grounded AI Advisor
            </span>
          </div>
        </button>
      )}

      {/* Luxury Dark Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[420px] h-[600px] max-h-[85vh] bg-[#121212] border border-white/[0.12] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-5 py-4 bg-[#181818] text-[#F7F4EE] flex items-center justify-between border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0A0A0A] border border-[#C5A880]/50 flex items-center justify-center text-[#C5A880] shadow-[0_0_15px_rgba(197,168,128,0.2)]">
                <Scissors className="w-4 h-4 text-[#C5A880]" />
              </div>
              <div>
                <div className="text-sm font-serif font-bold tracking-wide text-[#F7F4EE] flex items-center gap-2">
                  <span>John Salon Concierge</span>
                  <span className="text-[9px] bg-[#C5A880]/20 text-[#E5C590] px-1.5 py-0.2 rounded border border-[#C5A880]/30 font-mono uppercase">
                    AI
                  </span>
                </div>
                <div className="text-[11px] text-[#9E988F] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Your personal grooming assistant</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                title="Clear Conversation"
                className="p-1.5 text-[#9E988F] hover:text-[#F7F4EE] rounded-lg hover:bg-white/[0.08] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#9E988F] hover:text-[#F7F4EE] rounded-lg hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="px-4 py-2 bg-[#0E0E0E] border-b border-white/[0.06] text-[10.5px] text-[#9E988F] flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
            <span>Strictly grounded in John Salon's verified rates and atelier policies.</span>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#0D0D0D]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#181818] text-[#C5A880] flex items-center justify-center shrink-0 mt-1 border border-[#C5A880]/30">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className={`max-w-[84%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-[#C5A880] to-[#D4AF37] text-[#0A0A0A] font-medium rounded-tr-xs shadow-md'
                    : 'bg-[#181818] border border-white/[0.08] text-[#F7F4EE] rounded-tl-xs shadow-md'
                }`}>
                  <div className="whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* Sources indication */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex flex-wrap items-center gap-1.5 text-[10px] text-[#9E988F]">
                      <span className="font-semibold text-[#C5A880]">Verified:</span>
                      {msg.sources.map((s, idx) => (
                        <span key={idx} className="bg-black/40 px-1.5 py-0.5 rounded text-[#FAF8F5] border border-white/[0.06]">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Suggested Contextual Action CTA button */}
                  {msg.suggestedAction && (
                    <div className="mt-3 pt-2.5 border-t border-white/[0.08]">
                      <button
                        onClick={() => {
                          if (msg.suggestedAction?.type === 'book_appointment' && onOpenBooking) {
                            onOpenBooking();
                          }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#C5A880] text-[#0A0A0A] font-semibold text-xs hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)]"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{msg.suggestedAction.label}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className={`text-[9px] mt-1.5 ${msg.role === 'user' ? 'text-[#0A0A0A]/70 text-right font-medium' : 'text-[#66615B]'}`}>
                    {msg.timestamp}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-[#202020] text-[#C5A880] flex items-center justify-center shrink-0 mt-1 border border-white/[0.1]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-[#181818] text-[#C5A880] flex items-center justify-center shrink-0 border border-[#C5A880]/30">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="bg-[#181818] border border-white/[0.08] rounded-2xl px-4 py-2.5 text-xs text-[#9E988F] flex items-center gap-2 shadow-md">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A880]" />
                  <span>Consulting John Salon knowledge base...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompt Chips */}
          <div className="px-4 py-2 bg-[#0E0E0E] border-t border-white/[0.06] overflow-x-auto scrollbar-none flex gap-2">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="whitespace-nowrap px-3 py-1 rounded-full text-[11px] bg-[#181818] hover:bg-[#222222] border border-white/[0.08] hover:border-[#C5A880]/40 text-[#9E988F] hover:text-[#F7F4EE] transition-all shrink-0 font-medium"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3.5 bg-[#141414] border-t border-white/[0.08] flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder={`Ask about haircuts, spa, pricing in ₹, or hours...`}
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-xs bg-[#0A0A0A] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] transition-colors placeholder:text-[#66615B]"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] flex items-center justify-center hover:brightness-110 disabled:opacity-30 transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)] shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4 text-[#0A0A0A]" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
