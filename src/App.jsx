import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watch from './pages/Watch';
import AuthPage from './pages/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/watch/:videotitle" element={<ProtectedRoute><Watch /></ProtectedRoute>} />
        </Routes>
      </main>
      <footer className="mt-10 py-6 border-t">
        <div className="container-std text-sm text-slate-600">
          © {new Date().getFullYear()} HWS — Hospitality Web Services
        </div>
      </footer>
    </BrowserRouter>
  );
}
