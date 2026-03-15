import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SnowEffect from './components/SnowEffect';
import PongalAnimation from './components/PongalAnimation';
import DiwaliAnimation from './components/DiwaliAnimation';
import CometAnimation from './components/CometAnimation';
import LunaWidget from './components/LunaWidget';
import useSnowEffect from './hooks/useSnowEffect';
import Home from './pages/Home';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import JobApplication from './pages/JobApplication';
import Terms from './pages/Terms';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import WebDevelopment from './pages/services/WebDevelopment';
import AppDevelopment from './pages/services/AppDevelopment';
import ECommerce from './pages/services/ECommerce';
import SystemSoftware from './pages/services/SystemSoftware';
import SEODigitalMarketing from './pages/services/SEODigitalMarketing';
import AIChatbotDevelopment from './pages/services/AIChatbotDevelopment';

function AppContent() {
  const { showSeason, seasonType } = useSnowEffect();
  const location = useLocation();
  
  // Hide Luna chatbot on admin panel
  const showLuna = !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {showSeason && seasonType === 'christmas' && <SnowEffect />}
      {showSeason && seasonType === 'pongal' && <PongalAnimation />}
      {showSeason && seasonType === 'diwali' && <DiwaliAnimation />}
      <CometAnimation />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/apply" element={<JobApplication />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/services/web-development" element={<WebDevelopment />} />
          <Route path="/services/app-development" element={<AppDevelopment />} />
          <Route path="/services/ecommerce" element={<ECommerce />} />
          <Route path="/services/system-software" element={<SystemSoftware />} />
          <Route path="/services/seo-digital-marketing" element={<SEODigitalMarketing />} />
          <Route path="/services/ai-chatbot-development" element={<AIChatbotDevelopment />} />
        </Routes>
      </main>
      <Footer />
      {showLuna && <LunaWidget />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;