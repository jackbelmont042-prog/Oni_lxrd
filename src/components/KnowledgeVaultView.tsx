import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  FileCode, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { KnowledgeDocument, KnowledgeChunk } from '../types';
import { api } from '../services/api';

export const KnowledgeVaultView: React.FC = () => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isNewDocModalOpen, setIsNewDocModalOpen] = useState(false);

  // New Doc Form
  const [newTitle, setNewTitle] = useState('');
  const [newSourceType, setNewSourceType] = useState<'markdown' | 'pdf' | 'code' | 'lab_protocol'>('markdown');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  const loadDocuments = async () => {
    try {
      const res = await api.getDocuments();
      setDocuments(res.documents || []);
      if (res.documents && res.documents.length > 0 && !selectedDoc) {
        setSelectedDoc(res.documents[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await api.searchKnowledge(searchQuery.trim(), 4);
      setSearchResults(res.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const doc = await api.ingestDocument({
        title: newTitle.trim(),
        content: newContent.trim(),
        sourceType: newSourceType,
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setIsNewDocModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
      await loadDocuments();
      setSelectedDoc(doc);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document and clear its vector chunks?')) return;
    try {
      await api.deleteDocument(id);
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
      }
      loadDocuments();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-semibold text-neutral-100">Knowledge Engine & RAG Vault</h2>
            <span className="text-xs text-neutral-500">·</span>
            <span className="text-xs font-mono text-cyan-400 tabular-nums">
              {documents.length} Documents ({documents.reduce((sum, d) => sum + d.chunks.length, 0)} Chunks)
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            Ingests approved technical references, laboratory manuals, and system architecture specifications. Enables evidence-based retrieval with verifiable citations.
          </p>
        </div>

        <button
          onClick={() => setIsNewDocModalOpen(true)}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest Document</span>
        </button>
      </div>

      {/* Semantic Retrieval Playground */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Test semantic RAG retrieval (e.g. 'optical density wavelength', 'threat model', 'e-stop pressure cutoff')..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 pl-9 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          </div>
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded transition-colors shrink-0"
          >
            {isSearching ? 'Retrieving...' : 'Retrieve Evidence'}
          </button>
        </form>

        {/* Results Stream */}
        {searchResults.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-2">
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
              Top Ranked Retrieved Chunks ({searchResults.length})
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {searchResults.map((res, i) => (
                <div key={i} className="bg-neutral-950 p-3 rounded border border-neutral-800 text-xs">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-cyan-300 mb-1">
                    <span className="font-semibold truncate">{res.docTitle}</span>
                    <span className="text-emerald-400 font-bold tabular-nums shrink-0">
                      Score: {(res.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 block mb-1.5 tabular-nums">
                    {res.location}
                  </span>
                  <p className="text-neutral-300 font-sans text-xs line-clamp-3 leading-relaxed">
                    "{res.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main 2-Column Split: Documents List vs Chunk Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Documents Table */}
        <div className="lg:col-span-5 bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
              Ingested Knowledge Collections
            </h3>

            <div className="space-y-2">
              {documents.map(doc => {
                const isSelected = selectedDoc?.id === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-3 rounded-md border cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-neutral-950 border-cyan-500/80' 
                        : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-neutral-500'}`} />
                        <span className="text-xs font-medium text-neutral-200 line-clamp-1">
                          {doc.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc.id);
                        }}
                        className="text-neutral-500 hover:text-red-400 p-0.5 transition-colors"
                        title="Remove Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-mono">
                      <span className="capitalize">{doc.sourceType.replace('_', ' ')}</span>
                      <span aria-hidden="true" className="text-neutral-700">·</span>
                      <span className="tabular-nums">{doc.chunkCount} chunks</span>
                      <span aria-hidden="true" className="text-neutral-700">·</span>
                      <span className="tabular-nums">{(doc.sizeBytes / 1024).toFixed(1)} KB</span>
                    </div>

                    <p className="text-[11px] text-neutral-400 mt-2 line-clamp-2">
                      {doc.summary}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Chunk Inspector */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          {selectedDoc ? (
            <div>
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-neutral-800">
                <div>
                  <h3 className="text-sm font-semibold text-neutral-100 mb-0.5">
                    {selectedDoc.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="font-mono text-neutral-500">{selectedDoc.filename}</span>
                    <span aria-hidden="true" className="text-neutral-700">·</span>
                    <span className="font-mono text-neutral-500">{selectedDoc.chunkCount} Searchable Chunks</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {selectedDoc.chunks.map((chunk, i) => (
                  <div key={chunk.id} className="bg-neutral-950 p-4 rounded-md border border-neutral-800">
                    <div className="flex items-center justify-between gap-2 text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 font-semibold">Chunk #{chunk.chunkIndex}</span>
                        <span aria-hidden="true" className="text-neutral-700">·</span>
                        <span className="font-mono text-neutral-400">{chunk.location}</span>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-500 tabular-nums">
                        ~{chunk.tokenCount} tokens
                      </span>
                    </div>

                    <p className="text-xs text-neutral-200 leading-relaxed font-sans mb-3">
                      {chunk.content}
                    </p>

                    {chunk.keywords && chunk.keywords.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 pt-2 border-t border-neutral-900">
                        <span>Keywords:</span>
                        <span className="text-neutral-400">
                          {chunk.keywords.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-xs text-neutral-500">
              Select a document to inspect indexed chunks.
            </div>
          )}
        </div>
      </div>

      {/* Ingest Document Modal */}
      {isNewDocModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleIngest} className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-neutral-100">Ingest Reference Document</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Compute Job Queue Protocol"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Source Format</label>
                <select
                  value={newSourceType}
                  onChange={(e) => setNewSourceType(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="markdown">Markdown Documentation</option>
                  <option value="pdf">PDF Research Document</option>
                  <option value="lab_protocol">Lab Standard Operating Protocol</option>
                  <option value="code">Source Code Specification</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Document Text / Chunks</label>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Paste document content. Chunks and keywords will be generated automatically..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500 resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. protocol, distributed, security"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsNewDocModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 border border-neutral-700 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
              >
                Ingest & Index
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
