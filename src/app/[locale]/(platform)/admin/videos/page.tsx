'use client';

import { useState, useEffect, useCallback } from 'react';

async function bulkAction(action: string, ids: string[]): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/admin/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resource: 'videos', action, ids }),
  });
  return res.json();
}

type Video = {
  id: string;
  title: string;
  description: string;
  duration: string;
  views: number;
  category: string;
  image: string | null;
  videoUrl: string | null;
  featured: boolean;
  isActive: boolean;
  sortOrder: number;
};

const CATEGORIES = ['quran', 'tajweed', 'arabic', 'islamic'] as const;
const EMPTY_FORM = {
  title: '',
  description: '',
  duration: '',
  views: 0,
  category: 'quran' as string,
  image: '',
  videoUrl: '',
  featured: false,
  isActive: true,
  sortOrder: 0,
};

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ ...EMPTY_FORM });

  // Bulk selection
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const allIds = videos.map((v) => v.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  const toggleAll = () => { if (allSelected) setSelected(new Set()); else setSelected(new Set(allIds)); };
  const toggleOne = (id: string) => {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const runBulk = async (action: string, label: string) => {
    if (selected.size === 0) return;
    if (!confirm(`${label} ${selected.size} video(s)?`)) return;
    setBulkBusy(true);
    const result = await bulkAction(action, Array.from(selected));
    setBulkBusy(false);
    if (result.success) {
      showToast(`${label} applied to ${selected.size} video(s).`, true);
      setSelected(new Set());
      await fetchVideos();
    } else {
      showToast(result.error || 'Action failed', false);
    }
  };

  const fetchVideos = useCallback(async () => {
    try {
      // Admin sees all videos (including inactive) — fetch without isActive filter
      const res = await fetch('/api/videos?includeInactive=true');
      const data = await res.json();
      if (data.success) setVideos(data.data);
    } catch {
      setMessage('Failed to load videos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  function startCreate() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
    setMessage('');
  }

  function startEdit(v: Video) {
    setForm({
      title: v.title,
      description: v.description,
      duration: v.duration,
      views: v.views,
      category: v.category,
      image: v.image ?? '',
      videoUrl: v.videoUrl ?? '',
      featured: v.featured,
      isActive: v.isActive,
      sortOrder: v.sortOrder,
    });
    setEditingId(v.id);
    setShowForm(true);
    setMessage('');
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setMessage('');
  }

  const field = (key: keyof typeof EMPTY_FORM, value: string | number | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  async function handleSave() {
    if (!form.title.trim() || !form.description.trim() || !form.duration.trim()) {
      setMessage('Title, description, and duration are required.');
      return;
    }
    setSaving(true);
    setMessage('');
    try {
      const url = editingId ? `/api/videos/${editingId}` : '/api/videos';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          image: form.image.trim() || undefined,
          videoUrl: form.videoUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(editingId ? 'Video updated!' : 'Video created!');
        cancelForm();
        await fetchVideos();
      } else {
        setMessage(data.error || 'Failed to save');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this video? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchVideos();
      } else {
        setMessage(data.error || 'Failed to delete');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setDeleting(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#2B7A78] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-[#D9B574] to-[#C4A565] rounded-full" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D9B574] to-[#C4A565] bg-clip-text text-transparent">
            Video Management
          </h1>
        </div>
        <button
          onClick={startCreate}
          className="relative group overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#D9B574] to-[#C4A565] group-hover:scale-105 transition-transform" />
          <div className="relative px-6 py-3 flex items-center gap-2">
            <span className="text-white font-bold">+ Add Video</span>
          </div>
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
          message.includes('!') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Bulk actions bar */}
      {someSelected && (
        <div className="mb-4 flex items-center gap-3 bg-white rounded-xl shadow-sm border border-[#D9B574]/30 px-5 py-3">
          <span className="text-sm font-bold text-[#C4A565]">{selected.size} selected</span>
          <div className="flex gap-2 ml-2">
            <button onClick={() => runBulk('activate', 'Activate')} disabled={bulkBusy} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-all">Activate</button>
            <button onClick={() => runBulk('deactivate', 'Deactivate')} disabled={bulkBusy} className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-bold hover:bg-yellow-700 disabled:opacity-50 transition-all">Deactivate</button>
            <button onClick={() => runBulk('delete', 'Delete')} disabled={bulkBusy} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all">Delete selected</button>
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Clear</button>
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Video' : 'Add New Video'}</h2>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => field('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                  placeholder="Introduction to Tajweed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Duration *</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => field('duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                  placeholder="15:30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => field('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm resize-none"
                placeholder="Describe this video…"
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => field('category', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Views</label>
                <input
                  type="number"
                  min={0}
                  value={form.views}
                  onChange={(e) => field('views', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => field('sortOrder', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => field('image', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                  placeholder="https://…"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Video URL</label>
                <input
                  type="url"
                  value={form.videoUrl}
                  onChange={(e) => field('videoUrl', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                  placeholder="https://youtube.com/…"
                />
              </div>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => field('featured', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#2B7A78]"
                />
                <span className="text-sm font-medium text-gray-700">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => field('isActive', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#2B7A78]"
                />
                <span className="text-sm font-medium text-gray-700">Active (visible to public)</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving…' : editingId ? 'Update Video' : 'Create Video'}
              </button>
              <button
                onClick={cancelForm}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#D9B574]/20">
        <div className="h-2 bg-gradient-to-r from-[#D9B574] via-[#C4A565] to-[#D9B574]" />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#D9B574]/20">
            <thead className="bg-gradient-to-r from-[#D9B574]/10 to-[#C4A565]/10">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 text-[#C4A565] cursor-pointer" />
                </th>
                {['Title', 'Category', 'Duration', 'Views', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9B574]/10">
              {videos.map((video, index) => (
                <tr
                  key={video.id}
                  className={`hover:bg-[#D9B574]/5 transition-colors ${selected.has(video.id) ? 'bg-[#D9B574]/10' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selected.has(video.id)} onChange={() => toggleOne(video.id)} className="w-4 h-4 rounded border-gray-300 text-[#C4A565] cursor-pointer" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 max-w-[200px] truncate">{video.title}</div>
                    {video.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Featured</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full capitalize">{video.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{video.duration}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{video.views.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg ${
                      video.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {video.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(video)}
                        className="px-3 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        disabled={deleting === video.id}
                        className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg text-sm font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                      >
                        {deleting === video.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {videos.length === 0 && (
        <div className="text-center py-16 bg-white/90 rounded-2xl shadow-xl border-2 border-[#D9B574]/20 mt-4">
          <p className="text-gray-600 text-lg mb-4">No videos yet</p>
          <button
            onClick={startCreate}
            className="px-8 py-4 bg-gradient-to-br from-[#D9B574] to-[#C4A565] text-white rounded-xl font-bold hover:shadow-2xl transition-all"
          >
            Add Your First Video
          </button>
        </div>
      )}
    </div>
  );
}
