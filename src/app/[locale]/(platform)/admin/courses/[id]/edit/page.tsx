'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Check } from 'lucide-react';

interface UserOption {
  profileId: string;
  name: string;
  email: string;
}

function MultiSelect({
  label,
  options,
  selected,
  onChange,
  emptyText,
}: {
  label: string;
  options: UserOption[];
  selected: string[];
  onChange: (ids: string[]) => void;
  emptyText: string;
}) {
  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{' '}
        <span className="text-gray-400 font-normal">({selected.length} selected)</span>
      </label>
      {options.length === 0 ? (
        <p className="text-sm text-gray-400 italic py-3">{emptyText}</p>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
          {options.map((opt) => {
            const active = selected.includes(opt.profileId);
            return (
              <button
                key={opt.profileId}
                type="button"
                onClick={() => toggle(opt.profileId)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 last:border-0 ${
                  active ? 'bg-[#2B7A78]/10' : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    active ? 'bg-[#2B7A78] border-[#2B7A78]' : 'border-gray-300'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{opt.name}</p>
                  <p className="text-xs text-gray-500">{opt.email}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    nameDe: '',
    description: '',
    descriptionAr: '',
    descriptionDe: '',
    type: 'QURAN_KIDS',
    price: '',
    duration: '',
    totalSessions: '',
    level: '',
    ageGroup: '',
    isActive: true,
  });

  const [allTeachers, setAllTeachers] = useState<UserOption[]>([]);
  const [allStudents, setAllStudents] = useState<UserOption[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [courseRes, usersRes] = await Promise.all([
        fetch(`/api/courses/${id}`),
        fetch('/api/users?limit=200'),
      ]);
      const [courseData, usersData] = await Promise.all([courseRes.json(), usersRes.json()]);

      if (courseData.success) {
        const course = courseData.data;
        setFormData({
          name: course.name,
          nameAr: course.nameAr || '',
          nameDe: course.nameDe || '',
          description: course.description,
          descriptionAr: course.descriptionAr || '',
          descriptionDe: course.descriptionDe || '',
          type: course.type,
          price: course.price.toString(),
          duration: course.duration.toString(),
          totalSessions: course.totalSessions.toString(),
          level: course.level || '',
          ageGroup: course.ageGroup || '',
          isActive: course.isActive,
        });
        // Pre-select existing teachers and enrolled students
        setSelectedTeachers((course.teachers ?? []).map((ct: any) => ct.teacher?.id).filter(Boolean));
        setSelectedStudents((course.enrollments ?? []).map((ce: any) => ce.student?.id).filter(Boolean));
      }

      if (usersData.success) {
        const all = usersData.data.users as any[];
        setAllTeachers(
          all
            .filter((u) => u.role === 'TEACHER' && u.teacher?.id)
            .map((u) => ({ profileId: u.teacher.id, name: u.name || u.email, email: u.email }))
        );
        setAllStudents(
          all
            .filter((u) => u.role === 'STUDENT' && u.student?.id)
            .map((u) => ({ profileId: u.student.id, name: u.name || u.email, email: u.email }))
        );
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setIsFetching(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          totalSessions: parseInt(formData.totalSessions),
          teacherIds: selectedTeachers,
          studentIds: selectedStudents,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Course updated successfully!');
        setTimeout(() => router.push(`/${locale}/admin/courses/${id}`), 1000);
      } else {
        setError(result.error || 'Failed to update course');
        setIsLoading(false);
      }
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const field = (key: keyof typeof formData, value: string | boolean) =>
    setFormData((f) => ({ ...f, [key]: value }));

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#2B7A78] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Course</h1>
        <p className="text-gray-600 mt-2">Update course information, teachers, and enrolled students</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Names ─────────────────────────────────── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100">
              Course Names
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name (English) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => field('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name (Arabic)</label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => field('nameAr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name (German)</label>
                <input
                  type="text"
                  value={formData.nameDe}
                  onChange={(e) => field('nameDe', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                />
              </div>
            </div>
          </div>

          {/* ── Descriptions ─────────────────────────── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100">
              Descriptions
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (English) *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => field('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (Arabic)</label>
                <textarea
                  rows={3}
                  value={formData.descriptionAr}
                  onChange={(e) => field('descriptionAr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40 resize-none"
                  dir="rtl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (German)</label>
                <textarea
                  rows={3}
                  value={formData.descriptionDe}
                  onChange={(e) => field('descriptionDe', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40 resize-none"
                />
              </div>
            </div>
          </div>

          {/* ── Details ──────────────────────────────── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100">
              Course Details
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => field('type', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                >
                  <option value="QURAN_KIDS">Quran Kids</option>
                  <option value="QURAN_ADULTS">Quran Adults</option>
                  <option value="ARABIC_LANGUAGE">Arabic Language</option>
                  <option value="ISLAMIC_STUDIES">Islamic Studies</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (€) *</label>
                <input type="number" step="0.01" required value={formData.price}
                  onChange={(e) => field('price', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (min) *</label>
                <input type="number" required value={formData.duration}
                  onChange={(e) => field('duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sessions *</label>
                <input type="number" required value={formData.totalSessions}
                  onChange={(e) => field('totalSessions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                <input type="text" value={formData.level}
                  onChange={(e) => field('level', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Age Group</label>
                <input type="text" value={formData.ageGroup}
                  onChange={(e) => field('ageGroup', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40" />
              </div>
            </div>
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input type="checkbox" checked={formData.isActive}
                onChange={(e) => field('isActive', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#2B7A78] focus:ring-[#2B7A78]" />
              <span className="text-sm font-medium text-gray-700">Active — visible to students</span>
            </label>
          </div>

          {/* ── Teachers & Students ───────────────────── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100">
              Teachers & Enrolled Students
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <MultiSelect
                label="Assigned Teachers"
                options={allTeachers}
                selected={selectedTeachers}
                onChange={setSelectedTeachers}
                emptyText="No teacher accounts found."
              />
              <MultiSelect
                label="Enrolled Students"
                options={allStudents}
                selected={selectedStudents}
                onChange={setSelectedStudents}
                emptyText="No student accounts found."
              />
            </div>
          </div>

          {/* ── Actions ──────────────────────────────── */}
          <div className="flex gap-4 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
