import prisma from '@/lib/prisma';
import { AddEventTypeForm } from './AddEventTypeForm';
import { EventTypeActions } from './EventTypeActions';

export default async function EventTypesPage() {
  let eventTypes: any[] = [];
  try {
    eventTypes = await prisma.eventType.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.warn("Database connection failed on Admin Event Types page (Network blocked). Showing empty state.");
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5 bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-brand-border/80 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-extrabold text-brand-navy tracking-tight">
            Event Types
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage the categories and classification of educational summits and university fairs.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-brand-purple border border-purple-100 text-xs font-bold self-start sm:self-auto">
          <span>{eventTypes.length} Types Configured</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4">
          <AddEventTypeForm />
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl border border-brand-border/80 overflow-hidden shadow-2xs">
            <div className="p-4 md:p-5 border-b border-brand-border/60 bg-brand-light/30 flex items-center justify-between">
              <h2 className="text-xs font-bold text-brand-navy uppercase tracking-wider">
                Configured Classifications ({eventTypes.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[460px]">
              <thead className="bg-brand-light/50 text-[10px] font-bold text-brand-muted uppercase tracking-wider border-b border-brand-border/40">
                <tr>
                  <th className="px-5 py-3">Classification Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {eventTypes.length > 0 ? (
                  eventTypes.map(type => (
                    <tr key={type.id} className="hover:bg-brand-light/40 transition-colors">
                      <td className="px-5 py-4 font-bold text-brand-navy">
                        {type.name}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          type.isActive 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {type.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <EventTypeActions id={type.id} name={type.name} isActive={type.isActive} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-brand-muted text-xs">
                      No event types found. Add your first type using the form.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
