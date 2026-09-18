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
            <span className="text-xs font-semibold uppercase tracking-wider text-salon-darkgold">
              Retrieval-Augmented Generation
            </span>
            <h1 className="font-serif text-3xl font-bold text-salon-charcoal">
              Knowledge Base Management
            </h1>
            <p className="text-xs text-salon-muted">
              Upload salon manuals, cancellation rules, and parking FAQs to train your zero-hallucination AI assistant.
            </p>
          </div>

          <button
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-salon-charcoal text-white text-xs font-semibold hover:bg-black transition-all shadow-sm"
          >
            <Upload className="w-3.5 h-3.5 text-salon-bronze" />
            <span>Upload Document</span>
          </button>
        </div>

        {/* Overview Banner */}
        <div className="p-6 rounded-3xl bg-salon-cream border border-salon-sand/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-salon-charcoal text-salon-bronze flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-salon-charcoal">
                Active Knowledge Index
              </h3>
              <p className="text-xs text-salon-muted">
                {documents.length} indexed document(s) partitioned into {chunks.length} searchable semantic chunks with cosine vectors.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>RAG Grounding Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Documents List */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-lg font-bold text-salon-charcoal">
              Uploaded Knowledge Documents
            </h3>

            {documents.length === 0 ? (
              <div className="p-16 text-center bg-white rounded-3xl border border-salon-sand space-y-3 shadow-sm">
                <FileText className="w-10 h-10 text-salon-taupe mx-auto" />
                <h4 className="font-serif text-base font-bold text-salon-charcoal">
                  Upload Your First Knowledge Document
                </h4>
                <p className="text-xs text-salon-muted max-w-sm mx-auto">
                  Your knowledge base is empty. Upload your salon FAQ, appointment rules, or product philosophies so the chatbot can answer client inquiries accurately.
                </p>
                <button
                  onClick={() => setUploadOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-salon-charcoal text-white text-xs font-semibold hover:bg-black mt-2"
                >
                  <Upload className="w-3.5 h-3.5 text-salon-bronze" />
                  <span>Upload Knowledge File</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-5 rounded-3xl bg-white border border-salon-sand hover:border-salon-bronze/40 shadow-2xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-salon-cream text-salon-darkgold flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm font-bold text-salon-charcoal">
                            {doc.file_name}
                          </h4>
                          <div className="text-[11px] text-salon-muted flex items-center gap-2 mt-0.5">
                            <span className="uppercase font-semibold">{doc.file_type}</span>
                            <span>•</span>
                            <span>{Math.round(doc.file_size / 1024 * 10) / 10} KB</span>
                            <span>•</span>
                            <span>{doc.chunk_count} Chunks</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                          {doc.processing_status}
                        </span>
                        <button
                          onClick={() => handleDeleteDoc(doc.id)}
                          className="p-1.5 text-salon-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-salon-ivory rounded-xl text-[11px] text-salon-muted line-clamp-3 font-mono">
                      {doc.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Built-in Interactive RAG Tester Sandbox */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-lg font-bold text-salon-charcoal">
              RAG Retrieval Sandbox
            </h3>

            <div className="p-6 rounded-3xl bg-white border border-salon-sand shadow-sm space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-salon-darkgold">
                  Live Vector Grounding Test
                </span>
                <p className="text-xs text-salon-muted">
                  Test questions against your salon index to preview the exact chunks retrieved and the AI response.
                </p>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={testQuery}
                    onChange={(e) => setTestQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRunTestQuery();
                    }}
                    placeholder="Type test question..."
                    className="w-full px-3.5 py-2.5 text-xs bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    'What is your cancellation policy?',
                    'What kind of hair dyes do you use?',
                    'Where can I park my car?',
                    'Do you offer pet grooming?'
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTestQuery(preset)}
                      className="text-[10px] bg-salon-cream hover:bg-salon-sand/70 text-salon-charcoal px-2 py-0.5 rounded-lg border border-salon-sand/50 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleRunTestQuery}
                  disabled={testing}
                  className="w-full py-2.5 rounded-full bg-salon-charcoal text-white text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-1.5 shadow-sm mt-2"
                >
                  {testing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-salon-bronze" />
                      <span>Retrieving & Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-3.5 h-3.5 text-salon-bronze" />
                      <span>Execute RAG Test Query</span>
                    </>
                  )}
                </button>
              </div>

              {testResult && (
                <div className="pt-4 border-t border-salon-sand space-y-3 animate-in fade-in">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-salon-charcoal uppercase tracking-wider">
                      Simulated Chatbot Answer:
                    </span>
                    <div className="p-3 bg-salon-ivory rounded-2xl border border-salon-sand text-xs text-salon-charcoal leading-relaxed whitespace-pre-line">
                      {testResult.answer}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-salon-muted uppercase tracking-wider">
                      Retrieved Knowledge Chunks ({testResult.retrievedCount}):
                    </span>
                    {testResult.sources && testResult.sources.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {testResult.sources.map((s: string, idx: number) => (
                          <span key={idx} className="bg-salon-sand text-salon-charcoal text-[10px] px-2 py-0.5 rounded-md font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="w-full max-w-lg bg-white rounded-3xl border border-salon-sand shadow-2xl p-6 space-y-5">
              
              <div className="flex justify-between items-center pb-3 border-b border-salon-sand">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-salon-darkgold" />
                  <h3 className="font-serif text-lg font-bold text-salon-charcoal">
                    Upload Knowledge Document
                  </h3>
                </div>
                <button
                  onClick={() => setUploadOpen(false)}
                  className="p-1 rounded-full hover:bg-salon-sand text-salon-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="font-semibold text-salon-charcoal block mb-1">Document Title *</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      required
                      placeholder="e.g. cancellation_and_arrival_policy"
                      className="w-full px-3.5 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-salon-charcoal block mb-1">Format</label>
                    <select
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze uppercase font-medium"
                    >
                      <option value="txt">TXT</option>
                      <option value="md">Markdown</option>
                      <option value="faq">FAQ</option>
                      <option value="pdf">PDF (Text)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-salon-charcoal block mb-1">
                    Document Content / Policy Text *
                  </label>
                  <textarea
                    rows={7}
                    value={docContent}
                    onChange={(e) => setDocContent(e.target.value)}
                    required
                    placeholder="Paste your salon's policy rules, FAQ answers, service precautions, organic product philosophy, parking tips..."
                    className="w-full p-3 bg-salon-ivory border border-salon-sand rounded-xl focus:outline-none focus:border-salon-bronze font-mono text-[11px]"
                  />
                  <span className="text-[10px] text-salon-muted block mt-1">
                    Text will automatically be split into overlapping semantic chunks and vectorized for instant retrieval.
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-salon-sand">
                  <button
                    type="button"
                    onClick={() => setUploadOpen(false)}
                    className="px-4 py-2 rounded-full border border-salon-sand text-salon-muted hover:bg-salon-cream transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-5 py-2 rounded-full bg-salon-charcoal text-white font-semibold hover:bg-black transition-colors"
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
