'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteCourseButton({ courseId, courseName }: { courseId: string; courseName?: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        setError(data.error || 'Failed to delete course');
        setConfirming(false);
      }
    } catch {
      setError('Network error. Please try again.');
      setConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all"
          >
            {loading ? '…' : 'Confirm'}
          </button>
          <button
            onClick={() => { setConfirming(false); setError(''); }}
            className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 transition-all"
          >
            No
          </button>
        </div>
        {error && <p className="text-xs text-red-600 max-w-[200px] leading-snug">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={() => setConfirming(true)}
        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold"
      >
        Delete
      </button>
      {error && <p className="text-xs text-red-600 max-w-[200px] leading-snug">{error}</p>}
    </div>
  );
}
