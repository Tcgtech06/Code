import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, TrendingUp, ExternalLink, ChevronDown } from 'lucide-react';

interface ClientItem {
  name: string;
  logo: string;
  url?: string;
  description: string;
}

const webDevClients: ClientItem[] = [
  { name: 'Adhirasam', logo: '/Images/adhirasam.png', url: 'https://adhirasam.in', description: 'Traditional sweets & snacks delivered to your doorstep.' },
  { name: 'Pugazh Overseas', logo: '/Images/pugazh.png', url: 'https://pugazhoverseas.in/', description: 'Global export and import solutions.' },
  { name: 'Mali Enterprises', logo: '/Images/mali.png', url: 'https://malienterprises.in', description: 'Industrial and engineering services.' },
  { name: 'Knitinfo', logo: '/Images/knitinfo.png', url: 'https://knitinfo.in', description: 'Textile industry insights and digital solutions.' },
  { name: 'Kaumara Dental', logo: '/Images/kaumara.jpeg', url: 'https://kaumaradental.com', description: 'Advanced dental care and healthcare services.' },
  { name: 'Manjunath Enterprises', logo: '/Images/manjunath.png', url: 'https://manjunathenterprises.in/', description: 'Comprehensive business and enterprise solutions.' },
  { name: 'Metro Fire Safe', logo: '/Images/metrosafe.png', url: 'https://metrosafe.in/', description: 'Fire safety equipment and solutions.' },
  { name: 'Trek India', logo: '/Images/trekindia.png', url: 'https://trekindia.co', description: 'Adventure trekking and outdoor experiences.' },
];

const digitalMarketingClients: ClientItem[] = [
  { name: 'Trek India', logo: '/Images/trekindia.png', url: 'https://www.instagram.com/trekindia_official?igsh=MTFscTFncGl5ZDZ4MQ==', description: 'Adventure trekking and outdoor experiences.' },
  { name: 'Pugazh Overseas', logo: '/Images/pugazh.png', url: 'https://www.instagram.com/pugazhoverseas_official?igsh=MXJudngzaWRtb3Uzcg==', description: 'Digital presence for global trade.' },
  { name: 'Metro Fire Safe', logo: '/Images/metrosafe.png', url: 'https://www.instagram.com/metrofiresafetysolutions?igsh=MWdlZXRqa3lzZDlvMg==', description: 'Fire safety equipment and solutions.' },
];

// Hook: animate elements when they scroll into view
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

/* ─── tiny reusable card ─── */
const ClientCard: React.FC<{ client: ClientItem; index: number; visible: boolean; accent: string }> = ({ client, index, visible, accent }) => (
  <a
    href={client.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group block"
    style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.92)',
      transition: `all 0.7s cubic-bezier(.22,1,.36,1) ${index * 120}ms`,
    }}
  >
    <div className={`relative bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100
      hover:shadow-2xl hover:-translate-y-3 transition-all duration-500`}>
      {/* Accent ribbon */}
      <div className={`h-1.5 w-full ${accent}`} />

      {/* Floating glow on hover */}
      <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${accent}`} />

      <div className="p-6 flex flex-col items-center text-center relative z-10">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gray-50 flex items-center justify-center mb-5 p-3
          group-hover:scale-110 group-hover:shadow-lg transition-all duration-500 border border-gray-100">
          <img src={client.logo} alt={client.name} className="max-w-full max-h-full object-contain" loading="lazy" />
        </div>
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{client.name}</h3>
        <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-4">{client.description}</p>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full
          ${accent === 'bg-gradient-to-r from-blue-500 to-cyan-500' ? 'text-blue-600 bg-blue-50' : 'text-purple-600 bg-purple-50'}
          group-hover:scale-105 transition-transform`}>
          {accent !== 'bg-gradient-to-r from-blue-500 to-cyan-500' && (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
          )}
          {accent === 'bg-gradient-to-r from-blue-500 to-cyan-500' ? 'Visit' : 'Visit the Instagram page'} <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  </a>
);

/* ─── main page ─── */
const Portfolio: React.FC = () => {
  const heroReveal = useScrollReveal();
  const webReveal = useScrollReveal();
  const dmReveal = useScrollReveal();
  const ctaReveal = useScrollReveal();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Scroll to web dev section
  const scrollToWork = () => document.getElementById('web-dev-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">

      {/* ═══════════ inline keyframes ═══════════ */}
      <style>{`
        @keyframes heroGradient { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes pulse-ring { 0%{transform:scale(.9);opacity:.6} 100%{transform:scale(1.6);opacity:0} }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes orbit   { 0%{transform:rotate(0deg) translateX(120px) rotate(0deg)} 100%{transform:rotate(360deg) translateX(120px) rotate(-360deg)} }
        .hero-bg { background: linear-gradient(135deg,#0f172a,#1e3a5f,#0f172a,#1a1a40); background-size:400% 400%; animation:heroGradient 12s ease infinite; }
        .float-1 { animation:float 5s ease-in-out infinite; }
        .float-2 { animation:float 7s ease-in-out 1s infinite; }
        .float-3 { animation:float 6s ease-in-out 2s infinite; }
        .shimmer-text { background:linear-gradient(90deg,#fff 0%,#93c5fd 50%,#fff 100%); background-size:200% auto; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:shimmer 3s linear infinite; }
        .section-divider { height:4px; background:linear-gradient(90deg,transparent,#3b82f6,#8b5cf6,transparent); border-radius:2px; }
      `}</style>

      {/* ═══════════ HERO ═══════════ */}
      <section ref={heroReveal.ref} className="hero-bg relative min-h-[85vh] flex items-center justify-center">
        {/* Parallax follow cursor */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] float-1"
            style={{ left: mousePos.x * 0.03, top: mousePos.y * 0.03 }} />
          <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[100px] float-2"
            style={{ right: mousePos.x * -0.02 + 100, bottom: mousePos.y * -0.02 + 50 }} />
          {/* Orbiting dots */}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className="absolute left-1/2 top-1/2" style={{ animation: `orbit ${8 + i * 2}s linear infinite`, animationDelay: `${i * -1.5}s` }}>
              <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-blue-400/40' : 'bg-purple-400/40'}`} />
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          style={{ opacity: heroReveal.visible ? 1 : 0, transform: heroReveal.visible ? 'translateY(0)' : 'translateY(50px)', transition: 'all 1.2s cubic-bezier(.22,1,.36,1)' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 text-sm mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" /></span>
            Our Work &amp; Success Stories
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Crafting Digital<br /><span className="shimmer-text">Excellence</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-200/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            From stunning websites to powerful digital marketing strategies — explore how we've helped businesses grow and thrive in the digital landscape.
          </p>
          <button onClick={scrollToWork}
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300">
            Explore Our Work <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full"><path d="M0 80L48 74C96 68 192 56 288 50C384 44 480 44 576 52C672 60 768 76 864 80C960 84 1056 76 1152 66C1248 56 1344 44 1392 38L1440 32V120H0Z" fill="#f9fafb" /></svg>
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: '8+', label: 'Web Clients' },
            { val: '3+', label: 'Marketing Clients' },
            { val: '100%', label: 'Client Satisfaction' },
            { val: '2+', label: 'Years Experience' },
          ].map((s, i) => (
            <div key={i} className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
              <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">{s.val}</div>
              <div className="text-sm text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ WEB DEVELOPMENT ═══════════ */}
      <section id="web-dev-section" ref={webReveal.ref} className="py-20 md:py-28 bg-gray-50 relative">
        {/* BG blobs */}
        <div className="absolute top-10 left-0 w-72 h-72 bg-blue-200 rounded-full filter blur-[100px] opacity-20 float-3" />
        <div className="absolute bottom-10 right-0 w-72 h-72 bg-cyan-200 rounded-full filter blur-[100px] opacity-20 float-1" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section header */}
          <div className="text-center mb-16" style={{ opacity: webReveal.visible ? 1 : 0, transform: webReveal.visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 font-semibold text-sm mb-4">
              <Globe className="w-4 h-4" /> Web Development
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Websites We've <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Built</span>
            </h2>
            <div className="section-divider w-24 mx-auto mb-4" />
            <p className="text-gray-500 max-w-xl mx-auto">Pixel-perfect, lightning-fast websites tailored to each client's unique brand and goals.</p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {webDevClients.map((c, i) => (
              <ClientCard key={c.name} client={c} index={i} visible={webReveal.visible} accent="bg-gradient-to-r from-blue-500 to-cyan-500" />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DIGITAL MARKETING ═══════════ */}
      <section ref={dmReveal.ref} className="py-20 md:py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f0f4ff 50%, #fdf2f8 100%)' }}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full filter blur-[120px] opacity-25 float-2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-200 rounded-full filter blur-[120px] opacity-25 float-1" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16" style={{ opacity: dmReveal.visible ? 1 : 0, transform: dmReveal.visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.8s ease' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-600 font-semibold text-sm mb-4">
              <TrendingUp className="w-4 h-4" /> Digital Marketing
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Brands We've <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Grown</span>
            </h2>
            <div className="section-divider w-24 mx-auto mb-4" style={{ background: 'linear-gradient(90deg,transparent,#8b5cf6,#ec4899,transparent)' }} />
            <p className="text-gray-500 max-w-xl mx-auto">Strategic digital marketing campaigns that amplify reach, engagement, and conversions.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7 max-w-4xl mx-auto">
            {digitalMarketingClients.map((c, i) => (
              <ClientCard key={c.name + '-dm'} client={c} index={i} visible={dmReveal.visible} accent="bg-gradient-to-r from-purple-500 to-pink-500" />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section ref={ctaReveal.ref} className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full bg-white/5" style={{ width: 40 + i * 30, height: 40 + i * 30, left: `${10 + i * 15}%`, top: `${20 + (i % 3) * 25}%`, animation: `float ${4 + i}s ease-in-out ${i * 0.5}s infinite` }} />
          ))}
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10"
          style={{ opacity: ctaReveal.visible ? 1 : 0, transform: ctaReveal.visible ? 'translateY(0)' : 'translateY(30px)', transition: 'all 1s ease' }}>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-5">Ready to Be Our Next Success Story?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">Let's build something remarkable together. Whether you need a stunning website or a powerful marketing strategy, we've got you covered.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-full shadow-xl hover:shadow-white/30 hover:scale-105 transition-all duration-300 text-sm">
              Start Your Project <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/about"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 text-sm">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;
