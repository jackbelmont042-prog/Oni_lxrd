import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  History, 
  ShieldCheck, 
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { MemoryEntry, MemoryCategory } from '../types';
import { api } from '../services/api';

export const MemoryPalaceView: React.FC = () => {
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recency');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [editingMemory, setEditingMemory] = useState<MemoryEntry | null>(null);
  const [correctionReason, setCorrectionReason] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryCategory>('facts');
  const [newConfidence, setNewConfidence] = useState(0.9);
  const [newProvenance, setNewProvenance] = useState('User direct instruction');
  const [newTags, setNewTags] = useState('');

  const loadMemories = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMemories({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        search: searchQuery || undefined,
        sort: sortBy
      });
      setMemories(res.memories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMemories();
  }, [selectedCategory, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadMemories();
  };

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      await api.createMemory({
        title: newTitle.trim(),
        content: newContent.trim(),
        category: newCategory,
        confidence: newConfidence,
        provenance: newProvenance,
        tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
      });
      setIsNewModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewTags('');
      loadMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCorrection = async () => {
    if (!editingMemory) return;
    try {
      await api.updateMemory(editingMemory.id, {
        title: editingMemory.title,
        content: editingMemory.content,
        category: editingMemory.category,
        confidence: editingMemory.confidence,
        tags: editingMemory.tags,
        reason: correctionReason || 'User manual correction'
      });
      setEditingMemory(null);
      setCorrectionReason('');
      loadMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory from the Palace?')) return;
    try {
      await api.deleteMemory(id);
      loadMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const data = await api.exportMemories();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `oni_memory_palace_backup_${Date.now()}.json`;
      a.click();
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const importedList = json.memories || (Array.isArray(json) ? json : []);
        await api.importMemories(importedList);
        loadMemories();
      } catch (err) {
        alert('Invalid memory JSON backup format');
      }
    };
    reader.readAsText(file);
  };

  const categories = [
    { id: 'all', label: 'All Records' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'facts', label: 'Facts' },
    { id: 'projects', label: 'Projects' },
    { id: 'procedures', label: 'Procedures' },
    { id: 'lessons', label: 'Lessons Learned' },
    { id: 'events', label: 'Events' },
  ];

  return (
    <div className="h-full flex flex-col gap-5 overflow-y-auto pr-1">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-base font-semibold text-neutral-100">Memory Palace Management</h2>
            <span className="text-xs text-neutral-500">·</span>
            <span className="text-xs font-mono text-cyan-400 tabular-nums">{memories.length} Invariants & Facts</span>
          </div>
          <p className="text-xs text-neutral-400">
            Persistent, inspectable, and correctable context hierarchy. Preserves preferences, validated procedures, and operational lessons.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Export complete memory state"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
          
          <label className="px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 rounded text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore Backup</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Memory</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-lg p-3">
        {/* Category Tabs (Functional Buttons) */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-neutral-950 rounded-md">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-neutral-800 text-neutral-100 shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 lg:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, content, tags..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 pl-8 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
          </form>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-cyan-500 font-mono shrink-0"
          >
            <option value="recency">Sort: Recency</option>
            <option value="confidence">Sort: Confidence</option>
            <option value="access">Sort: Frequency</option>
          </select>
        </div>
      </div>

      {/* Memory Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12 text-xs text-neutral-500">
          Loading Memory Palace index...
        </div>
      ) : memories.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12 text-center">
          <Brain className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-300 mb-1">No Memories Found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            No memories match your query. Add a new explicit preference, fact, or procedure to seed the palace.
          </p>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium rounded transition-colors"
          >
            Record First Memory
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memories.map(m => (
            <div 
              key={m.id} 
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 flex flex-col justify-between hover:border-neutral-700 transition-colors"
            >
              <div>
                {/* Zero-Pill Metadata Header */}
                <div className="flex items-center justify-between gap-2 text-xs text-neutral-400 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-medium text-cyan-400">{m.category}</span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className="font-mono text-neutral-400 tabular-nums">
                      Confidence {(m.confidence * 100).toFixed(0)}%
                    </span>
                    <span aria-hidden="true" className="text-neutral-600">·</span>
                    <span className="font-mono text-[11px] text-neutral-500 tabular-nums">
                      {m.accessCount} recalls
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingMemory(m)}
                      className="p-1 hover:text-cyan-400 text-neutral-500 transition-colors"
                      title="Inspect & Correct Memory"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1 hover:text-red-400 text-neutral-500 transition-colors"
                      title="Purge Memory"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-neutral-100 mb-2">
                  {m.title}
                </h3>

                <p className="text-xs text-neutral-300 leading-relaxed font-sans mb-4">
                  {m.content}
                </p>
              </div>

              {/* Provenance & Tags Footer */}
              <div className="pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate">
                    Source: <span className="text-neutral-400">{m.provenance}</span>
                  </span>
                  <span className="font-mono shrink-0 tabular-nums text-neutral-600">
                    {new Date(m.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {m.tags && m.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-hidden text-neutral-500 font-mono text-[10px]">
                    <span>Tags:</span>
                    <span className="text-neutral-400 truncate">
                      {m.tags.join(' · ')}
                    </span>
                  </div>
                )}

                {m.history && m.history.length > 0 && (
                  <div className="flex items-center gap-1 text-[10px] text-amber-500/80 font-mono mt-0.5">
                    <History className="w-3 h-3 shrink-0" />
                    <span>{m.history.length} revision(s) recorded</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inspect & Correct Modal */}
      {editingMemory && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-neutral-100">Inspect & Correct Memory</h3>
              </div>
              <span className="text-xs font-mono text-neutral-500">{editingMemory.id}</span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editingMemory.title}
                  onChange={(e) => setEditingMemory({ ...editingMemory, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Content / Rule</label>
                <textarea
                  rows={4}
                  value={editingMemory.content}
                  onChange={(e) => setEditingMemory({ ...editingMemory, content: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500 resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Category</label>
                  <select
                    value={editingMemory.category}
                    onChange={(e) => setEditingMemory({ ...editingMemory, category: e.target.value as MemoryCategory })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="preferences">Preferences</option>
                    <option value="facts">Facts</option>
                    <option value="projects">Projects</option>
                    <option value="procedures">Procedures</option>
                    <option value="lessons">Lessons Learned</option>
                    <option value="events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Confidence (0.1 - 1.0)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="1.0"
                    value={editingMemory.confidence}
                    onChange={(e) => setEditingMemory({ ...editingMemory, confidence: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Reason for Correction (Audited)</label>
                <input
                  type="text"
                  value={correctionReason}
                  onChange={(e) => setCorrectionReason(e.target.value)}
                  placeholder="e.g. User updated preferred compiler target or revised hardware limit"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {editingMemory.history && editingMemory.history.length > 0 && (
                <div className="pt-2 border-t border-neutral-800">
                  <span className="text-[11px] font-medium text-neutral-400 block mb-1">Revision Audit Trail:</span>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {editingMemory.history.map((h, i) => (
                      <div key={i} className="text-[10px] font-mono text-neutral-500 bg-neutral-950 p-1.5 rounded">
                        <span>{new Date(h.timestamp).toLocaleString()}:</span> <span className="text-neutral-400">{h.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingMemory(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 border border-neutral-700 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCorrection}
                className="px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
              >
                Apply & Save Correction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record New Memory Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateMemory} className="bg-neutral-900 border border-neutral-700 rounded-lg max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold text-neutral-100">Record New Memory Entry</h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Python Virtualenv Path or Stepper Feed Rate"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Content / Instruction</label>
                <textarea
                  rows={3}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Detail the persistent fact, rule, or preference..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500 resize-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MemoryCategory)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="preferences">Preferences</option>
                    <option value="facts">Facts</option>
                    <option value="projects">Projects</option>
                    <option value="procedures">Procedures</option>
                    <option value="lessons">Lessons Learned</option>
                    <option value="events">Events</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">Confidence (0.1 - 1.0)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="1.0"
                    value={newConfidence}
                    onChange={(e) => setNewConfidence(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Provenance (Origin Source)</label>
                <input
                  type="text"
                  value={newProvenance}
                  onChange={(e) => setNewProvenance(e.target.value)}
                  placeholder="e.g. Direct user instruction, Lab protocol manual"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. hardware, safety, local-first"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2 text-neutral-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 border border-neutral-700 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-cyan-600 hover:bg-cyan-500 rounded transition-colors"
              >
                Commit to Palace
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
