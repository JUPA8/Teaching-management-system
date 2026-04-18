'use client';

import { useState } from 'react';

export default function AdminProbestundeClient({
  initialRequests,
}: {
  initialRequests: any[];
}) {
  const [requests, setRequests] = useState(initialRequests);

  const handleMarkContacted = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/probestunde/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isContacted: true }),
      });

      if (response.ok) {
        setRequests(requests.map(r => 
          r.id === id ? { ...r, isContacted: true, contactedAt: new Date().toISOString() } : r
        ));
      }
    } catch (error) {
      console.error('Error marking as contacted:', error);
    }
  };

  const handleRevertContacted = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/probestunde/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isContacted: false }),
      });

      if (response.ok) {
        setRequests(requests.map(r => 
          r.id === id ? { ...r, isContacted: false, contactedAt: null } : r
        ));
      }
    } catch (error) {
      console.error('Error reverting contacted status:', error);
    }
  };

  return (
    <div>
      {/* Islamic Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-[#D9B574] rounded-full"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-[#D9B574] bg-clip-text text-transparent">
            Trial Class Requests
          </h1>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-3 border-2 border-[#D9B574]/20 shadow-lg">
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-gray-500 font-medium">Total:</span>
              <span className="ml-2 font-bold text-gray-900">{requests.length}</span>
            </div>
            <div className="h-full w-px bg-[#D9B574]/30"></div>
            <div>
              <span className="text-gray-500 font-medium">Pending:</span>
              <span className="ml-2 font-bold text-orange-600">{requests.filter(r => !r.isContacted).length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Islamic styled table container */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border-2 border-[#D9B574]/20">
        {/* Decorative header */}
        <div className="h-2 bg-gradient-to-r from-orange-500 via-[#D9B574] to-orange-500"></div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-[#D9B574]/20">
            <thead className="bg-gradient-to-r from-orange-50 to-[#D9B574]/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-orange-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-orange-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-orange-700 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-orange-700 uppercase tracking-wider">
                  Preferences
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-orange-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-orange-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9B574]/10">
              {requests.map((request, index) => {
                const students = request.students as any[];
                return (
                  <tr 
                    key={request.id} 
                    className={`transition-colors ${
                      !request.isContacted 
                        ? 'bg-gradient-to-r from-orange-50 to-yellow-50' 
                        : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    } hover:bg-gradient-to-r hover:from-orange-100/30 hover:to-[#D9B574]/10`}
                  >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-bold text-gray-900">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900">
                          {request.email}
                        </div>
                        <div className="text-gray-600">
                          {request.phone}
                        </div>
                        <div className="text-xs">
                          <span className={`px-2 py-1 rounded-full font-bold ${
                            request.contactMethod === 'WHATSAPP' ? 'bg-green-100 text-green-700' :
                            request.contactMethod === 'EMAIL' ? 'bg-blue-100 text-blue-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {request.contactMethod}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="bg-gradient-to-r from-[#2B7A78]/10 to-[#D9B574]/10 rounded-lg p-3">
                        <div className="font-bold text-[#2B7A78] mb-2">
                          {request.numStudents} student(s)
                        </div>
                        <div className="space-y-1">
                          {students.map((s: any, idx: number) => (
                            <div key={idx} className="text-xs text-gray-700 bg-white/60 px-2 py-1 rounded">
                              <span className="font-semibold">{s.name}</span> <span className="text-gray-500">({s.age} years)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm bg-gray-100 px-3 py-2 rounded-lg">
                        <span className="text-gray-600">Teacher:</span>
                        <span className={`ml-2 font-bold ${
                          request.teacherPreference === 'MALE' ? 'text-blue-600' :
                          request.teacherPreference === 'FEMALE' ? 'text-pink-600' :
                          'text-gray-600'
                        }`}>
                          {request.teacherPreference}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.isContacted ? (
                        <span className="px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm bg-gradient-to-r from-green-500 to-green-700 text-white flex items-center gap-1 w-fit">
                          Contacted
                        </span>
                      ) : (
                        <span className="px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex items-center gap-1 w-fit animate-pulse">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-2">
                        <a
                          href={`mailto:${request.email}?subject=Salam Institute - Trial Class Request`}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all text-xs font-bold"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Email
                        </a>
                        <a
                          href={`https://wa.me/${request.phone.replace(/\D/g, '')}`}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg hover:shadow-lg transition-all text-xs font-bold"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp
                        </a>
                        {!request.isContacted ? (
                          <button
                            onClick={() => handleMarkContacted(request.id)}
                            className="px-4 py-2 bg-gradient-to-r from-[#2B7A78] to-[#1d5856] text-white rounded-lg hover:shadow-lg transition-all text-xs font-bold"
                          >
                            Mark Contacted
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRevertContacted(request.id)}
                            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-lg hover:shadow-lg transition-all text-xs font-bold"
                          >
                            Revert
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {requests.length === 0 && (
        <div className="text-center py-16 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-[#D9B574]/20">
          <p className="text-gray-600 text-lg">No trial requests found</p>
        </div>
      )}
    </div>
  );
}
