import { useState } from 'react';
import { Mail, Phone, MapPin, Globe, Clock, Users } from 'lucide-react';
import { saveEnquiry } from '../lib/supabase';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

const services = [
  { title: "Web Development", description: "Custom web solutions with cutting-edge technologies." },
  { title: "App Development", description: "Native and cross-platform mobile applications." },
  { title: "E-Commerce", description: "Complete online store solutions and management." },
  { title: "AI", description: "Artificial Intelligence and Machine Learning solutions." },
  { title: "System Software", description: "Custom system software development and integration." },
  { title: "SEO / Digital Marketing", description: "Comprehensive digital marketing strategies." },
  { title: "Chatbot Creation", description: "Custom chatbot development and integration." },
  { title: "UI/UX Design", description: "User-centered design and experience solutions." }
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleEmailClick = () => {
    const email = 'contact@tcgtech.in';
    const subject = 'Inquiry from TCG Technology Website';
    const body = 'Hi TCG Technology Team,\n\nI would like to inquire about your services.\n\nBest regards';
    window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
  };

  const handleDialClick = () => {
    const phoneNumber = '+919791962802';
    window.open(`tel:${phoneNumber}`, '_blank');
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = '918072099570'; // Specified WhatsApp number
    const whatsappMessage = `
Name: ${name}
Email: ${email}
Contact Number: ${contactNumber}
Service Interested In: ${selectedService || 'Not specified'}
Message: ${message}
    `.trim();
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !contactNumber || !selectedService) {
      setSubmissionStatus({
        type: 'error',
        message: 'Please fill in all required fields'
      });
      setTimeout(() => setSubmissionStatus({ type: null, message: '' }), 5000);
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus({ type: null, message: '' });

    try {
      // Send WhatsApp message
      const phoneNumber = '918072099570'; // WhatsApp number
      const whatsappMessage = `
Name: ${name}
Email: ${email}
Contact Number: ${contactNumber}
Service Interested In: ${selectedService}
Message: ${message || 'No additional message'}
      `.trim();
      
      // Open WhatsApp in a new window/tab
      window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');

      // Also try to save to database
      try {
        await saveEnquiry({
          name,
          email,
          contact_number: contactNumber,
          service: selectedService,
          message: message || undefined
        });
      } catch (dbError) {
        console.warn('Database save failed, but WhatsApp message was sent', dbError);
      }

      // Success - show message and clear form
      setSubmissionStatus({
        type: 'success',
        message: 'Thank you! Your enquiry has been sent to WhatsApp. We will get back to you soon.'
      });

      // Clear form
      setName('');
      setEmail('');
      setContactNumber('');
      setSelectedService('');
      setMessage('');

      // Clear success message after 5 seconds
      setTimeout(() => setSubmissionStatus({ type: null, message: '' }), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus({
        type: 'error',
        message: 'There was an issue submitting your enquiry. Please try again or contact us directly.'
      });
      setTimeout(() => setSubmissionStatus({ type: null, message: '' }), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMapsClick = () => {
    const address = encodeURIComponent('123 Tech Street, Silicon Valley, CA 94025');
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  return (
    <div className="pt-16 relative">
      <style>{`
        @keyframes slideHorizontal {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(40px);
          }
        }
      `}</style>
      
      {/* Contact Information Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-6">Get in Touch</h1>
              <p className="text-gray-600 mb-8">
                Have a question or want to learn more about our services? Reach out to us through any of the following channels.
              </p>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-xl">
                <h3 className="text-base md:text-xl font-semibold text-gray-800 mb-6 text-center">Contact Information</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-blue-100" onClick={handleEmailClick}>
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                        <Mail className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-800">Email</p>
                        <p className="text-xs text-gray-600 mt-1">contact@tcgtech.in</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-green-100" onClick={handleDialClick}>
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-800">Phone</p>
                        <p className="text-xs text-gray-600 mt-1">+91 97919 62802</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-green-100"
                    onClick={handleWhatsAppClick}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                        <WhatsAppIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-800">WhatsApp</p>
                        <p className="text-xs text-gray-600 mt-1">Chat with us</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className="group bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-purple-100"
                    onClick={handleMapsClick}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div className="p-3 bg-purple-100 rounded-full group-hover:bg-purple-200 transition-colors">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-800">Location</p>
                        <p className="text-xs text-gray-600 mt-1">Find us on map</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Clock className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">Business Hours</p>
                        <p className="text-xs text-gray-600">Mon-Sat: 9AM-6PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">Website</p>
                        <p className="text-xs text-gray-600">www.tcgtechnology.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-800">Support Team</p>
                        <p className="text-xs text-gray-600">24/7 Available</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div id="contact-form" className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-lg md:text-2xl font-bold mb-6 text-center">Send Us an Enquiry</h2>
              
              {submissionStatus.type && (
                <div className={`p-4 rounded-lg mb-6 border-l-4 ${
                  submissionStatus.type === 'success' 
                    ? 'bg-green-50 text-green-700 border-green-400' 
                    : 'bg-red-50 text-red-700 border-red-400'
                }`}>
                  {submissionStatus.message}
                </div>
              )}
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                  <input
                    type="tel"
                    id="contactNumber"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700">Service Interested In</label>
                  <select
                    id="service"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Select a service</option>
                    {services.map((service, index) => (
                      <option key={index} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Your Message (Optional)</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <WhatsAppIcon className="h-5 w-5 mr-3" />
                  {isSubmitting ? 'Submitting...' : 'Send via WhatsApp'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}