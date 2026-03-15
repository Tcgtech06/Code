import React from 'react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-16 pb-20 relative">
      <style>{`
        @keyframes slideHorizontal {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(40px);
          }
        }
        .ox-slide {
          animation: slideHorizontal 3s ease-in-out infinite;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-blue-600 mb-8">Terms and Conditions - TCG Technologies</h1>
        
        <p className="mb-4"><strong>Last Updated: March 15, 2024</strong></p>
        
        {/* Terms content sections */}
        <div className="prose max-w-none">
          <p className="mb-6">
            Welcome to TCG Technologies! These Terms and Conditions outline the rules and regulations for the use of our website and services.
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-4">1. Definitions</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2"><strong>"Company"</strong>: Refers to TCG Technologies, registered at Coimbatore, India.</li>
            <li className="mb-2"><strong>"Website"</strong>: Refers to www.tcgtechnologies.com.</li>
            <li className="mb-2"><strong>"User", "You", "Your"</strong>: Refers to individuals or entities who access or use our website or services.</li>
            <li className="mb-2"><strong>"Services"</strong>: Refers to all products, tools, and offerings provided by TCG Technologies.</li>
          </ul>

          {/* Continue with all other sections following the same pattern */}
          
          <h2 className="text-2xl font-bold text-blue-600 mt-8 mb-4">17. Contact Us</h2>
          <p className="mb-4">For any questions regarding these Terms and Conditions, please contact us at:</p>
          
          <address className="not-italic mb-8">
            <strong>TCG Technologies</strong><br />
            Email: <a href="mailto:contact@tcgtech.in" className="text-blue-600 hover:underline">contact@tcgtech.in</a><br />
            Phone: 9999999999<br />
            Address: Coimbatore, India
          </address>
        </div>
      </div>
    </div>
  );
}