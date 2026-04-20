'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Props {
  bookingId: string;
}

export default function MarkAttendanceButton({ bookingId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<'PRESENT' | 'ABSENT' | null>(null);
  const [done, setDone] = useState<'PRESENT' | 'ABSENT' | null>(null);
  const [error, setError] = useState('');

  async function mark(status: 'PRESENT' | 'ABSENT') {
    setLoading(status);
    setError('');
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, status }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to mark attendance');
        return;
      }
      setDone(status);
      // Refresh server component data — session moves to history
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(null);
    }
  }

  if (done) {
    return (
      <div className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg ${
        done === 'PRESENT' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
      }`}>
        {done === 'PRESENT' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {done === 'PRESENT' ? 'Attended' : 'Absent'} — saved
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-2">
        <button
          onClick={() => mark('PRESENT')}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {loading === 'PRESENT' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          Attended
        </button>
        <button
          onClick={() => mark('ABSENT')}
          disabled={!!loading}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-400 text-white text-sm font-semibold rounded-lg hover:bg-red-500 disabled:opacity-50 transition-colors"
        >
          {loading === 'ABSENT' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          Absent
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
