'use client';

import { useState, useEffect, useCallback } from 'react';

const POST_TYPES = ['NEWS', 'UPDATE', 'OFFER', 'EVENT', 'ANNOUNCEMENT'] as const;
type PostType = typeof POST_TYPES[number];
type LangTab = 'en' | 'de' | 'ar';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  titleDe: string | null;
  slugDe: string | null;
  excerptDe: string | null;
  contentDe: string | null;
  titleAr: string | null;
  slugAr: string | null;
  excerptAr: string | null;
  contentAr: string | null;
  image: string | null;
  type: PostType;
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
  publishedAt: string | null;
  createdAt: string;
};

const TYPE_COLORS: Record<PostType, string> = {
  NEWS: 'bg-blue-100 text-blue-700',
  UPDATE: 'bg-purple-100 text-purple-700',
  OFFER: 'bg-green-100 text-green-700',
  EVENT: 'bg-orange-100 text-orange-700',
  ANNOUNCEMENT: 'bg-red-100 text-red-700',
};

const EMPTY_FORM = {
  // English (required)
  title: '', slug: '', excerpt: '', content: '',
  // German (optional)
  titleDe: '', slugDe: '', excerptDe: '', contentDe: '',
  // Arabic (optional)
  titleAr: '', slugAr: '', excerptAr: '', contentAr: '',
  // Common
  image: '',
  type: 'NEWS' as PostType,
  featured: false,
  isPublished: true,
  sortOrder: 0,
  publishedAt: '',
};

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function bulkAction(action: string, ids: string[]): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/admin/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resource: 'posts', action, ids }),
  });
  return res.json();
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [langTab, setLangTab] = useState<LangTab>('en');

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const allIds = posts.map((p) => p.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  const toggleAll = () => { if (allSelected) setSelected(new Set()); else setSelected(new Set(allIds)); };
  const toggleOne = (id: string) => {
    setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const runBulk = async (action: string, label: string) => {
    if (selected.size === 0) return;
    if (!confirm(`${label} ${selected.size} post(s)?`)) return;
    setBulkBusy(true);
    const result = await bulkAction(action, Array.from(selected));
    setBulkBusy(false);
    if (result.success) {
      showToast(`${label} applied to ${selected.size} post(s).`, true);
      setSelected(new Set());
      await fetchPosts();
    } else {
      showToast(result.error || 'Action failed', false);
    }
  };

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts?includeAll=true');
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } catch {
      setMessage('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function startCreate() {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
    setMessage('');
    setSlugManuallyEdited(false);
    setLangTab('en');
  }

  function startEdit(p: Post) {
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt ?? '',
      content: p.content,
      titleDe: p.titleDe ?? '',
      slugDe: p.slugDe ?? '',
      excerptDe: p.excerptDe ?? '',
      contentDe: p.contentDe ?? '',
      titleAr: p.titleAr ?? '',
      slugAr: p.slugAr ?? '',
      excerptAr: p.excerptAr ?? '',
      contentAr: p.contentAr ?? '',
      image: p.image ?? '',
      type: p.type,
      featured: p.featured,
      isPublished: p.isPublished,
      sortOrder: p.sortOrder,
      publishedAt: p.publishedAt ? p.publishedAt.substring(0, 16) : '',
    });
    setEditingId(p.id);
    setShowForm(true);
    setMessage('');
    setSlugManuallyEdited(true);
    setLangTab('en');
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setMessage('');
    setSlugManuallyEdited(false);
  }

  const field = <K extends keyof typeof EMPTY_FORM>(key: K, value: typeof EMPTY_FORM[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  function handleTitleChange(v: string) {
    setForm((f) => ({
      ...f,
      title: v,
      slug: slugManuallyEdited ? f.slug : slugify(v),
    }));
  }

  async function handleSave() {
    if (!form.title.trim()) { setMessage('English title is required.'); return; }
    if (!form.slug.trim()) { setMessage('English slug is required.'); return; }
    if (!form.content.trim()) { setMessage('English content is required.'); return; }
    if (!/^[a-z0-9-]+$/.test(form.slug)) { setMessage('Slug must contain only lowercase letters, numbers, and hyphens.'); return; }
    if (form.slugDe && !/^[a-z0-9-]+$/.test(form.slugDe)) { setMessage('German slug must contain only lowercase letters, numbers, and hyphens.'); return; }

    setSaving(true);
    setMessage('');
    try {
      const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:   form.title.trim(),
          slug:    form.slug.trim(),
          excerpt: form.excerpt.trim() || undefined,
          content: form.content.trim(),
          titleDe:   form.titleDe.trim() || undefined,
          slugDe:    form.slugDe.trim() || undefined,
          excerptDe: form.excerptDe.trim() || undefined,
          contentDe: form.contentDe.trim() || undefined,
          titleAr:   form.titleAr.trim() || undefined,
          slugAr:    form.slugAr.trim() || undefined,
          excerptAr: form.excerptAr.trim() || undefined,
          contentAr: form.contentAr.trim() || undefined,
          image:       form.image.trim() || undefined,
          type:        form.type,
          featured:    form.featured,
          isPublished: form.isPublished,
          sortOrder:   form.sortOrder,
          publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(editingId ? 'Post updated!' : 'Post created!', true);
        cancelForm();
        await fetchPosts();
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
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast('Post deleted.', true);
        await fetchPosts();
      } else {
        setMessage(data.error || 'Failed to delete');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setDeleting(null);
    }
  }

  async function togglePublish(post: Post) {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(post.isPublished ? 'Post unpublished.' : 'Post published.', true);
        await fetchPosts();
      } else {
        showToast(data.error || 'Failed to update', false);
      }
    } catch {
      showToast('Network error.', false);
    }
  }

  async function toggleFeatured(post: Post) {
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !post.featured }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(post.featured ? 'Removed from featured.' : 'Marked as featured.', true);
        await fetchPosts();
      } else {
        showToast(data.error || 'Failed to update', false);
      }
    } catch {
      showToast('Network error.', false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#2B7A78] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const LANG_TABS: { id: LangTab; label: string; flag: string }[] = [
    { id: 'en', label: 'English', flag: '🇬🇧' },
    { id: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { id: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-[#D9B574] to-[#C4A565] rounded-full" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#D9B574] to-[#C4A565] bg-clip-text text-transparent">
            News & Announcements
          </h1>
        </div>
        <button
          onClick={startCreate}
          className="relative group overflow-hidden rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#D9B574] to-[#C4A565] group-hover:scale-105 transition-transform" />
          <div className="relative px-6 py-3 flex items-center gap-2">
            <span className="text-white font-bold">+ Add Post</span>
          </div>
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
          message.includes('!') || message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Bulk actions bar */}
      {someSelected && (
        <div className="mb-4 flex items-center gap-3 bg-white rounded-xl shadow-sm border border-[#D9B574]/30 px-5 py-3">
          <span className="text-sm font-bold text-[#C4A565]">{selected.size} selected</span>
          <div className="flex gap-2 ml-2">
            <button onClick={() => runBulk('activate', 'Publish')} disabled={bulkBusy} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-all">Publish</button>
            <button onClick={() => runBulk('deactivate', 'Unpublish')} disabled={bulkBusy} className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-bold hover:bg-yellow-700 disabled:opacity-50 transition-all">Unpublish</button>
            <button onClick={() => runBulk('delete', 'Delete')} disabled={bulkBusy} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all">Delete selected</button>
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Clear</button>
        </div>
      )}

      {/* Create / Edit Form */}
      {showForm && (
        <div className="mb-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Edit Post' : 'Add New Post'}</h2>

          {/* Language tabs */}
          <div className="flex gap-1 mb-6 border-b border-gray-200">
            {LANG_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setLangTab(tab.id)}
                className={`px-5 py-2.5 text-sm font-semibold rounded-t-lg transition-all ${
                  langTab === tab.id
                    ? 'bg-[#2B7A78] text-white border-b-2 border-[#2B7A78]'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                {tab.flag} {tab.label}
                {tab.id === 'en' && <span className="ml-1 text-xs opacity-70">*</span>}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* English tab */}
            {langTab === 'en' && (
              <>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Title (English) *</label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                      placeholder="New Quran Course Registration Open"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Type *</label>
                    <select
                      value={form.type}
                      onChange={(e) => field('type', e.target.value as PostType)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                    >
                      {POST_TYPES.map((t) => (
                        <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (English) *</label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => { setSlugManuallyEdited(true); field('slug', e.target.value.toLowerCase()); }}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm font-mono"
                      placeholder="new-quran-course-2026"
                    />
                    <p className="text-xs text-gray-400 mt-1">Auto-generated from title. Lowercase, numbers, hyphens only.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={form.image}
                      onChange={(e) => field('image', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                      placeholder="https://…"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt (English)</label>
                  <input
                    type="text"
                    value={form.excerpt}
                    onChange={(e) => field('excerpt', e.target.value)}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                    placeholder="Short summary shown in cards…"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Content (English) *</label>
                  <textarea
                    rows={8}
                    value={form.content}
                    onChange={(e) => field('content', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm resize-y"
                    placeholder="Write the full post content here…"
                  />
                </div>
              </>
            )}

            {/* German tab */}
            {langTab === 'de' && (
              <>
                <p className="text-xs text-gray-400 -mt-2 mb-2">Leave blank to fall back to the English version.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Titel (Deutsch)</label>
                    <input
                      type="text"
                      value={form.titleDe}
                      onChange={(e) => field('titleDe', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                      placeholder="Neue Koran-Kurs Anmeldung"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (Deutsch)</label>
                    <input
                      type="text"
                      value={form.slugDe}
                      onChange={(e) => field('slugDe', e.target.value.toLowerCase())}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm font-mono"
                      placeholder="neuer-koran-kurs-2026"
                    />
                    <p className="text-xs text-gray-400 mt-1">Lowercase, numbers, hyphens only.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Auszug (Deutsch)</label>
                  <input
                    type="text"
                    value={form.excerptDe}
                    onChange={(e) => field('excerptDe', e.target.value)}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                    placeholder="Kurze Zusammenfassung für Karten…"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Inhalt (Deutsch)</label>
                  <textarea
                    rows={8}
                    value={form.contentDe}
                    onChange={(e) => field('contentDe', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm resize-y"
                    placeholder="Vollständiger Beitragsinhalt auf Deutsch…"
                  />
                </div>
              </>
            )}

            {/* Arabic tab */}
            {langTab === 'ar' && (
              <>
                <p className="text-xs text-gray-400 -mt-2 mb-2">Leave blank to fall back to the English version.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">العنوان (عربي)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={form.titleAr}
                      onChange={(e) => field('titleAr', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                      placeholder="تسجيل دورة القرآن الجديدة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (Arabic)</label>
                    <input
                      type="text"
                      value={form.slugAr}
                      onChange={(e) => field('slugAr', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm font-mono"
                      placeholder="new-quran-course-ar"
                    />
                    <p className="text-xs text-gray-400 mt-1">Latin characters, numbers, hyphens only (used in URL).</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">مقتطف (عربي)</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={form.excerptAr}
                    onChange={(e) => field('excerptAr', e.target.value)}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
                    placeholder="ملخص قصير للبطاقات…"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">المحتوى (عربي)</label>
                  <textarea
                    rows={8}
                    dir="rtl"
                    value={form.contentAr}
                    onChange={(e) => field('contentAr', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm resize-y"
                    placeholder="المحتوى الكامل للمنشور بالعربية…"
                  />
                </div>
              </>
            )}

            {/* Common fields (always visible) */}
            <div className="border-t border-gray-100 pt-4 mt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Common Settings</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Publish Date</label>
                  <input
                    type="datetime-local"
                    value={form.publishedAt}
                    onChange={(e) => field('publishedAt', e.target.value)}
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

              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => field('featured', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#2B7A78]"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured (shown in banner)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => field('isPublished', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#2B7A78]"
                  />
                  <span className="text-sm font-medium text-gray-700">Published (visible to public)</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
              >
                {saving ? 'Saving…' : editingId ? 'Update Post' : 'Create Post'}
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

      {/* Posts Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#D9B574]/20">
        <div className="h-2 bg-gradient-to-r from-[#D9B574] via-[#C4A565] to-[#D9B574]" />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#D9B574]/20">
            <thead className="bg-gradient-to-r from-[#D9B574]/10 to-[#C4A565]/10">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 text-[#C4A565] cursor-pointer" />
                </th>
                {['Title / Slug', 'Langs', 'Type', 'Featured', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9B574]/10">
              {posts.map((post, index) => (
                <tr
                  key={post.id}
                  className={`hover:bg-[#D9B574]/5 transition-colors ${selected.has(post.id) ? 'bg-[#D9B574]/10' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                >
                  <td className="px-4 py-4">
                    <input type="checkbox" checked={selected.has(post.id)} onChange={() => toggleOne(post.id)} className="w-4 h-4 rounded border-gray-300 text-[#C4A565] cursor-pointer" />
                  </td>
                  <td className="px-4 py-4 max-w-[220px]">
                    <div className="font-semibold text-gray-900 truncate">{post.title}</div>
                    <div className="text-xs text-gray-400 font-mono truncate">/{post.slug}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-bold">EN</span>
                      {post.titleDe && <span className="text-xs px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 font-bold">DE</span>}
                      {post.titleAr && <span className="text-xs px-1.5 py-0.5 rounded bg-orange-50 text-orange-600 font-bold">AR</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${TYPE_COLORS[post.type]}`}>
                      {post.type.charAt(0) + post.type.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleFeatured(post)}
                      className={`px-2 py-1 text-xs font-bold rounded-full transition-all ${
                        post.featured
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {post.featured ? 'Featured' : 'Normal'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => togglePublish(post)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                        post.isPublished
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {post.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      : new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(post)}
                        className="px-3 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deleting === post.id}
                        className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg text-sm font-bold hover:shadow-lg disabled:opacity-50 transition-all"
                      >
                        {deleting === post.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-16 bg-white/90 rounded-2xl shadow-xl border-2 border-[#D9B574]/20 mt-4">
          <div className="text-5xl mb-4">📰</div>
          <p className="text-gray-600 text-lg mb-4">No posts yet</p>
          <p className="text-gray-400 text-sm mb-6">Create your first news post, announcement, or offer.</p>
          <button
            onClick={startCreate}
            className="px-8 py-4 bg-gradient-to-br from-[#D9B574] to-[#C4A565] text-white rounded-xl font-bold hover:shadow-2xl transition-all"
          >
            Add Your First Post
          </button>
        </div>
      )}
    </div>
  );
}
