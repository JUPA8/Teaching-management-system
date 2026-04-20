'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2, Star } from 'lucide-react';

interface Props {
  bookingId: string;
  studentId: string;
  courseId: string;
}

export default function MarkAttendanceButton({ bookingId, studentId, courseId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<'PRESENT' | 'ABSENT' | null>(null);
  const [done, setDone] = useState<'PRESENT' | 'ABSENT' | null>(null);
  const [score, setScore] = useState('');
  const [error, setError] = useState('');

  async function mark(status: 'PRESENT' | 'ABSENT') {
    setLoading(status);
    setError('');
    try {
      // 1. Mark attendance
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

      // 2. Record grade if a score was entered
      const scoreNum = parseFloat(score.trim());
      if (score.trim() !== '' && !isNaN(scoreNum) && scoreNum >= 0 && scoreNum <= 10) {
        await fetch('/api/grades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId,
            courseId,
            bookingId,
            score: scoreNum,
            maxScore: 10,
            label: 'Session Grade',
          }),
        });
      }

      setDone(status);
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
    <div className="flex flex-col items-end gap-2">
      {/* Grade input */}
      <div className="flex items-center gap-2">
        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <input
          type="number"
          min={0}
          max={10}
          step={0.5}
          value={score}
          onChange={e => setScore(e.target.value)}
          placeholder="Grade"
          className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2B7A78]/40 text-center"
        />
        <span className="text-xs text-gray-400 whitespace-nowrap">/ 10 (opt.)</span>
      </div>

      {/* Attendance buttons */}
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
