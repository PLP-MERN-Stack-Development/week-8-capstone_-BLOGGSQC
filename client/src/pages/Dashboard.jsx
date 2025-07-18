import Navbar from '../components/Navbar';

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Welcome to School Management System</h1>
        <p className="text-gray-700">Select a module from the navigation bar.</p>
      </div>
    </>
  );
}
