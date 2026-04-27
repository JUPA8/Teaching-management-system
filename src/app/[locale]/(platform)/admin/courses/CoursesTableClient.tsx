'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DeleteCourseButton from './DeleteCourseButton';

type CourseRow = {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  duration: number;
  totalSessions: number;
  isActive: boolean;
  _count: { enrollments: number; bookings: number };
};

async function bulkAction(action: string, ids: string[]): Promise<{ success: boolean; error?: string }> {
  const res = await fetch('/api/admin/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ resource: 'courses', action, ids }),
  });
  return res.json();
}

export default function CoursesTableClient({ courses, locale }: { courses: CourseRow[]; locale: string }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  };

  const allIds = courses.map((c) => c.id);
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
    if (!confirm(`${label} ${selected.size} course(s)?`)) return;
    setBusy(true);
    const result = await bulkAction(action, Array.from(selected));
    setBusy(false);
    if (result.success) {
      showToast(`${label} applied to ${selected.size} course(s).`, true);
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
        <div className="mb-6 flex items-center gap-3 bg-white rounded-xl shadow-sm border border-green-200 px-5 py-3">
          <span className="text-sm font-bold text-green-700">{selected.size} selected</span>
          <div className="flex gap-2 ml-2">
            <button onClick={() => runBulk('activate', 'Activate')} disabled={busy} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50 transition-all">Activate</button>
            <button onClick={() => runBulk('deactivate', 'Deactivate')} disabled={busy} className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm font-bold hover:bg-yellow-700 disabled:opacity-50 transition-all">Deactivate</button>
            <button onClick={() => runBulk('delete', 'Delete')} disabled={busy} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-all">Delete selected</button>
          </div>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Clear</button>
        </div>
      )}

      {/* Select-all bar above cards */}
      {courses.length > 0 && (
        <div className="mb-3 flex items-center gap-2 px-1">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer"
          />
          <span className="text-sm text-gray-500">Select all {courses.length} courses</span>
        </div>
      )}

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="relative group">
            {/* Selection indicator */}
            {selected.has(course.id) && (
              <div className="absolute inset-0 rounded-2xl ring-2 ring-green-500 ring-offset-1 z-10 pointer-events-none" />
            )}

            {/* Glow */}
            <div className={`absolute inset-0 rounded-2xl blur-sm opacity-0 group-hover:opacity-50 transition-opacity ${course.isActive ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`} />

            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border-2 border-[#D9B574]/20 hover:shadow-2xl transition-all">
              <div className={`h-3 bg-gradient-to-r ${course.isActive ? 'from-green-500 via-[#D9B574] to-green-500' : 'from-gray-400 via-gray-500 to-gray-400'}`} />

              <div className="p-6">
                {/* Checkbox + title row */}
                <div className="flex items-start gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={selected.has(course.id)}
                    onChange={() => toggleOne(course.id)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-green-600 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900">{course.name}</h3>
                    <span className={`ml-2 px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm flex-shrink-0 ${course.isActive ? 'bg-gradient-to-r from-green-500 to-green-700 text-white' : 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{course.description}</p>
                <div className="h-px bg-gradient-to-r from-transparent via-[#D9B574] to-transparent mb-4" />

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-gray-600 font-medium">Type:</span>
                    <span className="font-bold text-[#2B7A78]">{course.type}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-gray-600 font-medium">Price:</span>
                    <span className="font-bold text-green-600">€{course.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-gray-600 font-medium">Duration:</span>
                    <span className="font-bold text-purple-600">{course.duration} min</span>
                  </div>
                  <div className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-gray-600 font-medium">Bookings:</span>
                    <span className="font-bold text-orange-600">{course._count.bookings}</span>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[#D9B574] to-transparent mb-4" />

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#2B7A78] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{course._count.enrollments}</span>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">students</span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/${locale}/admin/courses/${course.id}`} className="px-4 py-2 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold">View</Link>
                    <Link href={`/${locale}/admin/courses/${course.id}/edit`} className="px-4 py-2 bg-gradient-to-r from-[#D9B574] to-[#C4A565] text-white rounded-lg hover:shadow-lg transition-all text-sm font-bold">Edit</Link>
                    <DeleteCourseButton courseId={course.id} courseName={course.name} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#D9B574]/20">
          <p className="text-gray-600 text-lg mb-6">No courses found</p>
          <Link href={`/${locale}/admin/courses/create`} className="inline-block px-8 py-4 bg-gradient-to-br from-green-600 to-green-800 text-white rounded-xl hover:shadow-2xl transition-all font-bold text-lg">
            Create Your First Course
          </Link>
        </div>
      )}
    </div>
  );
}
