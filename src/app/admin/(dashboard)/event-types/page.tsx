import prisma from '@/lib/prisma';
import { toggleEventTypeAction, deleteEventTypeAction } from './actions';
import { Check, Ban, Trash2 } from 'lucide-react';
import { AddEventTypeForm } from './AddEventTypeForm';

export default async function EventTypesPage() {
  const eventTypes = await prisma.eventType.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold text-brand-navy">Event Types</h1>
          <p className="text-brand-muted mt-1">Manage the types of events available in the system.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <AddEventTypeForm />
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-brand-muted text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eventTypes.length > 0 ? (
                  eventTypes.map(type => (
                    <tr key={type.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-brand-navy">
                        {type.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${type.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {type.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <form action={toggleEventTypeAction.bind(null, type.id, type.isActive)}>
                            <div className="relative group">
                              <button 
                                type="submit"
                                className={`p-2 rounded-lg transition-colors ${type.isActive ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'}`}
                              >
                                {type.isActive ? <Ban size={18} /> : <Check size={18} />}
                              </button>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {type.isActive ? 'Deactivate' : 'Activate'}
                              </span>
                            </div>
                          </form>
                          <form action={deleteEventTypeAction.bind(null, type.id)}>
                            <div className="relative group">
                              <button 
                                type="submit"
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Delete
                              </span>
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-brand-muted">No event types found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
