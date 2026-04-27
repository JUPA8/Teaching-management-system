'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Teacher = {
  id: string;
  bio: string | null;
  gender: string;
  specializations: string[];
  languages: string[];
  yearsExperience: number | null;
  isActive: boolean;
  user: { name: string | null; image: string | null };
};

async function bulkAction(action: string, ids: string[]): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/admin/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resource: 'teachers', action, ids }),
  });
  return res.json();
}

export default function AdminTeachersPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Selection state
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  // Edit form state
  const [editBio, setEditBio] = useState('');
  const [editSpecializations, setEditSpecializations] = useState('');
  const [editLanguages, setEditLanguages] = useState('');
  const [editYears, setEditYears] = useState('');
  const [editActive, setEditActive] = useState(true);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchTeachers = useCallback(async () => {
    try {
      const res = await fetch('/api/users?role=TEACHER&limit=500');
      const data = await res.json();
      if (data.success) {
        const users = data.data.users as any[];
        const mapped: Teacher[] = users
          .filter((u: any) => u.teacher?.id)
          .map((u: any) => ({
            id: u.teacher.id,
            bio: u.teacher.bio,
            gender: u.teacher.gender,
            specializations: u.teacher.specializations ?? [],
            languages: u.teacher.languages ?? [],
            yearsExperience: u.teacher.yearsExperience ?? 0,
            isActive: u.teacher.isActive,
            user: { name: u.name, image: u.image },
          }));
        setTeachers(mapped);
      }
    } catch {
      setMessage('Failed to load teachers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  // Selection helpers
  const allIds = teachers.map((t) => t.id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const someSelected = selected.size > 0;

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const runBulk = async (action: string, label: string) => {
    if (selected.size === 0) return;
    if (!confirm(`${label} ${selected.size} teacher(s)?`)) return;
    setBulkBusy(true);
    const result = await bulkAction(action, Array.from(selected));
    setBulkBusy(false);
    if (result.success) {
      showToast(`${label} applied to ${selected.size} teacher(s).`, true);
      setSelected(new Set());
      await fetchTeachers();
    } else {
      showToast(result.error || 'Action failed', false);
    }
  };

  function startEdit(t: Teacher) {
    setEditingId(t.id);
    setEditBio(t.bio ?? '');
    setEditSpecializations(t.specializations.join(', '));
    setEditLanguages(t.languages.join(', '));
    setEditYears(String(t.yearsExperience ?? 0));
    setEditActive(t.isActive);
    setMessage('');
  }

  function cancelEdit() {
    setEditingId(null);
    setMessage('');
  }

  async function saveEdit(id: string) {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`/api/teachers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bio: editBio.trim() || null,
          specializations: editSpecializations.split(',').map((s) => s.trim()).filter(Boolean),
          languages: editLanguages.split(',').map((s) => s.trim()).filter(Boolean),
          yearsExperience: parseInt(editYears) || 0,
          isActive: editActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Teacher updated successfully!');
        setEditingId(null);
        await fetchTeachers();
      } else {
        setMessage(data.error || 'Failed to save');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
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
            Teacher Management
          </h1>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
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
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Clear</button>
        </div>
      )}

      {/* Select all */}
      {teachers.length > 0 && (
        <div className="mb-3 flex items-center gap-2 px-1">
          <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded border-gray-300 text-[#2B7A78] cursor-pointer" />
          <span className="text-sm text-gray-500">Select all {teachers.length} teachers</span>
        </div>
      )}

      <div className="space-y-4">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className={`bg-white rounded-2xl shadow-sm border p-6 transition-all ${selected.has(teacher.id) ? 'border-[#2B7A78]/40 ring-1 ring-[#2B7A78]/30' : 'border-gray-100'}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(teacher.id)}
                  onChange={() => toggleOne(teacher.id)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#2B7A78] cursor-pointer"
                />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{teacher.user.name || '—'}</h2>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">{teacher.gender}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${teacher.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {teacher.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              {editingId === teacher.id ? (
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(teacher.id)} disabled={saving} className="px-4 py-2 bg-[#2B7A78] text-white rounded-lg text-sm font-bold hover:bg-[#1d5856] disabled:opacity-50 transition-all">
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button onClick={cancelEdit} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-all">Cancel</button>
                </div>
              ) : (
                <button onClick={() => startEdit(teacher)} className="px-4 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg text-sm font-bold hover:shadow-lg transition-all">Edit</button>
              )}
            </div>

            {editingId === teacher.id ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                  <textarea rows={4} value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm resize-none" placeholder="Teacher bio…" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Specializations <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                    <input type="text" value={editSpecializations} onChange={(e) => setEditSpecializations(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm" placeholder="Tajweed, Quran, Arabic" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Languages <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                    <input type="text" value={editLanguages} onChange={(e) => setEditLanguages(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm" placeholder="English, Arabic, German" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Years of Experience</label>
                    <input type="number" min={0} max={80} value={editYears} onChange={(e) => setEditYears(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm" />
                  </div>
                  <div className="flex items-center gap-3 pt-7">
                    <input type="checkbox" id={`active-${teacher.id}`} checked={editActive} onChange={(e) => setEditActive(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-[#2B7A78]" />
                    <label htmlFor={`active-${teacher.id}`} className="text-sm font-medium text-gray-700">Active (visible on public teachers page)</label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-gray-600">
                <p><span className="font-semibold text-gray-800">Bio:</span> {teacher.bio || <span className="italic text-gray-400">Not set</span>}</p>
                <p>
                  <span className="font-semibold text-gray-800">Specializations:</span>{' '}
                  {teacher.specializations.length > 0
                    ? teacher.specializations.map((s) => <span key={s} className="inline-block px-2 py-0.5 bg-[#2B7A78]/10 text-[#2B7A78] rounded-full text-xs mr-1">{s}</span>)
                    : <span className="italic text-gray-400">None</span>}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Languages:</span>{' '}
                  {teacher.languages.length > 0
                    ? teacher.languages.map((l) => <span key={l} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs mr-1">{l}</span>)
                    : <span className="italic text-gray-400">None</span>}
                </p>
                <p><span className="font-semibold text-gray-800">Experience:</span> {teacher.yearsExperience ?? 0} years</p>
              </div>
            )}
          </div>
        ))}

        {teachers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500">No teachers found. Create teacher accounts first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
