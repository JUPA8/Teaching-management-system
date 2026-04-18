'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course? This cannot be undone.')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete course');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold disabled:opacity-50"
    >
      {loading ? '...' : 'Delete'}
    </button>
  );
}
