'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Check, Upload, X } from 'lucide-react';
import Image from 'next/image';

interface UserOption {
  id: string;         // User.id
  profileId: string;  // Teacher.id or Student.id
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
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  };

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

export default function CreateCoursePage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [teachers, setTeachers] = useState<UserOption[]>([]);
  const [students, setStudents] = useState<UserOption[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Image upload state
  const [imageUrl, setImageUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState('');
  const imageInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users?limit=200');
        const data = await res.json();
        if (data.success) {
          const all = data.data.users as any[];
          setTeachers(
            all
              .filter((u) => u.role === 'TEACHER' && u.teacher?.id)
              .map((u) => ({ id: u.id, profileId: u.teacher.id, name: u.name || u.email, email: u.email }))
          );
          setStudents(
            all
              .filter((u) => u.role === 'STUDENT' && u.student?.id)
              .map((u) => ({ id: u.id, profileId: u.student.id, name: u.name || u.email, email: u.email }))
          );
        }
      } catch {
        // non-fatal
      }
    };
    fetchUsers();
  }, []);

  async function handleImageUpload(file: File) {
    if (!file) return;
    setImageUploading(true);
    setImageError('');
    try {
      // 1. Get presigned URL
      const signedRes = await fetch('/api/upload/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          folder: 'courses',
        }),
      });
      const signedData = await signedRes.json();
      if (!signedData.success) {
        setImageError(signedData.error || 'Failed to get upload URL');
        return;
      }

      // 2. Upload directly to S3
      const uploadRes = await fetch(signedData.data.url, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!uploadRes.ok) {
        setImageError('Upload to storage failed');
        return;
      }

      setImageUrl(signedData.data.publicUrl || signedData.data.key);
    } catch {
      setImageError('Upload failed. Please try again.');
    } finally {
      setImageUploading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration: parseInt(formData.duration),
          totalSessions: parseInt(formData.totalSessions),
          teacherIds: selectedTeachers,
          studentIds: selectedStudents,
          image: imageUrl || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/${locale}/admin/courses`);
      } else {
        setError(result.error || 'Failed to create course');
        setIsLoading(false);
      }
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const field = (key: keyof typeof formData, value: string | boolean) =>
    setFormData((f) => ({ ...f, [key]: value }));

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
        <p className="text-gray-600 mt-2">Add a new course and assign teachers and students</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Course names ─────────────────────────────── */}
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
                  placeholder="Quran for Kids"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name (Arabic)</label>
                <input
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => field('nameAr', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                  placeholder="القرآن للأطفال"
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
                  placeholder="Koran für Kinder"
                />
              </div>
            </div>
          </div>

          {/* ── Descriptions ─────────────────────────────── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100">
              Descriptions
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description (English) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => field('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40 resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description (Arabic)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionAr}
                    onChange={(e) => field('descriptionAr', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40 resize-none"
                    dir="rtl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description (German)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descriptionDe}
                    onChange={(e) => field('descriptionDe', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Course details ────────────────────────────── */}
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
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => field('price', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                  placeholder="99.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (min) *</label>
                <input
                  type="number"
                  required
                  value={formData.duration}
                  onChange={(e) => field('duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                  placeholder="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Sessions *</label>
                <input
                  type="number"
                  required
                  value={formData.totalSessions}
                  onChange={(e) => field('totalSessions', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                  placeholder="12"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Level</label>
                <input
                  type="text"
                  value={formData.level}
                  onChange={(e) => field('level', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                  placeholder="Beginner, Intermediate, Advanced"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Age Group</label>
                <input
                  type="text"
                  value={formData.ageGroup}
                  onChange={(e) => field('ageGroup', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A78]/40"
                  placeholder="Kids (6-12), Adults (18+)"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => field('isActive', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#2B7A78] focus:ring-[#2B7A78]"
              />
              <span className="text-sm font-medium text-gray-700">
                Active — visible to students
              </span>
            </label>

            {/* ── Course Image Upload ─────────────────────── */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Course Image</label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
              {imageUrl ? (
                <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-gray-200">
                  <Image src={imageUrl} alt="Course image" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => { setImageUrl(''); if (imageInputRef.current) imageInputRef.current.value = ''; }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={imageUploading}
                  className="flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-[#2B7A78] hover:text-[#2B7A78] disabled:opacity-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  {imageUploading ? 'Uploading…' : 'Upload course image'}
                </button>
              )}
              {imageError && <p className="text-xs text-red-600 mt-1">{imageError}</p>}
            </div>
          </div>

          {/* ── Teacher & Student assignment ──────────────── */}
          <div>
            <h2 className="text-base font-semibold text-gray-800 mb-3 pb-1 border-b border-gray-100">
              Assign Teachers & Enroll Students
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <MultiSelect
                label="Assign Teachers"
                options={teachers}
                selected={selectedTeachers}
                onChange={setSelectedTeachers}
                emptyText="No teacher accounts found. Create a teacher user first."
              />
              <MultiSelect
                label="Enroll Students"
                options={students}
                selected={selectedStudents}
                onChange={setSelectedStudents}
                emptyText="No student accounts found. Create a student user first."
              />
            </div>
          </div>

          {/* ── Actions ───────────────────────────────────── */}
          <div className="flex gap-4 pt-2 border-t border-gray-100">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all"
            >
              {isLoading ? 'Creating…' : 'Create Course'}
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
