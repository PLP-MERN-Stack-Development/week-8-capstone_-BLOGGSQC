import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/notes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Notes</h2>
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note._id} className="border p-3 rounded bg-white shadow">
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                {note.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
