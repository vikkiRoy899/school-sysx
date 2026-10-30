import { useEffect, useState } from 'react';
import api from '@/lib/axios';

interface Announcement {
  id: string;
  title: string;
  content: string;
  targetRole?: string;
  createdAt: string;
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/communication/announcements');
        setAnnouncements(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <p>Loading announcements...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Announcements</h2>
      <ul className="space-y-2">
        {announcements.map((ann) => (
          <li key={ann.id} className="p-3 bg-blue-50 rounded">
            <h3 className="font-medium">{ann.title}</h3>
            <p className="text-sm text-gray-600">{ann.content}</p>
            <small className="text-xs text-gray-500">
              {new Date(ann.createdAt).toLocaleDateString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
