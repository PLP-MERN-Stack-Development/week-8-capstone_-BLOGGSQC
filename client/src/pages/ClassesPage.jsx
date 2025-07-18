import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await api.get('/classes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Classes</h2>
        <ul className="space-y-2">
          {classes.map((cls) => (
            <li key={cls._id} className="border p-3 rounded bg-white shadow">
              {cls.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
