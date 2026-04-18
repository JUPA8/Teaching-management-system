'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AttendanceFormProps {
  bookingId: string;
}

const statusOptions = [
  { value: 'PRESENT', label: 'Present', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'ABSENT', label: 'Absent', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'LATE', label: 'Late', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'EXCUSED', label: 'Excused', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;

export default function AttendanceForm({ bookingId }: AttendanceFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>('PRESENT');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status, notes: notes || undefined }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error ?? 'Failed to save');
        return;
      }
      setOpen(false);
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
      >
        Mark Attendance
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 min-w-[180px]">
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as typeof status)}
        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-1">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 text-xs font-semibold bg-blue-600 text-white rounded-lg py-1.5 hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? '…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-xs text-gray-500 px-2 hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
