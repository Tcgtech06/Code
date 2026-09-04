import { useEffect } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Lock, 
  FileText, 
  Mail, 
  Globe, 
  MapPin, 
  HardDrive, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Privacy Policy - TCG Invoice Generator | TCG TECH";
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-24 relative selection:bg-blue-600 selection:text-white">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/80 via-white/50 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Privacy Policy</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-sm mb-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Official Legal Document
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-lg text-blue-600 font-semibold mb-3">
            TCG Invoice Generator (Desktop Application)
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <span>Effective Date: <strong>September 04, 2026</strong></span>
            <span>•</span>
            <span>Version: <strong>1.0.0</strong></span>
          </p>

          <hr className="my-6 border-gray-100" />

          <p className="text-gray-700 leading-relaxed">
            <strong className="text-gray-900">TCG TECH</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our desktop application, <strong className="text-gray-900">TCG Invoice Generator</strong> (the &ldquo;Application&rdquo;).
          </p>
          <div className="mt-4 p-4 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this privacy policy, please do not access or use the Application.
            </p>
          </div>
        </div>

        {/* Highlight Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Data Security</p>
              <p className="text-sm font-semibold text-gray-900">Firebase Encrypted Cloud</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">User First</p>
              <p className="text-sm font-semibold text-gray-900">Zero Data Selling</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Storage</p>
              <p className="text-sm font-semibold text-gray-900">Multi-device Cloud Sync</p>
            </div>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6">

          {/* Section 1 */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Information We Collect
              </h2>
            </div>
            <p className="text-gray-600 mb-6">
              We may collect information about you in a variety of ways. The information we may collect via the Application includes:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Personal Data</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    When you register for an account or activate a license, we collect personal information such as your <strong>Email Address</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Business Data</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    To provide our core invoicing services, the Application collects and stores the invoice data you create, which may include your <strong>business name, client details, addresses, and financial figures</strong>.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center mb-3">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">Device Data</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We may collect non-identifiable information about the device you use to access the Application (such as your <strong>operating system version</strong>) to ensure compatibility and manage license activations.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                How We Use Your Information
              </h2>
            </div>
            <p className="text-gray-600 mb-5">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to:
            </p>

            <ul className="space-y-3">
              {[
                "Create and manage your account.",
                "Sync your invoice data securely across your devices using cloud services (Firebase).",
                "Process your license activations (Demo, Subscription, or Permanent).",
                "Email you regarding your account or software updates.",
                "Respond to customer service requests and provide technical support."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100/80">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Data Storage and Security
              </h2>
            </div>
            
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 mb-4 flex items-start gap-4">
              <Server className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Encrypted Cloud Infrastructure</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We use administrative, technical, and physical security measures to help protect your personal information. Your data is securely stored and synced using <strong>Google Firebase&apos;s encrypted cloud infrastructure</strong>.
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Disclosure of Your Information
              </h2>
            </div>
            
            <p className="text-gray-700 font-medium mb-4">
              We do not sell, trade, or rent your personal identification information or business data to third parties.
            </p>
            <p className="text-gray-600 text-sm mb-4">
              We may share information only in the following situations:
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">By Law or to Protect Rights:</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">Third-Party Service Providers:</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  We may share your information with trusted third parties that perform services for us, specifically secure cloud hosting and database management (e.g., Google Firebase).
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 - Contact Us */}
          <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Contact Us
              </h2>
            </div>

            <p className="text-blue-100 text-sm sm:text-base mb-6 leading-relaxed">
              If you have questions, comments, or requests regarding this Privacy Policy or your data, please feel free to reach out to us:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold text-white">Company Details</span>
                </div>
                <p className="text-sm text-blue-100 font-medium">TCG TECH</p>
                <p className="text-xs text-blue-200 mt-0.5">Coimbatore, Tamil Nadu, India</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold text-white">Official Email</span>
                </div>
                <a 
                  href="mailto:tcgtechnologyofficial@gmail.com" 
                  className="text-sm text-blue-200 hover:text-white underline underline-offset-2 break-all transition-colors"
                >
                  tcgtechnologyofficial@gmail.com
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 sm:col-span-2">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-blue-300" />
                  <span className="font-semibold text-white">Official Website</span>
                </div>
                <a 
                  href="https://tcgtech.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-200 hover:text-white underline underline-offset-2 transition-colors"
                >
                  https://tcgtech.in
                </a>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-blue-200">
              <span>&copy; {new Date().getFullYear()} TCG TECH. All Rights Reserved.</span>
              <div className="space-x-4">
                <Link to="/terms" className="hover:text-white underline">Terms & Conditions</Link>
                <Link to="/" className="hover:text-white underline">Back to Home</Link>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
