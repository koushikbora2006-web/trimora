'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { 
  FileText, 
  Upload, 
  Trash2, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  Plus, 
  X, 
  Layers, 
  HelpCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { KnowledgeDocument, KnowledgeChunk } from '@/lib/types';

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [loading, setLoading] = useState(true);

  // Upload modal
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<'txt' | 'md' | 'faq' | 'pdf'>('txt');
  const [docContent, setDocContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // RAG Test Sandbox
  const [testQuery, setTestQuery] = useState('What is your cancellation policy?');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  const fetchKnowledgeData = async () => {
    try {
      const res = await fetch('/api/knowledge?salon_id=john_salon_kkd');
      const data = await res.json();
      if (data.success) {
        setDocuments(data.documents || []);
        setChunks(data.chunks || []);
      }
    } catch (e) {
      console.warn('Error loading knowledge data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName || !docContent) return;

    setUploading(true);
    setUploadSuccess(null);

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon_id: 'john_salon_kkd',
          file_name: fileName.endsWith(`.${fileType}`) ? fileName : `${fileName}.${fileType}`,
          file_type: fileType,
          content: docContent
        })
      });

      const data = await res.json();
      if (data.success) {
        setUploadSuccess(`Document indexed into ${data.document.chunk_count} semantic chunks.`);
        fetchKnowledgeData();
        setTimeout(() => {
          setUploadOpen(false);
          setFileName('');
          setDocContent('');
          setUploadSuccess(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document and its indexed chunks?')) return;

    try {
      const res = await fetch(`/api/knowledge?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchKnowledgeData();
      }
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleRunTestQuery = async () => {
    if (!testQuery.trim()) return;
    setTesting(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon_id: 'john_salon_kkd',
          message: testQuery
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(data);
      }
    } catch (err) {
      console.error('Test query failed', err);
    } finally {
      setTesting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              Retrieval-Augmented Generation
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#F7F4EE]">
              Knowledge Base Management
            </h1>
            <p className="text-xs text-[#9E988F]">
              Upload salon manuals, cancellation rules, and parking FAQs to train your zero-hallucination AI assistant.
            </p>
          </div>

          <button
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all shadow-[0_0_15px_rgba(197,168,128,0.2)]"
          >
            <Upload className="w-3.5 h-3.5 text-[#0A0A0A]" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Overview Banner */}
        <div className="p-6 rounded-3xl bg-[#141414] border border-[#C5A880]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1F1F1F] border border-[#C5A880]/40 text-[#C5A880] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#F7F4EE]">
                Active Knowledge Index
              </h3>
              <p className="text-xs text-[#9E988F]">
                {documents.length} indexed document(s) partitioned into <strong className="text-[#E5C590]">{chunks.length} searchable semantic chunks</strong> with cosine vectors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-500/15 px-3 py-1.5 rounded-full border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>RAG Grounding Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Documents List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
              Uploaded Knowledge Documents
            </h3>

            {documents.length === 0 ? (
              <div className="p-16 text-center bg-[#141414] rounded-3xl border border-white/[0.08] space-y-3 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                <FileText className="w-10 h-10 text-white/[0.2] mx-auto" />
                <h4 className="font-serif text-base font-bold text-[#F7F4EE]">
                  Upload Your First Knowledge Document
                </h4>
                <p className="text-xs text-[#9E988F] max-w-sm mx-auto">
                  Your knowledge base is empty. Upload your salon FAQ, appointment rules, or product philosophies so the chatbot can answer client inquiries accurately.
                </p>
                <button
                  onClick={() => setUploadOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 mt-2"
                >
                  <Upload className="w-3.5 h-3.5 text-[#0A0A0A]" />
                  <span>Upload Knowledge File</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-3xl bg-[#141414] border border-white/[0.08] hover:border-[#C5A880]/40 shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#222222] border border-white/[0.08] text-[#C5A880] flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-bold text-[#F7F4EE]">
                            {doc.file_name}
                          </h4>
                          <div className="text-[11px] text-[#9E988F] flex items-center gap-2 mt-0.5">
                            <span className="uppercase font-semibold text-[#E5C590]">{doc.file_type}</span>
                            <span>•</span>
                            <span>{Math.round(doc.file_size / 1024 * 10) / 10} KB</span>
                            <span>•</span>
                            <span>{doc.chunk_count} Chunks</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase">
                          {doc.processing_status}
                        </span>
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="p-1.5 text-[#9E988F] hover:text-red-400 rounded-lg hover:bg-red-500/15 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-[#0E0E0E] rounded-xl text-[11px] text-[#BEB8AE] line-clamp-3 font-mono border border-white/[0.06]">
                      {doc.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Built-in Interactive RAG Tester Sandbox */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
              RAG Retrieval Sandbox
            </h3>

            <div className="p-6 rounded-3xl bg-[#141414] border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.4)] space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A880]">
                  Live Vector Grounding Test
                </span>
                <p className="text-xs text-[#9E988F]">
                  Test questions against your salon index to preview the exact chunks retrieved and the AI response.
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="relative">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRunTestQuery();
                    }}
                    placeholder="Type test question..."
                    className="w-full px-3.5 py-2.5 text-xs bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'What is your cancellation policy?',
                    'What are your operating hours?',
                    'Do you offer beard grooming?',
                    'How much is hair styling?'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestQuery(preset)}
                      className="text-[10px] bg-[#1E1E1E] hover:bg-[#282828] text-[#E5C590] px-2.5 py-1 rounded-lg border border-white/[0.08] transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleRunTestQuery}
                  disabled={testing}
                  className="w-full py-2.5 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] text-xs font-semibold hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(197,168,128,0.2)] mt-2"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0A0A0A]" />
                      <span>Retrieving & Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-[#0A0A0A]" />
                      <span>Execute RAG Test Query</span>
                    </>
                  )}
                </button>
              </div>

              {testResult && (
                <div className="pt-4 border-t border-white/[0.08] space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#C5A880] uppercase tracking-wider">
                      Simulated Chatbot Answer:
                    </span>
                    <div className="p-3 bg-[#0E0E0E] rounded-2xl border border-white/[0.08] text-xs text-[#F7F4EE] leading-relaxed whitespace-pre-line">
                      {testResult.answer}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-[#9E988F] uppercase tracking-wider">
                      Retrieved Knowledge Chunks ({testResult.retrievedCount}):
                    </span>
                    {testResult.sources && testResult.sources.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {testResult.sources.map((s: string, idx: number) => (
                          <span key={idx} className="bg-[#222222] border border-white/[0.08] text-[#E5C590] text-[10px] px-2 py-0.5 rounded-md font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-300 bg-amber-500/15 p-2 rounded-xl border border-amber-500/30">
                        No matching chunks found in knowledge base. The strict anti-hallucination fallback was triggered!
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Upload Modal */}
        {uploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-[#141414] text-[#F7F4EE] rounded-3xl border border-white/[0.12] shadow-2xl p-6 space-y-5">
              
              <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#C5A880]" />
                  <h3 className="font-serif text-lg font-bold text-[#F7F4EE]">
                    Upload Knowledge Document
                  </h3>
                </div>
                <button
                  onClick={() => setUploadOpen(false)}
                  className="p-1 rounded-full hover:bg-white/[0.08] text-[#9E988F] hover:text-[#F7F4EE] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadSuccess && (
                <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="font-semibold text-[#F7F4EE] block mb-1">Document Title *</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      required
                      placeholder="e.g. cancellation_and_arrival_policy"
                      className="w-full px-3.5 py-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] placeholder:text-[#66615B]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-[#F7F4EE] block mb-1">Format</label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] uppercase font-medium"
                    >
                      <option value="txt" className="bg-[#141414] text-[#F7F4EE]">TXT</option>
                      <option value="md" className="bg-[#141414] text-[#F7F4EE]">Markdown</option>
                      <option value="faq" className="bg-[#141414] text-[#F7F4EE]">FAQ</option>
                      <option value="pdf" className="bg-[#141414] text-[#F7F4EE]">PDF (Text)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#F7F4EE] block mb-1">
                    Document Content / Policy Text *
                  </label>
                  <textarea
                    rows={7}
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    required
                    placeholder="Paste your salon's policy rules, FAQ answers, service precautions, organic product philosophy, parking tips..."
                    className="w-full p-3 bg-[#0E0E0E] text-[#F7F4EE] border border-white/[0.1] rounded-xl focus:outline-none focus:border-[#C5A880] font-mono text-[11px] placeholder:text-[#66615B]"
                  />
                  <span className="text-[10px] text-[#9E988F] block mt-1">
                    Text will automatically be split into overlapping semantic chunks and vectorized for instant retrieval.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setUploadOpen(false)}
                    className="px-4 py-2 rounded-full border border-white/[0.1] text-[#9E988F] hover:text-[#F7F4EE] hover:bg-white/[0.05] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-[#C5A880] to-[#E5C590] text-[#0A0A0A] font-semibold hover:brightness-110 transition-colors shadow-sm"
                  >
                    {uploading ? 'Chunking & Indexing...' : 'Upload & Index'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
