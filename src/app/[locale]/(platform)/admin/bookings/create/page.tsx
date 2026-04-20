'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Users, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

type User = { id: string; name: string | null; email: string; role: string; student?: { id: string }; teacher?: { id: string } };

export default function CreateBookingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [isLoading, setIsLoading]           = useState(false);
  const [error, setError]                   = useState('');
  const [success, setSuccess]               = useState('');
  const [courses, setCourses]               = useState<any[]>([]);
  const [students, setStudents]             = useState<User[]>([]);
  const [teachers, setTeachers]             = useState<User[]>([]);

  // Form state
  const [courseId, setCourseId]             = useState('');
  const [teacherId, setTeacherId]           = useState('');
  const [scheduledAt, setScheduledAt]       = useState('');
  const [notes, setNotes]                   = useState('');

  // Bulk student selection
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen]             = useState(false);

  // Recurrence
  const [recurrenceWeeks, setRecurrenceWeeks] = useState(0);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [cr, ur] = await Promise.all([
        fetch('/api/courses?limit=100'),
        fetch('/api/users?limit=200'),
      ]);
      const cd = await cr.json();
      const ud = await ur.json();
      if (cd.success) setCourses(cd.data.courses);
      if (ud.success) {
        const all: User[] = ud.data.users;
        setStudents(all.filter(u => u.role === 'STUDENT' && u.student?.id) as User[]);
        setTeachers(all.filter(u => u.role === 'TEACHER' && u.teacher?.id) as User[]);
      }
    } catch { setError('Failed to load data'); }
  }

  function toggleStudent(id: string) {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (selectedStudentIds.length === 0) {
      setError('Please select at least one student.');
      return;
    }

    setIsLoading(true);
    try {
      const body: Record<string, unknown> = {
        courseId,
        teacherId,
        scheduledAt: new Date(scheduledAt).toISOString(),
        notes: notes || undefined,
        recurrenceWeeks,
        studentIds: selectedStudentIds,
      };

      const res  = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        const count = Array.isArray(data.data) ? data.data.length : 1;
        setSuccess(`${count} booking${count !== 1 ? 's' : ''} created successfully!`);
        setTimeout(() => router.push(`/${locale}/admin/bookings`), 1200);
      } else {
        setError(data.error || 'Failed to create booking');
        setIsLoading(false);
      }
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }

  const totalSessions = recurrenceWeeks + 1;
  const totalBookings = totalSessions * Math.max(selectedStudentIds.length, 1);

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Booking</h1>
        <p className="text-gray-600 mt-2">Schedule one or more sessions for one or multiple students.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Course *</label>
            <select
              required
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
            >
              <option value="">Select a course</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name} — €{c.price}</option>
              ))}
            </select>
          </div>

          {/* Teacher */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Teacher *</label>
            <select
              required
              value={teacherId}
              onChange={e => setTeacherId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
            >
              <option value="">Select a teacher</option>
              {teachers.map(t => (
                <option key={(t as any).teacher.id} value={(t as any).teacher.id}>
                  {t.name || t.email}
                </option>
              ))}
            </select>
          </div>

          {/* Students — multi-select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Students * <span className="text-gray-400 font-normal">(select one or more)</span>
            </label>
            <button
              type="button"
              onClick={() => setBulkOpen(o => !o)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-left flex items-center justify-between hover:border-[#2B7A78] transition-colors"
            >
              <span className="flex items-center gap-2 text-gray-700">
                <Users className="w-4 h-4 text-gray-400" />
                {selectedStudentIds.length === 0
                  ? 'Click to select students'
                  : `${selectedStudentIds.length} student${selectedStudentIds.length !== 1 ? 's' : ''} selected`}
              </span>
              {bulkOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {bulkOpen && (
              <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <div className="p-2 bg-gray-50 border-b border-gray-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentIds(students.map(s => s.student!.id))}
                    className="text-xs px-2 py-1 bg-[#2B7A78] text-white rounded-lg"
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStudentIds([])}
                    className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-lg"
                  >
                    Clear
                  </button>
                </div>
                {students.map(s => {
                  const sid = s.student!.id;
                  const checked = selectedStudentIds.includes(sid);
                  return (
                    <label
                      key={sid}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${checked ? 'bg-[#2B7A78]/5' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleStudent(sid)}
                        className="w-4 h-4 text-[#2B7A78] rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-800">{s.name || s.email}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              First Session — Date &amp; Time *
            </label>
            <input
              type="datetime-local"
              required
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm"
            />
          </div>

          {/* Recurring */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-gray-400" />
              Recurring Weekly Sessions
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0}
                max={23}
                value={recurrenceWeeks}
                onChange={e => setRecurrenceWeeks(Number(e.target.value))}
                className="flex-1 accent-[#2B7A78]"
              />
              <span className="text-sm font-semibold text-gray-700 w-28 text-right whitespace-nowrap">
                {recurrenceWeeks === 0
                  ? 'Single session'
                  : `${totalSessions} sessions (${recurrenceWeeks}w)`}
              </span>
            </div>
            {recurrenceWeeks > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                Sessions will repeat every week for {recurrenceWeeks} additional week{recurrenceWeeks !== 1 ? 's' : ''}.
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none text-sm resize-none"
              placeholder="Optional notes for this booking…"
            />
          </div>

          {/* Summary */}
          {selectedStudentIds.length > 0 && (
            <div className="p-4 bg-[#2B7A78]/5 border border-[#2B7A78]/20 rounded-xl text-sm text-[#2B7A78]">
              <strong>{totalBookings} booking{totalBookings !== 1 ? 's' : ''}</strong> will be created:&nbsp;
              {selectedStudentIds.length} student{selectedStudentIds.length !== 1 ? 's' : ''} × {totalSessions} session{totalSessions !== 1 ? 's' : ''}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Creating…' : `Create ${totalBookings > 1 ? totalBookings + ' ' : ''}Booking${totalBookings !== 1 ? 's' : ''}`}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
