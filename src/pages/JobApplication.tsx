import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function JobApplication() {
  const [positions, setPositions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isCurrentlyEmployed, setIsCurrentlyEmployed] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('positions')
        .select('*')
        .order('title');

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
  };

  const uploadResume = async (file: File, applicationId: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${applicationId}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      setMessage({ text: '📤 Uploading resume...', type: 'info' });

      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Resume upload error:', error);
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading resume:', error);
      return null;
    }
  };

  const handleResumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setMessage({ text: 'Please upload only PDF, DOC, or DOCX files', type: 'error' });
        event.target.value = '';
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ text: 'File size must be less than 5MB', type: 'error' });
        event.target.value = '';
        return;
      }

      setResumeFile(file);
      setMessage({ text: '', type: '' });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '📤 Submitting your application...', type: 'info' });

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    try {
      // First, insert the application data
      const { data: applicationData, error: dbError } = await supabase
        .from('job_applications')
        .insert([
          {
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName') || null,
            email: formData.get('email'),
            contact: formData.get('contact'),
            graduation_year: parseInt(formData.get('graduationYear') as string),
            gender: formData.get('gender'),
            position: formData.get('Position'),
            experience: formData.get('experience'),
            current_employer: formData.get('currentEmployer'),
            current_salary: formData.get('currentSalary') || null,
            expected_salary: formData.get('expectedSalary') || null,
            skills: formData.get('skills'),
            location: formData.get('location'),
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      let resumeUrl = null;

      // Upload resume if provided
      if (resumeFile) {
        setMessage({ text: '📤 Uploading resume...', type: 'info' });
        resumeUrl = await uploadResume(resumeFile, applicationData.id);
        
        if (resumeUrl) {
          // Update application with resume URL
          const { error: updateError } = await supabase
            .from('job_applications')
            .update({ resume_url: resumeUrl })
            .eq('id', applicationData.id);

          if (updateError) {
            console.error('Error updating resume URL:', updateError);
          }
        }
      }

      // Send to edge function for WhatsApp notification
      const applicationDataForWhatsApp = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName') || '',
        email: formData.get('email'),
        contact: formData.get('contact'),
        graduationYear: formData.get('graduationYear'),
        gender: formData.get('gender'),
        position: formData.get('Position'),
        experience: formData.get('experience'),
        currentEmployer: formData.get('currentEmployer'),
        currentSalary: formData.get('currentSalary') || '',
        expectedSalary: formData.get('expectedSalary') || '',
        skills: formData.get('skills'),
        location: formData.get('location'),
        resumeUploaded: resumeFile ? 'Yes' : 'No'
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-job-application`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationDataForWhatsApp),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        setMessage({ 
          text: `✅ Application submitted successfully! ${resumeFile ? 'Resume uploaded.' : ''} We will contact you soon.`, 
          type: 'success' 
        });
      } else {
        setMessage({ 
          text: `✅ Application submitted successfully! ${resumeFile ? 'Resume uploaded.' : ''} We will contact you soon.`, 
          type: 'success' 
        });
      }

      form.reset();
      setIsCurrentlyEmployed('');
      setResumeFile(null);
      
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);

    } catch (error) {
      console.error('Error submitting application:', error);
      
      let errorMessage = '❌ Submission Failed! Please retry or contact us directly at contact@tcgtech.in';
      
      if (error.name === 'AbortError') {
        errorMessage = '⏱️ Request timed out. Please check your internet connection and retry.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = '🌐 Network error. Please check your internet connection and retry.';
      }
      
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const clearForm = () => {
    const form = document.getElementById("jobForm") as HTMLFormElement;
    if (form) {
      form.reset();
      setMessage({ text: '', type: '' });
      setIsCurrentlyEmployed('');
      setResumeFile(null);
    }
  };

  const handleEmploymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsCurrentlyEmployed(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 relative">
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
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-red-400">JOB APPLICATION</h2>

          {message.text && (
            <div className={`p-4 rounded-lg mb-6 border-l-4 ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border-green-400' 
                : message.type === 'error'
                ? 'bg-red-50 text-red-700 border-red-400'
                : 'bg-blue-50 text-blue-700 border-blue-400'
            }`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {message.type === 'success' && <span className="text-2xl">✅</span>}
                  {message.type === 'error' && <span className="text-2xl">❌</span>}
                  {message.type === 'info' && <span className="text-2xl">📤</span>}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{message.text}</p>
                </div>
              </div>
            </div>
          )}

          <form id="jobForm" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="firstName" className="block font-semibold mb-2">First Name *</label>
              <input type="text" id="firstName" name="firstName" required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block font-semibold mb-2">Last Name</label>
              <input type="text" id="lastName" name="lastName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 mt-1">Optional field</p>
            </div>

            <div>
              <label htmlFor="email" className="block font-semibold mb-2">Email *</label>
              <input type="email" id="email" name="email" required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="contact" className="block font-semibold mb-2">Contact *</label>
              <input type="tel" id="contact" name="contact" placeholder="+91" required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="graduationYear" className="block font-semibold mb-2">Year of Graduation *</label>
              <input type="number" id="graduationYear" name="graduationYear" required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="gender" className="block font-semibold mb-2">Gender *</label>
              <select id="gender" name="gender" required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="Position" className="block font-semibold mb-2">Position *</label>
              <select id="Position" name="Position" required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select Position</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.title}>
                    {position.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="experience" className="block font-semibold mb-2">Experience (Years) *</label>
              <select id="experience" name="experience" required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select Experience</option>
                <option value="0">Fresher</option>
                <option value="0-1">0-1</option>
                <option value="1-3">1-3</option>
                <option value="3-5">3-5</option>
                <option value="5+">5+</option>
              </select>
            </div>

            <div>
              <label htmlFor="currentEmployer" className="block font-semibold mb-2">Currently Employed *</label>
              <select 
                id="currentEmployer" 
                name="currentEmployer" 
                value={isCurrentlyEmployed}
                onChange={handleEmploymentChange}
                required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="">Select Option</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* Conditional Salary Fields */}
            {isCurrentlyEmployed === 'Yes' && (
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold mb-4 text-blue-800">💰 Salary Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="currentSalary" className="block font-semibold mb-2">Current Salary (CTC per year) *</label>
                    <input 
                      type="number" 
                      id="currentSalary" 
                      name="currentSalary" 
                      placeholder="e.g., 500000"
                      required={isCurrentlyEmployed === 'Yes'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter amount in INR</p>
                  </div>

                  <div>
                    <label htmlFor="expectedSalary" className="block font-semibold mb-2">Expected Salary (CTC per year) *</label>
                    <input 
                      type="number" 
                      id="expectedSalary" 
                      name="expectedSalary" 
                      placeholder="e.g., 600000"
                      required={isCurrentlyEmployed === 'Yes'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      disabled={isSubmitting}
                    />
                    <p className="text-sm text-gray-500 mt-1">Enter amount in INR</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="skills" className="block font-semibold mb-2">Skill Set *</label>
              <input type="text" id="skills" name="skills" placeholder="e.g., JavaScript, Python, React" required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="location" className="block font-semibold mb-2">Current Location *</label>
              <input type="text" id="location" name="location" required 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="resume" className="block font-semibold mb-2">Upload Your Resume</label>
              <input 
                type="file" 
                id="resume" 
                name="resume" 
                accept=".doc,.docx,.pdf"
                onChange={handleResumeChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 mt-1">
                {resumeFile ? (
                  <span className="text-green-600">✅ {resumeFile.name} selected</span>
                ) : (
                  'Optional: Upload PDF, DOC, or DOCX file (Max 5MB)'
                )}
              </p>
            </div>

            <div className="flex justify-between gap-4">
              <button type="button" onClick={clearForm}
                className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button type="submit"
                className={`w-full px-6 py-3 rounded-lg transition-colors flex items-center justify-center ${
                  isSubmitting 
                    ? 'bg-red-300 cursor-not-allowed' 
                    : 'bg-red-400 hover:bg-red-500'
                } text-white`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}