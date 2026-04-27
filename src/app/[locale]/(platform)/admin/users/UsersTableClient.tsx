'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  isVerified: boolean;
};

async function bulkAction(action: string, ids: string[]): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/admin/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resource: 'users', action, ids }),
  });
  return res.json();
}

export default function UsersTableClient({ users, locale }: { users: UserRow[]; locale: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const allIds = users.map((u) => u.id);
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

  const runBulk = useCallback(async (action: string, label: string) => {
    if (selected.size === 0) return;
    if (!confirm(`${label} ${selected.size} user(s)? This cannot be undone.`)) return;
    setBusy(true);
    const result = await bulkAction(action, Array.from(selected));
    setBusy(false);
    if (result.success) {
      showToast(`${label} applied to ${selected.size} user(s).`, true);
      setSelected(new Set());
      router.refresh();
    } else {
      showToast(result.error || 'Action failed', false);
    }
  }, [selected, router]);

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold transition-all ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Bulk actions bar */}
      {someSelected && (
        <div className="mb-4 flex items-center gap-3 bg-white rounded-xl shadow-sm border border-[#2B7A78]/20 px-5 py-3">
          <span className="text-sm font-bold text-[#2B7A78]">{selected.size} selected</span>
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => runBulk('activate', 'Activate')}
              disabled={busy}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-all"
            >
              Activate
            </button>
            <button
              onClick={() => runBulk('deactivate', 'Deactivate')}
              disabled={busy}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-bold hover:bg-yellow-700 disabled:opacity-50 transition-all"
            >
              Deactivate
            </button>
            <button
              onClick={() => runBulk('delete', 'Delete')}
              disabled={busy}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all"
            >
              Delete selected
            </button>
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600">
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#D9B574]/20">
        <div className="h-2 bg-gradient-to-r from-[#2B7A78] via-[#D9B574] to-[#2B7A78]" />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#D9B574]/20">
            <thead className="bg-gradient-to-r from-[#2B7A78]/10 to-[#D9B574]/10">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#2B7A78] cursor-pointer"
                  />
                </th>
                {['Name', 'Email', 'Role', 'Phone', 'Status', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-bold text-[#2B7A78] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9B574]/10">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className={`hover:bg-gradient-to-r hover:from-[#2B7A78]/5 hover:to-[#D9B574]/5 transition-colors ${
                    selected.has(user.id) ? 'bg-[#2B7A78]/5' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(user.id)}
                      onChange={() => toggleOne(user.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#2B7A78] cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#2B7A78] to-[#D9B574] rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white font-bold text-sm">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{user.name || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${
                      user.role === 'ADMIN' ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white' :
                      user.role === 'TEACHER' ? 'bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white' :
                      'bg-gradient-to-r from-green-500 to-green-700 text-white'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user.isVerified ? 'Active' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <Link href={`/${locale}/admin/users/${user.id}`} className="px-4 py-2 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-lg hover:shadow-lg transition-all font-semibold">View</Link>
                      <Link href={`/${locale}/admin/users/${user.id}/edit`} className="px-4 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg hover:shadow-lg transition-all font-semibold">Edit</Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#D9B574]/20">
          <p className="text-gray-600 text-lg mb-6">No users found</p>
          <Link href={`/${locale}/admin/users/create`} className="inline-block px-8 py-4 bg-gradient-to-br from-[#2B7A78] to-[#1d5856] text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg">
            Create Your First User
          </Link>
        </div>
      )}
    </div>
  );
}
