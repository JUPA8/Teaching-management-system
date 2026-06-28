'use client';

import { useState, useEffect } from 'react';
import { Settings, Save, Loader2, CheckCircle, Plus, Trash2 } from 'lucide-react';

type Settings = Record<string, string>;

interface Testimonial { name: string; text: string; role: string }

const FIELD_LABELS: Record<string, string> = {
  site_name:        'School Name',
  contact_phone:    'Phone Number',
  whatsapp_number:  'WhatsApp Number',
  contact_email:    'Contact Email',
  social_instagram: 'Instagram URL',
  social_facebook:  'Facebook URL',
};

export default function AdminSettingsPage() {
  const [settings, setSettings]         = useState<Settings>({});
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [saved, setSaved]               = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setSettings(d.data);
          try {
            const t = JSON.parse(d.data.testimonials || '[]');
            setTestimonials(Array.isArray(t) ? t : []);
          } catch { setTestimonials([]); }
        }
      })
      .catch(() => setError('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  function updateField(key: string, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  function addTestimonial() {
    setTestimonials(prev => [...prev, { name: '', text: '', role: '' }]);
  }
  function removeTestimonial(i: number) {
    setTestimonials(prev => prev.filter((_, idx) => idx !== i));
  }
  function updateTestimonial(i: number, field: keyof Testimonial, value: string) {
    setTestimonials(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  }

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const body: Settings = {
        ...Object.fromEntries(
          Object.entries(FIELD_LABELS).map(([k]) => [k, settings[k] ?? ''])
        ),
        booking_enabled:   settings['booking_enabled']   ?? 'true',
        trial_class_price: settings['trial_class_price'] ?? '0',
        testimonials: JSON.stringify(testimonials),
      };
      const res  = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch { setError('Network error. Please try again.'); }
    finally { setSaving(false); }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-[#2B7A78] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#2B7A78]" />
            Site Settings
          </h1>
          <p className="text-gray-500 mt-1">Changes take effect immediately across the application.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      )}

      {/* General Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
        <h2 className="font-bold text-gray-800 text-base border-b border-gray-100 pb-3">General Information</h2>
        {Object.entries(FIELD_LABELS).map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
            <input
              type={key === 'contact_email' ? 'email' : (key === 'social_instagram' || key === 'social_facebook') ? 'url' : 'text'}
              value={settings[key] ?? ''}
              onChange={e => updateField(key, e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#2B7A78]/30 focus:border-[#2B7A78] outline-none"
            />
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="font-bold text-gray-800 text-base">Student Testimonials</h2>
          <button
            type="button"
            onClick={addTestimonial}
            className="flex items-center gap-1.5 text-sm text-[#2B7A78] font-semibold hover:underline"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {testimonials.length === 0 && (
          <p className="text-sm text-gray-400 py-2">No testimonials yet. Click Add to create one.</p>
        )}

        {testimonials.map((t, i) => (
          <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => removeTestimonial(i)}
              className="absolute top-3 right-3 text-gray-300 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
                <input
                  value={t.name}
                  onChange={e => updateTestimonial(i, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2B7A78]/30"
                  placeholder="Student name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Role / Course</label>
                <input
                  value={t.role}
                  onChange={e => updateTestimonial(i, 'role', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2B7A78]/30"
                  placeholder="e.g. Quran Student"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Testimonial Text</label>
              <textarea
                rows={2}
                value={t.text}
                onChange={e => updateTestimonial(i, 'text', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#2B7A78]/30 resize-none"
                placeholder="What the student said…"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2B7A78] to-[#D9B574] text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
