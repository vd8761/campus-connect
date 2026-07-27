'use client';

import React, { useState, useMemo } from 'react';
import { Eye, X, Mail, Phone, MapPin, Calendar, BookOpen, Building2, Ticket, Search, Filter } from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';

export function ParticipantsTable({ registrations }: { registrations: any[] }) {
  const [selectedReg, setSelectedReg] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');

  // Extract unique events for the filter dropdown
  const uniqueEvents = useMemo(() => {
    const eventsMap = new Map();
    registrations.forEach(reg => {
      if (!eventsMap.has(reg.eventId)) {
        eventsMap.set(reg.eventId, { id: reg.eventId, title: reg.event.title });
      }
    });
    return Array.from(eventsMap.values());
  }, [registrations]);

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      // Search matching
      const query = searchQuery.toLowerCase();
      const name = (reg.participant.fullName || `${reg.participant.firstName} ${reg.participant.lastName}`).toLowerCase();
      const email = (reg.participant.email || '').toLowerCase();
      const phone = (reg.participant.mobile || reg.participant.phone || '').toLowerCase();
      
      const matchesSearch = !query || name.includes(query) || email.includes(query) || phone.includes(query);
      
      // Event matching
      const matchesEvent = eventFilter === 'all' || reg.eventId === eventFilter;

      return matchesSearch && matchesEvent;
    });
  }, [registrations, searchQuery, eventFilter]);

  return (
    <div className="space-y-6">
      {/* Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="relative w-full sm:w-auto min-w-[250px] z-10">
          <SearchableDropdown
            options={[
              { id: 'all', name: 'All Events' },
              ...uniqueEvents.map(event => ({ id: event.id, name: event.title }))
            ]}
            value={eventFilter}
            onChange={(val) => setEventFilter(val)}
            placeholder="All Events"
            icon={Filter}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-brand-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 text-brand-muted text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Event</th>
                <th className="px-6 py-4 font-medium">Date Registered</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-navy">
                      {reg.participant.fullName || `${reg.participant.firstName} ${reg.participant.lastName}`}
                    </td>
                    <td className="px-6 py-4 text-brand-muted">{reg.participant.email}</td>
                    <td className="px-6 py-4 text-brand-muted">{reg.participant.mobile || reg.participant.phone}</td>
                    <td className="px-6 py-4 text-brand-muted max-w-[200px] truncate">{reg.event.title}</td>
                    <td className="px-6 py-4 text-brand-muted">{new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedReg(reg)}
                        className="p-2 text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-brand-muted">No participants found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedReg(null)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Section with Gradient Background */}
            <div className="relative bg-brand-navy p-8 md:p-10 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>
              
              <button 
                onClick={() => setSelectedReg(null)} 
                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>

              <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl font-heading font-bold">{selectedReg.participant.fullName || `${selectedReg.participant.firstName} ${selectedReg.participant.lastName}`}</h2>
                    <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-sm">
                      {selectedReg.participant.category || 'Student'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg"><Mail size={16} className="text-brand-turquoise" /> {selectedReg.participant.email}</div>
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg"><Phone size={16} className="text-brand-turquoise" /> {selectedReg.participant.mobile || selectedReg.participant.phone || '-'}</div>
                    {selectedReg.participant.gender && (
                       <div className="flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-lg">
                         <span className="text-brand-turquoise font-bold">Gender:</span> {selectedReg.participant.gender}
                       </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div className="p-8 md:p-10 max-h-[70vh] overflow-y-auto bg-gray-50/50">
              
              {/* Event Reg Card */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-purple to-brand-turquoise text-white flex items-center justify-center shadow-lg shadow-brand-purple/20">
                    <Ticket size={28} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registered Event</div>
                    <div className="font-bold text-brand-navy text-xl">{selectedReg.event.title}</div>
                  </div>
                </div>
                <div className="md:text-right bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registration Date</div>
                  <div className="font-bold text-brand-navy flex items-center gap-2">
                    <Calendar size={18} className="text-brand-purple" />
                    {new Date(selectedReg.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Two Column Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Educational Profile */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-navy flex items-center gap-2 pb-4 border-b border-gray-200">
                    <BookOpen size={20} className="text-brand-purple" />
                    Educational Profile
                  </h3>
                  <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Board</div>
                      <div className="font-semibold text-brand-navy text-lg">{selectedReg.participant.board || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">School Level</div>
                      <div className="font-semibold text-brand-navy text-lg">{selectedReg.participant.schoolLevel || '-'}</div>
                    </div>
                    {selectedReg.participant.stream && (
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Stream</div>
                        <div className="font-semibold text-brand-navy text-lg">{selectedReg.participant.stream}</div>
                      </div>
                    )}
                    {selectedReg.participant.currentStandard && (
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Standard</div>
                        <div className="font-semibold text-brand-navy text-lg">{selectedReg.participant.currentStandard}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Institution Details */}
                <div className="space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-brand-navy flex items-center gap-2 pb-4 border-b border-gray-200">
                    <Building2 size={20} className="text-brand-purple" />
                    Institution Details
                  </h3>
                  <div className="space-y-8">
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Institution Name</div>
                      <div className="font-semibold text-brand-navy text-lg">{selectedReg.participant.organization?.name || '-'}</div>
                    </div>
                    
                    <div className="flex gap-3 items-start bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                      <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                        <MapPin size={20} className="text-brand-turquoise" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">City</div>
                        <div className="font-semibold text-brand-navy text-base mb-2">{selectedReg.participant.organization?.city || '-'}</div>
                        
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 border-t border-gray-100 pt-2 mt-2">Full Address</div>
                        <div className="text-sm text-gray-600 leading-relaxed font-medium">{selectedReg.participant.organization?.address || '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 md:p-8 border-t border-gray-100 bg-white flex justify-end">
              <button 
                onClick={() => setSelectedReg(null)}
                className="px-8 py-3 bg-gray-100 text-brand-navy font-bold rounded-xl hover:bg-gray-200 transition-all shadow-sm active:scale-95"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
