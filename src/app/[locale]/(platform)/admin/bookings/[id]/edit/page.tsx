'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'] as const;

interface BookingData {
  id: string;
  status: string;
  scheduledAt: string;
  endTime: string;
  meetingLink: string | null;
  notes: string | null;
  adminNotes: string | null;
  cancelReason: string | null;
  course: { name: string; duration: number };
  student: { user: { name: string | null; email: string } };
  teacher: { user: { name: string | null; email: string } };
}

export default function EditBookingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    status: '',
    scheduledAt: '',
    meetingLink: '',
    notes: '',
    adminNotes: '',
    cancelReason: '',
  });

  const fetchBooking = useCallback(async () => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`);
      const data = await res.json();
      if (data.success) {
        const b: BookingData = data.data;
        setBooking(b);
        // datetime-local needs format "YYYY-MM-DDTHH:mm"
        const localDt = new Date(b.scheduledAt);
        const pad = (n: number) => String(n).padStart(2, '0');
        const localStr = `${localDt.getFullYear()}-${pad(localDt.getMonth() + 1)}-${pad(localDt.getDate())}T${pad(localDt.getHours())}:${pad(localDt.getMinutes())}`;
        setForm({
          status: b.status,
          scheduledAt: localStr,
          meetingLink: b.meetingLink ?? '',
          notes: b.notes ?? '',
          adminNotes: b.adminNotes ?? '',
          cancelReason: b.cancelReason ?? '',
        });
      } else {
        setError(data.error || 'Booking not found');
      }
    } catch {
      setError('Failed to load booking');
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload: Record<string, string> = { status: form.status };
    if (form.scheduledAt) payload.scheduledAt = new Date(form.scheduledAt).toISOString();
    if (form.meetingLink) payload.meetingLink = form.meetingLink;
    payload.notes = form.notes;
    payload.adminNotes = form.adminNotes;
    if (form.status === 'CANCELLED' && form.cancelReason) {
      payload.cancelReason = form.cancelReason;
    }

    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Booking updated successfully!');
        setTimeout(() => router.push(`/${locale}/admin/bookings/${bookingId}`), 1000);
      } else {
        setError(data.error || 'Failed to update');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#2B7A78] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-700">{error || 'Booking not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <a
          href={`/${locale}/admin/bookings/${bookingId}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Booking
        </a>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Booking</h1>
        <p className="text-gray-500 mt-1">
          {booking.course.name} — {booking.student.user.name ?? booking.student.user.email} with{' '}
          {booking.teacher.user.name ?? booking.teacher.user.email}
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Cancellation reason */}
        {form.status === 'CANCELLED' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Cancellation Reason
            </label>
            <textarea
              rows={2}
              value={form.cancelReason}
              onChange={(e) => setForm({ ...form, cancelReason: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40 resize-none"
              placeholder="Why is this booking being cancelled?"
            />
          </div>
        )}

        {/* Scheduled time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Scheduled Date & Time
          </label>
          <input
            type="datetime-local"
            value={form.scheduledAt}
            onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
          />
          <p className="text-xs text-gray-400 mt-1">
            Session duration: {booking.course.duration} minutes
          </p>
        </div>

        {/* Meeting link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Meeting Link <span className="text-gray-400">(Zoom / Google Meet)</span>
          </label>
          <input
            type="url"
            value={form.meetingLink}
            onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            placeholder="https://zoom.us/j/..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40 resize-none"
            placeholder="Visible to teacher and student"
          />
        </div>

        {/* Admin notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Admin Notes <span className="text-gray-400">(internal only)</span>
          </label>
          <textarea
            rows={2}
            value={form.adminNotes}
            onChange={(e) => setForm({ ...form, adminNotes: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40 resize-none"
            placeholder="Internal admin notes"
          />
        </div>

        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <a
            href={`/${locale}/admin/bookings/${bookingId}`}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
