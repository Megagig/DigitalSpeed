import { prisma } from '@/lib/db';
import { formatDateTime } from '@/lib/utils';

async function getAuditTrail() {
  const auditTrail = await prisma.auditTrail.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    take: 100, // Limit to the most recent 100 entries
  });

  return auditTrail;
}

export default async function AuditTrailPage() {
  const auditTrail = await getAuditTrail();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Audit Trail</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Timestamp
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditTrail.length > 0 ? (
                auditTrail.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(entry.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {entry.user.name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">{entry.user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionColor(
                          entry.action
                        )}`}
                      >
                        {formatAction(entry.action)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {entry.details || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    No audit trail entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function formatAction(action: string): string {
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getActionColor(action: string): string {
  if (action.startsWith('CREATE')) {
    return 'bg-green-100 text-green-800';
  } else if (action.startsWith('UPDATE')) {
    return 'bg-blue-100 text-blue-800';
  } else if (action.startsWith('DELETE')) {
    return 'bg-red-100 text-red-800';
  } else if (action.startsWith('MARK')) {
    return 'bg-yellow-100 text-yellow-800';
  } else {
    return 'bg-gray-100 text-gray-800';
  }
}
