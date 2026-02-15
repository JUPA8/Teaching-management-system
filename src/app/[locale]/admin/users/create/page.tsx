'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CreateUserPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'STUDENT',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/${locale}/admin/users`);
      } else {
        setError(result.error || 'Failed to create user');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Islamic Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-1 w-16 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2B7A78] to-[#D9B574] bg-clip-text text-transparent">
            Create New User
          </h1>
        </div>
        <p className="text-gray-600 ml-20">Add a new user to the system</p>
      </div>

      {/* Islamic styled form container */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2B7A78]/10 to-[#D9B574]/10 rounded-2xl blur-xl"></div>
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border-2 border-[#D9B574]/20">
          {/* Decorative top border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2B7A78] via-[#D9B574] to-[#2B7A78] rounded-t-2xl"></div>
          
          {error && (
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-xl blur-sm opacity-50"></div>
              <div className="relative p-4 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-400 rounded-xl">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-[#2B7A78] mb-3">
                <span>Name *</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#D9B574]/30 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] bg-white/80 backdrop-blur-sm transition-all"
                placeholder="John Doe"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-[#2B7A78] mb-3">
                <span>Email *</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#D9B574]/30 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] bg-white/80 backdrop-blur-sm transition-all"
                placeholder="user@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-[#2B7A78] mb-3">
                <span>Password *</span>
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#D9B574]/30 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] bg-white/80 backdrop-blur-sm transition-all"
                placeholder="Min 8 characters"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-[#2B7A78] mb-3">
                <span>Phone</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#D9B574]/30 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] bg-white/80 backdrop-blur-sm transition-all"
                placeholder="+49 123 456 789"
              />
            </div>

            {/* Role Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-[#2B7A78] mb-3">
                <span>Role *</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#D9B574]/30 rounded-xl focus:ring-2 focus:ring-[#2B7A78] focus:border-[#2B7A78] bg-white/80 backdrop-blur-sm transition-all appearance-none cursor-pointer font-semibold"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Teacher</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-[#2B7A78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Islamic divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#D9B574] to-transparent my-8"></div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="relative flex-1 group overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2B7A78] to-[#1d5856] transform group-hover:scale-105 transition-transform"></div>
                <div className="relative px-6 py-4 flex items-center justify-center gap-2">
                  <span className="text-white font-bold text-lg">
                    {isLoading ? 'Creating...' : 'Create User'}
                  </span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="relative group overflow-hidden rounded-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-600 transform group-hover:scale-105 transition-transform"></div>
                <div className="relative px-8 py-4 flex items-center justify-center gap-2">
                  <span className="text-white font-bold">Cancel</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
