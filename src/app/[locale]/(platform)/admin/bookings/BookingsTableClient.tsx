'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DeleteBookingButton from './DeleteBookingButton';

type BookingRow = {
  id: string;
  scheduledAt: string;
  status: string;
  course: { id: string; name: string; type: string };
  student: { user: { name: string | null; email: string } };
  teacher: { user: { name: string | null; email: string } };
};

async function bulkAction(action: string, ids: string[]): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/admin/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resource: 'bookings', action, ids }),
  });
  return res.json();
}

const STATUS_STYLES: Record<string, string> = {
  CONFIRMED: 'bg-gradient-to-r from-green-500 to-green-700 text-white',
  PENDING: 'bg-gradient-to-r from-yellow-500 to-yellow-700 text-white',
  COMPLETED: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white',
  CANCELLED: 'bg-gradient-to-r from-red-500 to-red-700 text-white',
};

export default function BookingsTableClient({
  bookings,
  locale,
}: {
  bookings: BookingRow[];
  locale: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const allIds = bookings.map((b) => b.id);
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
    if (!confirm(`${label} ${selected.size} booking(s)?`)) return;
    setBusy(true);
    const result = await bulkAction(action, Array.from(selected));
    setBusy(false);
    if (result.success) {
      showToast(`${label} applied to ${selected.size} booking(s).`, true);
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
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {/* Bulk actions bar */}
      {someSelected && (
        <div className="mb-4 flex items-center gap-3 bg-white rounded-xl shadow-sm border border-[#D9B574]/30 px-5 py-3">
          <span className="text-sm font-bold text-[#C4A565]">{selected.size} selected</span>
          <div className="flex gap-2 ml-2">
            <button onClick={() => runBulk('cancel', 'Cancel')} disabled={busy} className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-bold hover:bg-yellow-700 disabled:opacity-50 transition-all">Cancel selected</button>
            <button onClick={() => runBulk('delete', 'Delete')} disabled={busy} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all">Delete selected</button>
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#D9B574]/20">
        <div className="h-2 bg-gradient-to-r from-[#D9B574] via-[#C4A565] to-[#D9B574]" />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#D9B574]/20">
            <thead className="bg-gradient-to-r from-[#D9B574]/10 to-[#C4A565]/10">
              <tr>
                <th className="px-4 py-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#C4A565] cursor-pointer"
                  />
                </th>
                {['Date & Time', 'Course', 'Student', 'Teacher', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-sm font-bold text-[#C4A565] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9B574]/10">
              {bookings.map((booking, index) => (
                <tr
                  key={booking.id}
                  className={`hover:bg-gradient-to-r hover:from-[#D9B574]/5 hover:to-[#C4A565]/5 transition-colors ${
                    selected.has(booking.id) ? 'bg-[#D9B574]/10' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected.has(booking.id)}
                      onChange={() => toggleOne(booking.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#C4A565] cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{new Date(booking.scheduledAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-600">{new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{booking.course.name}</div>
                    <div className="text-xs text-gray-600 bg-gray-100 inline-block px-2 py-1 rounded mt-1">{booking.course.type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.student.user.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{booking.student.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{booking.teacher.user.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{booking.teacher.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm ${STATUS_STYLES[booking.status] ?? 'bg-gray-400 text-white'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 flex-wrap">
                      <Link href={`/${locale}/admin/bookings/${booking.id}`} className="px-4 py-2 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold">View</Link>
                      <Link href={`/${locale}/admin/bookings/${booking.id}/edit`} className="px-4 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold">Edit</Link>
                      <DeleteBookingButton bookingId={booking.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#D9B574]/20 mt-4">
          <p className="text-gray-600 text-lg">No bookings found</p>
        </div>
      )}
    </div>
  );
}
