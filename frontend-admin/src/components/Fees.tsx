import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Invoice {
  id: string;
  studentId: string;
  feeStructureId: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  paidAt?: string;
  createdAt: string;
}

export default function Fees() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/fees/invoices');
        setInvoices(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading invoices...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Invoices</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 font-medium">Student ID</th>
              <th className="p-3 font-medium">Amount</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b">
                <td className="p-3">{inv.studentId}</td>
                <td className="p-3">{inv.amount}</td>
                <td className="p-3">
                  {inv.status === 'PAID' ? 'Paid' : 'Pending'}
                </td>
                <td className="p-3">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
