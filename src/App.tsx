import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';
import { SignupPage } from './pages/SignupPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { HallDetailPage } from './pages/HallDetailPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/hall/:id" element={<HallDetailPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
