import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Student {
  id: string;
  email: string;
  role: string;
  studentProfile: {
    admissionNumber: string;
    rollNumber?: string;
    class?: { name: string };
  };
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/students');
        setStudents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading students...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Students</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="p-3 font-medium">Admission No</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Class</th>
              <th className="p-3 font-medium">Roll No</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-3">{s.studentProfile?.admissionNumber}</td>
                <td className="p-3">{s.email}</td>
                <td className="p-3">{s.studentProfile?.class?.name || 'Unassigned'}</td>
                <td className="p-3">{s.studentProfile?.rollNumber || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
