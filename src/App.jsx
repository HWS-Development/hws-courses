import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Navbar from './components/Navbar'; // ⬅️ new

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />  {/* ⬅️ replaces old header */}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:videotitle" element={<Watch />} />
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
