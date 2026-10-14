'use client';

import React, { useState, useMemo } from 'react';
import { Eye, X, Mail, Phone, MapPin, Calendar, BookOpen, Building2, Ticket, Search, Filter, Download } from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { Button } from '@/components/ui/Button';

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
      const name = (reg.participant.fullName || '').toLowerCase();
      const email = (reg.participant.email || '').toLowerCase();
      const phone = (reg.participant.mobile || '').toLowerCase();
      
      const matchesSearch = !query || name.includes(query) || email.includes(query) || phone.includes(query);
      
      // Event matching
      const matchesEvent = eventFilter === 'all' || reg.eventId === eventFilter;

      return matchesSearch && matchesEvent;
    });
  }, [registrations, searchQuery, eventFilter]);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Gender', 'Board', 'School Level', 'Stream', 'Standard', 'Institution', 'City', 'Event', 'Registered On'];
    const rows = filteredRegistrations.map(reg => [
      reg.participant.fullName || '',
      reg.participant.email || '',
      reg.participant.mobile || '',
      reg.participant.gender || '',
      reg.participant.board || '',
      reg.participant.schoolLevel || '',
      reg.participant.stream || '',
      reg.participant.currentStandard || '',
      reg.participant.organization?.name || '',
      reg.participant.organization?.city || '',
      reg.event.title || '',
      new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `participants-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3 min-w-0">
      {/* Search, Filter & Export Toolbar */}
      <div className="flex flex-wrap gap-2 justify-between items-center bg-white p-3 rounded-xl border border-brand-border shadow-sm">
        <div className="relative min-w-0 flex-1 max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            className="w-full h-11 pl-9 pr-3 text-sm border border-brand-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/15 focus:border-brand-purple transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative z-10 w-48 sm:w-52">
            <SearchableDropdown
              options={[
                { id: 'all', name: 'All Events' },
                ...uniqueEvents.map(event => ({ id: event.id, name: event.title }))
              ]}
              value={eventFilter}
              onChange={(val) => setEventFilter(val)}
              placeholder="All Events"
              icon={Filter}
              align="right"
              className="w-full"
            />
          </div>
          <Button variant="outline" onClick={exportCSV} className="h-11 flex items-center gap-1.5 shrink-0 text-sm px-4 rounded-xl border-brand-border/80">
            <Download size={14} />
            Export CSV
            {filteredRegistrations.length < registrations.length && (
              <span className="ml-1 bg-brand-purple text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{filteredRegistrations.length}</span>
            )}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-brand-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-sm">
            <thead className="bg-gray-50 text-brand-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Phone</th>
                <th className="px-4 py-3 font-medium">Event</th>
                <th className="px-4 py-3 font-medium">Date Registered</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map(reg => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-brand-navy max-w-[240px] truncate" title={reg.participant.fullName}>
                      {reg.participant.fullName}
                    </td>
                    <td className="px-4 py-3 text-brand-muted max-w-[280px] truncate" title={reg.participant.email || ''}>{reg.participant.email}</td>
                    <td className="px-4 py-3 text-brand-muted">{reg.participant.mobile}</td>
                    <td className="px-4 py-3 text-brand-muted max-w-[240px] truncate" title={reg.event.title}>{reg.event.title}</td>
                    <td className="px-4 py-3 text-brand-muted">{new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => setSelectedReg(reg)}
                        className="p-1.5 text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-brand-muted">No participants found.</td>
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
            <div className="relative bg-brand-navy p-5 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>
              
              <button 
                onClick={() => setSelectedReg(null)} 
                className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-heading font-bold">{selectedReg.participant.fullName}</h2>
                  <span className="bg-white/10 border border-white/20 text-white px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    {selectedReg.participant.category || 'Student'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs font-medium">
                  <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg"><Mail size={13} className="text-brand-turquoise" /> {selectedReg.participant.email}</div>
                  <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg"><Phone size={13} className="text-brand-turquoise" /> {selectedReg.participant.mobile || '-'}</div>
                  {selectedReg.participant.gender && (
                    <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
                      <span className="text-brand-turquoise font-bold">Gender:</span> {selectedReg.participant.gender}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Body Section */}
            <div className="p-5 max-h-[65vh] overflow-y-auto bg-gray-50/50">
              
              {/* Event Reg Card */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-turquoise text-white flex items-center justify-center shadow-md shadow-brand-purple/20">
                    <Ticket size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Registered Event</div>
                    <div className="font-bold text-brand-navy text-sm">{selectedReg.event.title}</div>
                  </div>
                </div>
                <div className="sm:text-right bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Registration Date</div>
                  <div className="font-semibold text-brand-navy text-sm flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-purple" />
                    {new Date(selectedReg.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              {/* Two Column Details */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Shared header row - both titles on same line */}
                <div className="grid grid-cols-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 px-4 py-3 border-r border-gray-100">
                    <BookOpen size={13} className="text-brand-purple shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-navy">Educational Profile</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3">
                    <Building2 size={13} className="text-brand-purple shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-navy">Institution Details</span>
                  </div>
                </div>

                {/* Content row */}
                <div className="grid grid-cols-2 divide-x divide-gray-100">
                  {/* Educational Profile content */}
                  <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-3 content-start">
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Board</div>
                      <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant.board || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">School Level</div>
                      <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant.schoolLevel || '-'}</div>
                    </div>
                    {selectedReg.participant.stream && (
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Stream</div>
                        <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant.stream}</div>
                      </div>
                    )}
                    {selectedReg.participant.currentStandard && (
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Standard</div>
                        <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant.currentStandard}</div>
                      </div>
                    )}
                  </div>

                  {/* Institution Details content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Institution Name</div>
                      <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant.organization?.name || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">City</div>
                      <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant.organization?.city || '-'}</div>
                    </div>
                    {selectedReg.participant.organization?.address && (
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Full Address</div>
                        <div className="text-xs text-gray-600 leading-relaxed">{selectedReg.participant.organization.address}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-white flex justify-end">
              <button 
                onClick={() => setSelectedReg(null)}
                className="px-6 py-2 bg-gray-100 text-brand-navy font-bold text-sm rounded-lg hover:bg-gray-200 transition-all shadow-sm active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
