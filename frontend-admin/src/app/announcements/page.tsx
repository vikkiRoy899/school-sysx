"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const loadAnnouncements = async () => {
    try {
      const { data } = await api.get("/communication/announcements");
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/communication/announcements", { title, content });
      setTitle("");
      setContent("");
      loadAnnouncements();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to post announcement");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Announcements Portal</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-bold mb-4">Post Announcement</h3>
        <form onSubmit={handlePost} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Publish Announcement
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-bold text-gray-800">{ann.title}</h3>
            <p className="text-gray-600 mt-2">{ann.content}</p>
            <p className="text-xs text-gray-400 mt-4">{new Date(ann.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
