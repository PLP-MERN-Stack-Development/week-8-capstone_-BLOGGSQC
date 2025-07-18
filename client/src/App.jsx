import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ClassesPage from './pages/ClassesPage';
import NotesPage from './pages/NotesPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default route for "/" */}
        <Route path="/" element={<LoginPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/classes"
          element={<ProtectedRoute><ClassesPage /></ProtectedRoute>}
        />
        <Route
          path="/notes"
          element={<ProtectedRoute><NotesPage /></ProtectedRoute>}
        />
      </Routes>
    </Router>
  );
}
