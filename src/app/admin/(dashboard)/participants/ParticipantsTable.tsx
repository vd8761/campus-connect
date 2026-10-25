'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Eye, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Building2, 
  Ticket, 
  Search, 
  Filter, 
  Download, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  GraduationCap
} from 'lucide-react';
import { SearchableDropdown } from '@/components/ui/SearchableDropdown';
import { Button } from '@/components/ui/Button';

export function ParticipantsTable({ registrations }: { registrations: any[] }) {
  const [selectedReg, setSelectedReg] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Extract unique events for the filter dropdown
  const uniqueEvents = useMemo(() => {
    const eventsMap = new Map();
    registrations.forEach(reg => {
      if (reg.eventId && !eventsMap.has(reg.eventId)) {
        eventsMap.set(reg.eventId, { id: reg.eventId, title: reg.event?.title || 'Unknown Event' });
      }
    });
    return Array.from(eventsMap.values());
  }, [registrations]);

  // Filter registrations
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(reg => {
      const query = searchQuery.toLowerCase().trim();
      const name = (reg.participant?.fullName || '').toLowerCase();
      const email = (reg.participant?.email || '').toLowerCase();
      const phone = (reg.participant?.mobile || '').toLowerCase();
      const orgName = (reg.participant?.organization?.name || '').toLowerCase();
      const city = (reg.participant?.organization?.city || reg.participant?.city || '').toLowerCase();
      
      const matchesSearch = 
        !query || 
        name.includes(query) || 
        email.includes(query) || 
        phone.includes(query) ||
        orgName.includes(query) ||
        city.includes(query);
      
      const matchesEvent = eventFilter === 'all' || reg.eventId === eventFilter;

      return matchesSearch && matchesEvent;
    });
  }, [registrations, searchQuery, eventFilter]);

  // Reset to page 1 whenever filters or pageSize change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, eventFilter, pageSize]);

  // Pagination Calculations
  const totalRecords = filteredRegistrations.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = totalRecords === 0 ? 0 : (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalRecords);
  const paginatedRegistrations = filteredRegistrations.slice(startIndex, endIndex);

  // Helper for generating pagination numbers with ellipsis
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (safeCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (safeCurrentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', safeCurrentPage - 1, safeCurrentPage, safeCurrentPage + 1, '...', totalPages);
      }
    }
    return pages;
  }, [safeCurrentPage, totalPages]);

  // CSV Export
  const exportCSV = () => {
    const headers = ['#', 'Name', 'Email', 'Phone', 'Gender', 'Category', 'Board', 'School Level', 'Stream', 'Standard', 'Institution', 'City', 'Event', 'Registered On'];
    const rows = filteredRegistrations.map((reg, idx) => [
      idx + 1,
      reg.participant?.fullName || '',
      reg.participant?.email || '',
      reg.participant?.mobile || '',
      reg.participant?.gender || '',
      reg.participant?.category || 'Student',
      reg.participant?.board || '',
      reg.participant?.schoolLevel || '',
      reg.participant?.stream || '',
      reg.participant?.currentStandard || '',
      reg.participant?.organization?.name || '',
      reg.participant?.organization?.city || '',
      reg.event?.title || '',
      new Date(reg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `delegates-participants-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Total Registered</p>
            <h3 className="text-2xl font-black text-brand-navy mt-1">{registrations.length}</h3>
            <p className="text-xs text-brand-muted mt-0.5">All registered delegates</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Filtered View</p>
            <h3 className="text-2xl font-black text-brand-purple mt-1">{filteredRegistrations.length}</h3>
            <p className="text-xs text-brand-muted mt-0.5">Matching current filters</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-brand-purple flex items-center justify-center font-bold">
            <GraduationCap size={22} />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider">Active Editions</p>
            <h3 className="text-2xl font-black text-brand-navy mt-1">{uniqueEvents.length}</h3>
            <p className="text-xs text-brand-muted mt-0.5">Events with registrations</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Ticket size={22} />
          </div>
        </div>
      </div>

      {/* Search, Filter & Export Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center bg-white p-3.5 rounded-2xl border border-brand-border/80 shadow-xs">
        <div className="relative min-w-0 flex-1 w-full sm:max-w-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, phone, school..."
            className="w-full h-10 pl-9 pr-3 text-sm bg-gray-50/50 border border-brand-border/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple focus:bg-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <div className="relative z-10 flex-1 sm:flex-initial w-full sm:w-56">
            <SearchableDropdown
              options={[
                { id: 'all', name: 'All Fair Editions' },
                ...uniqueEvents.map(event => ({ id: event.id, name: event.title }))
              ]}
              value={eventFilter}
              onChange={(val) => setEventFilter(val)}
              placeholder="All Fair Editions"
              icon={Filter}
              align="right"
              className="w-full"
            />
          </div>

          <Button 
            variant="outline" 
            onClick={exportCSV} 
            className="h-10 flex-1 sm:flex-initial flex items-center justify-center gap-1.5 shrink-0 text-xs sm:text-sm px-3.5 rounded-xl border-brand-border/80 hover:bg-gray-50"
          >
            <Download size={14} />
            <span>Export CSV</span>
            {filteredRegistrations.length < registrations.length && (
              <span className="ml-1 bg-brand-purple text-white text-xs font-bold px-1.5 py-0.2 rounded-full">
                {filteredRegistrations.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-brand-border/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap text-sm min-w-[700px]">
            <thead className="bg-gray-50/80 text-brand-muted text-xs uppercase tracking-wider border-b border-brand-border/60">
              <tr>
                <th className="px-4 py-3.5 font-bold w-12 text-center text-gray-400">#</th>
                <th className="px-4 py-3.5 font-bold">Delegate Name</th>
                <th className="px-4 py-3.5 font-bold">Contact Info</th>
                <th className="px-4 py-3.5 font-bold">Institution / School</th>
                <th className="px-4 py-3.5 font-bold">Fair Edition</th>
                <th className="px-4 py-3.5 font-bold">Registered Date</th>
                <th className="px-4 py-3.5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRegistrations.length > 0 ? (
                paginatedRegistrations.map((reg, idx) => {
                  const globalIdx = startIndex + idx + 1;
                  const initials = reg.participant?.fullName
                    ? reg.participant.fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
                    : 'D';

                  return (
                    <tr key={reg.id} className="hover:bg-purple-50/20 transition-colors">
                      <td className="px-4 py-3.5 text-center text-xs font-semibold text-gray-400">
                        {globalIdx}
                      </td>
                      <td className="px-4 py-3.5 max-w-[260px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-brand-purple/10 text-brand-purple font-black text-xs flex items-center justify-center shrink-0 border border-brand-purple/20">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-brand-navy truncate text-sm" title={reg.participant?.fullName}>
                              {reg.participant?.fullName || '-'}
                            </div>
                            <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider mt-0.5">
                              {reg.participant?.category || 'Student'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 max-w-[240px]">
                        <div className="space-y-0.5 text-xs">
                          <div className="text-brand-navy font-medium truncate" title={reg.participant?.email || '-'}>
                            {reg.participant?.email || '-'}
                          </div>
                          <div className="text-gray-500 font-mono">
                            {reg.participant?.mobile || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 max-w-[240px] truncate text-xs text-brand-navy" title={reg.participant?.organization?.name || '-'}>
                        <div className="font-medium truncate">{reg.participant?.organization?.name || '-'}</div>
                        {reg.participant?.organization?.city && (
                          <div className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5">
                            <MapPin size={10} />
                            <span>{reg.participant?.organization?.city}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 max-w-[220px]">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-purple/10 text-brand-purple truncate max-w-full" title={reg.event?.title}>
                          {reg.event?.title || 'Unknown Event'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-500">
                        {new Date(reg.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button 
                          onClick={() => setSelectedReg(reg)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-colors cursor-pointer"
                          title="View Delegate Details"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-brand-muted">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <Search size={20} />
                      </div>
                      <p className="font-semibold text-brand-navy">No delegates found</p>
                      <p className="text-xs text-gray-500">
                        {searchQuery || eventFilter !== 'all' 
                          ? 'Try adjusting your search query or event filter to find what you are looking for.' 
                          : 'There are currently no registered delegates recorded.'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Proper Pagination Controls */}
        <div className="px-4 py-3.5 bg-gray-50/70 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Left: Summary and Page Size Selector */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-gray-600 font-medium">
              Showing <span className="font-bold text-brand-navy">{totalRecords === 0 ? 0 : startIndex + 1}</span> to{' '}
              <span className="font-bold text-brand-navy">{endIndex}</span> of{' '}
              <span className="font-bold text-brand-navy">{totalRecords}</span> delegates
              {filteredRegistrations.length < registrations.length && (
                <span className="text-gray-400 ml-1">
                  (filtered from {registrations.length} total)
                </span>
              )}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-gray-500">Rows per page:</span>
              <select
                aria-label="Rows per page"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-8 px-2 bg-white border border-brand-border/80 rounded-lg text-xs font-semibold text-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-purple cursor-pointer shadow-2xs"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* Right: Page Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={safeCurrentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-border/70 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="First Page"
              >
                <ChevronsLeft size={14} />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-border/70 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Numbered Page Buttons for Tablet & Desktop */}
              <div className="hidden sm:flex items-center gap-1 mx-1">
                {pageNumbers.map((p, i) => {
                  if (typeof p === 'string') {
                    return (
                      <span key={`dots-${i}`} className="w-8 text-center text-gray-400 font-bold select-none">
                        ...
                      </span>
                    );
                  }
                  const isCurrent = p === safeCurrentPage;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-brand-purple text-white shadow-xs'
                          : 'bg-white border border-brand-border/70 text-brand-navy hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Mobile Page indicator */}
              <span className="sm:hidden text-xs font-bold text-brand-navy px-1.5 whitespace-nowrap">
                {safeCurrentPage} / {totalPages}
              </span>

              {/* Next Page */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-border/70 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight size={14} />
              </button>

              {/* Last Page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={safeCurrentPage === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-brand-border/70 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="Last Page"
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {selectedReg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" 
          onClick={() => setSelectedReg(null)}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="relative bg-brand-navy p-5 sm:p-6 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-primary/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl"></div>
              
              <button 
                onClick={() => setSelectedReg(null)} 
                className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-20 cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-heading font-bold">{selectedReg.participant?.fullName}</h2>
                  <span className="bg-white/10 border border-white/20 text-white px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest">
                    {selectedReg.participant?.category || 'Student'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-white/80 text-xs font-medium">
                  <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
                    <Mail size={13} className="text-brand-turquoise" /> {selectedReg.participant?.email || '-'}
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg">
                    <Phone size={13} className="text-brand-turquoise" /> {selectedReg.participant?.mobile || '-'}
                  </div>
                  {selectedReg.participant?.gender && (
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
                    <div className="font-bold text-brand-navy text-sm">{selectedReg.event?.title || 'Unknown Event'}</div>
                  </div>
                </div>
                <div className="sm:text-right bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Registration Date</div>
                  <div className="font-semibold text-brand-navy text-sm flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-purple" />
                    {new Date(selectedReg.createdAt).toLocaleString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric', 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>

              {/* Two Column Details */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 px-4 py-3 sm:border-r border-gray-100">
                    <BookOpen size={14} className="text-brand-purple shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-navy">Educational Profile</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 border-t sm:border-t-0 border-gray-100">
                    <Building2 size={14} className="text-brand-purple shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-widest text-brand-navy">Institution Details</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                  {/* Educational Profile */}
                  <div className="p-4 grid grid-cols-2 gap-y-4 gap-x-3 content-start">
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Board</div>
                      <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant?.board || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">School Level</div>
                      <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant?.schoolLevel || '-'}</div>
                    </div>
                    {selectedReg.participant?.stream && (
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Stream</div>
                        <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant.stream}</div>
                      </div>
                    )}
                    {selectedReg.participant?.currentStandard && (
                      <div>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Standard</div>
                        <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant.currentStandard}</div>
                      </div>
                    )}
                  </div>

                  {/* Institution Details */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Institution Name</div>
                      <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant?.organization?.name || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">City</div>
                      <div className="font-semibold text-brand-navy text-sm">{selectedReg.participant?.organization?.city || selectedReg.participant?.city || '-'}</div>
                    </div>
                    {selectedReg.participant?.organization?.address && (
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
                className="px-6 py-2 bg-gray-100 text-brand-navy font-bold text-sm rounded-lg hover:bg-gray-200 transition-all shadow-sm active:scale-95 cursor-pointer"
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
