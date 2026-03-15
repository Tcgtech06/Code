import React, { useState, useRef } from 'react';
import { Download, FileText, Mail, Calendar, User, Briefcase, AlertCircle } from 'lucide-react';
import jsPDF from 'jspdf';

interface LetterData {
  type: 'appointment' | 'relieving' | 'termination';
  companyName: string;
  candidateName: string;
  position: string;
  department: string;
  salaryType: 'project' | 'task' | 'custom';
  salary: string;
  startDate: string;
  reportingTo: string;
  workType: 'office' | 'wfh' | 'custom';
  customWorkType: string;
  employmentType: string;
  customEmploymentType: string;
  probationType: 'standard' | 'custom' | 'na';
  probationPeriod: string;
  customProbation: string;
  workingHours: string;
  benefits: string;
  jobDescription: string;
  terminationReason: string;
  lastWorkingDay: string;
  noticePeriod: string;
  exitFormalities: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  authorizedSignatoryName: string;
  authorizedSignatoryDesignation: 'HR' | 'CEO' | 'CTO' | 'custom';
  customDesignation: string;
}

export default function LetterGenerator() {
  const [letterType, setLetterType] = useState<'appointment' | 'relieving' | 'termination'>('appointment');
  const [showPreview, setShowPreview] = useState(false);
  const letterRef = useRef<HTMLDivElement>(null);
  
  const [letterData, setLetterData] = useState<LetterData>({
    type: 'appointment',
    companyName: 'TCG TECH',
    candidateName: '',
    position: '',
    department: '',
    salaryType: 'custom',
    salary: '',
    startDate: '',
    reportingTo: '',
    workType: 'office',
    customWorkType: '',
    employmentType: 'Full-time',
    customEmploymentType: '',
    probationType: 'standard',
    probationPeriod: '6 months',
    customProbation: '',
    workingHours: '9:30 AM - 6:30 PM, Monday - Friday',
    benefits: 'Health Insurance, PF, ESIC, Paid Leave',
    jobDescription: '',
    terminationReason: '',
    lastWorkingDay: '',
    noticePeriod: '30 days',
    exitFormalities: 'Handover of company assets, clearance of dues',
    contactPerson: 'HR Manager',
    contactEmail: 'contact@tcgtech.in',
    contactPhone: '8072099570',
    authorizedSignatoryName: '',
    authorizedSignatoryDesignation: 'HR',
    customDesignation: ''
  });

  const updateLetterData = (field: keyof LetterData, value: string) => {
    setLetterData(prev => ({ ...prev, [field]: value }));
  };
  
  const getSalaryDisplay = () => {
    if (letterData.salaryType === 'project') return 'As per Project';
    if (letterData.salaryType === 'task') return 'As per Task';
    return letterData.salary || '[Salary]';
  };
  
  const getWorkTypeDisplay = () => {
    if (letterData.workType === 'wfh') return 'Work from Home';
    if (letterData.workType === 'office') return 'Office';
    if (letterData.workType === 'custom') return letterData.customWorkType || '[Work Type]';
    return 'Office';
  };
  
  const getProbationDisplay = () => {
    if (letterData.probationType === 'na') return 'N/A';
    if (letterData.probationType === 'custom') return letterData.customProbation || '[Probation Period]';
    return letterData.probationPeriod;
  };

  const getDisplayEmploymentType = () => {
    if (letterData.employmentType === 'Custom' && letterData.customEmploymentType) {
      return letterData.customEmploymentType;
    }
    return letterData.employmentType;
  };

  const getAuthorizedSignatoryDesignation = () => {
    if (letterData.authorizedSignatoryDesignation === 'custom') {
      return letterData.customDesignation || '[Designation]';
    }
    return letterData.authorizedSignatoryDesignation;
  };

  const downloadLetterPDF = () => {
    if (!letterRef.current) return;

    // Validate custom fields
    if (letterType === 'appointment') {
      if (letterData.salaryType === 'custom' && !letterData.salary.trim()) {
        alert('Please enter salary amount when Custom salary type is selected');
        return;
      }
      if (letterData.workType === 'custom' && !letterData.customWorkType.trim()) {
        alert('Please enter custom work type when Custom is selected');
        return;
      }
      if (letterData.probationType === 'custom' && !letterData.customProbation.trim()) {
        alert('Please enter custom probation period when Custom is selected');
        return;
      }
      if (letterData.authorizedSignatoryDesignation === 'custom' && !letterData.customDesignation.trim()) {
        alert('Please enter custom designation when Custom is selected');
        return;
      }
    }

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    
    // Set font
    pdf.setFont('helvetica');
    
    if (letterType === 'appointment') {
      // Page 1: Appointment Letter Header and Main Content
      // Center title first
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('APPOINTMENT LETTER', pageWidth / 2, 30, { align: 'center' });
      
      // Logo on left, contact info on right
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TCG TECH', margin, 55);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Email: contact@tcgtech.in', pageWidth - margin - 60, 55);
      pdf.text('Phone: 8072099570', pageWidth - margin - 60, 61);
      
      // Recipient details
      let yPosition = 80;
      pdf.text(`Dear ${letterData.candidateName || '[Candidate Name]'},`, margin, yPosition);
      yPosition += 10;
      
      pdf.text('We are pleased to offer you the position of:', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text(letterData.position || '[Position]', margin + 10, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('in the ' + (letterData.department || '[Department]') + ' department at TCG TECH, with a joining date of ' + (letterData.startDate ? new Date(letterData.startDate).toLocaleDateString('de-DE') : '[DD.MM.YYYY]') + '.', margin + 10, yPosition);
      yPosition += 15;
      
      // Job Description section
      pdf.setFont('helvetica', 'bold');
      pdf.text('Job Description:', margin, yPosition);
      yPosition += 8;
      
      // Use custom job description if provided, otherwise use default responsibilities
      if (letterData.jobDescription && letterData.jobDescription.trim()) {
        pdf.setFont('helvetica', 'normal');
        const jobDescLines = pdf.splitTextToSize(letterData.jobDescription, contentWidth - 30);
        jobDescLines.forEach((line: string) => {
          pdf.text(line, margin + 10, yPosition);
          yPosition += 6;
        });
      } else {
        // Default responsibilities
        pdf.setFont('helvetica', 'normal');
        const responsibilities = [
          '• Perform assigned duties and responsibilities as per the job description',
          '• Maintain high standards of work quality and professionalism',
          '• Collaborate with team members and other departments',
          '• Follow company policies and procedures',
          '• Meet performance targets and deadlines'
        ];
        
        responsibilities.forEach((responsibility) => {
          pdf.text(responsibility, margin + 10, yPosition);
          yPosition += 6;
        });
      }
      
      yPosition += 10;
      
      // Employment Terms section
      pdf.setFont('helvetica', 'bold');
      pdf.text('Employment Terms:', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      
      // Only display fields that have values
      const employmentTerms = [];
      
      if (letterData.employmentType && letterData.employmentType.trim()) {
        employmentTerms.push(`• Employment Type: ${getDisplayEmploymentType()}`);
      }
      
      // Use salary display helper
      const salaryDisplay = getSalaryDisplay();
      if (salaryDisplay && salaryDisplay !== '[Salary]') {
        employmentTerms.push(`• Annual Salary: ${salaryDisplay}`);
      }
      
      if (letterData.startDate && letterData.startDate.trim()) {
        employmentTerms.push(`• Start Date: ${letterData.startDate}`);
      }
      
      // Use work type display helper
      const workTypeDisplay = getWorkTypeDisplay();
      if (workTypeDisplay && workTypeDisplay !== '[Work Type]') {
        employmentTerms.push(`• Work Type: ${workTypeDisplay}`);
      }
      
      if (letterData.workingHours && letterData.workingHours.trim()) {
        employmentTerms.push(`• Working Hours: ${letterData.workingHours}`);
      }
      
      // Use probation display helper
      const probationDisplay = getProbationDisplay();
      if (probationDisplay && probationDisplay !== '[Probation Period]') {
        employmentTerms.push(`• Probation Period: ${probationDisplay}`);
      }
      
      if (letterData.reportingTo && letterData.reportingTo.trim()) {
        employmentTerms.push(`• Reporting To: ${letterData.reportingTo}`);
      }
      
      // Display only filled terms
      employmentTerms.forEach((term) => {
        pdf.text(term, margin + 10, yPosition);
        yPosition += 6;
      });
      
      yPosition += 9;
      
      pdf.text('Please confirm your acceptance of this offer by signing below:', margin, yPosition);
      yPosition += 20;
      
      // Signature lines
      const signatoryText = (letterData.authorizedSignatoryName || '[Name]') + ', ' + getAuthorizedSignatoryDesignation();
      pdf.text(signatoryText, pageWidth - 80, yPosition);
      pdf.text('Authorized Signatory', pageWidth - 80, yPosition + 5);
      
      pdf.text('Candidate Signature', margin, yPosition + 5);
      
      // Add new page for Rules and Regulations
      pdf.addPage();
      
      // Page 2: Rules and Regulations
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TCG TECH - Rules and Regulations', margin, 30);
      
      yPosition = 50;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('1. Working Hours and Attendance', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${letterData.workingHours}`, margin + 5, yPosition);
      yPosition += 8;
      pdf.text('• Punctuality is essential. Late arrivals may affect performance evaluation', margin + 5, yPosition);
      yPosition += 6;
      pdf.text('• Prior approval required for any leave or absence', margin + 5, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('2. Probation Period', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text(`• Probation period: ${getProbationDisplay()}`, margin + 5, yPosition);
      yPosition += 6;
      pdf.text('• Performance will be evaluated during probation', margin + 5, yPosition);
      yPosition += 6;
      pdf.text('• Confirmation subject to satisfactory performance', margin + 5, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('3. Confidentiality', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text('• All company information is confidential', margin + 5, yPosition);
      yPosition += 6;
      pdf.text('• Do not disclose sensitive information to external parties', margin + 5, yPosition);
      yPosition += 6;
      pdf.text('• Maintain data security and privacy standards', margin + 5, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('4. Code of Conduct', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text('• Maintain professional behavior at all times', margin + 5, yPosition);
      yPosition += 6;
      pdf.text('• Respect colleagues and clients', margin + 5, yPosition);
      yPosition += 6;
      pdf.text('• Follow company dress code and policies', margin + 5, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('5. Property and Equipment', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.text('• Company property must be used responsibly', margin + 5, yPosition);
      yPosition += 6;
      pdf.text('• Return all equipment upon termination', margin + 5, yPosition);
      yPosition += 6;
      pdf.text('• Report any damage or loss immediately', margin + 5, yPosition);
      yPosition += 15;
      
      // NDA Section
      pdf.setFont('helvetica', 'bold');
      pdf.text('Non-Disclosure Agreement (NDA)', margin, yPosition);
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.text('By signing this offer letter, you agree to:', margin, yPosition);
      yPosition += 8;
      
      const ndaPoints = [
        '• Maintain confidentiality of all proprietary information',
        '• Not to use company information for personal gain',
        '• Return all confidential materials upon termination',
        '• Continue confidentiality obligations after employment ends',
        '• Respect intellectual property rights of the company'
      ];
      
      ndaPoints.forEach((point) => {
        pdf.text(point, margin + 5, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10;
      pdf.text('Violation of this NDA may result in legal action.', margin, yPosition);
      
      yPosition += 20;
      
      // Employee signature for NDA
      pdf.text('_________________________', margin, yPosition);
      pdf.text('Employee Signature', margin, yPosition + 5);
      
    } else if (letterType === 'relieving') {
      // Relieving Letter (Single Page)
      // Center title first
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RELIEVING LETTER', pageWidth / 2, 30, { align: 'center' });
      
      // Logo on left, contact info on right
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TCG TECH', margin, 55);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Email: contact@tcgtech.in', pageWidth - margin - 60, 55);
      pdf.text('Phone: 8072099570', pageWidth - margin - 60, 61);
      
      // Employee details
      let yPosition = 75;
      pdf.text('To:', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.text(letterData.candidateName || '[Employee Name]', margin + 10, yPosition);
      yPosition += 6;
      pdf.text(letterData.position || '[Position]', margin + 10, yPosition);
      yPosition += 6;
      pdf.text(letterData.department || '[Department]', margin + 10, yPosition);
      yPosition += 6;
      pdf.text('TCG TECH', margin + 10, yPosition);
      yPosition += 15;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Dear ' + (letterData.candidateName || '[Employee Name]') + ',', margin, yPosition);
      yPosition += 10;
      
      pdf.text('This letter serves as formal notification that your employment with TCG TECH is being terminated.', margin, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Employment Details:', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Position: ' + (letterData.position || '[Position]'), margin + 10, yPosition);
      yPosition += 6;
      pdf.text('Department: ' + (letterData.department || '[Department]'), margin + 10, yPosition);
      yPosition += 6;
      pdf.text('Last Working Day: ' + (letterData.lastWorkingDay || '[Last Working Day]'), margin + 10, yPosition);
      yPosition += 6;
      pdf.text('Notice Period: ' + letterData.noticePeriod, margin + 10, yPosition);
      yPosition += 15;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reason for Relieving:', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      const reasonLines = pdf.splitTextToSize(letterData.terminationReason || '[Reason for Relieving]', contentWidth - 20);
      reasonLines.forEach((line: string) => {
        pdf.text(line, margin + 10, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Exit Formalities:', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      const exitLines = pdf.splitTextToSize(letterData.exitFormalities, contentWidth - 20);
      exitLines.forEach((line: string) => {
        pdf.text(line, margin + 10, yPosition);
        yPosition += 6;
      });
      yPosition += 15;
      
      pdf.text('For any clarification regarding the termination process, please contact:', margin, yPosition);
      yPosition += 8;
      pdf.text(letterData.contactPerson + ' - ' + letterData.contactEmail + ' - ' + letterData.contactPhone, margin + 10, yPosition);
      yPosition += 15;
      
      pdf.text('We wish you the best in your future endeavors.', margin, yPosition);
      yPosition += 20;
      
      // Signature
      pdf.text('Sincerely,', margin, yPosition);
      yPosition += 15;
      pdf.text('_________________________', margin, yPosition);
      pdf.text(letterData.contactPerson, margin, yPosition + 5);
      pdf.text('HR Manager', margin, yPosition + 10);
      pdf.text('TCG TECH', margin, yPosition + 15);
    } else {
      // Termination Letter (Single Page)
      // Center title first
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TERMINATION LETTER', pageWidth / 2, 30, { align: 'center' });
      
      // Logo on left, contact info on right
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TCG TECH', margin, 55);
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Email: contact@tcgtech.in', pageWidth - margin - 60, 55);
      pdf.text('Phone: 8072099570', pageWidth - margin - 60, 61);
      
      // Employee details
      let yPosition = 75;
      pdf.text('To:', margin, yPosition);
      yPosition += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.text(letterData.candidateName || '[Employee Name]', margin + 10, yPosition);
      yPosition += 6;
      pdf.text(letterData.position || '[Position]', margin + 10, yPosition);
      yPosition += 6;
      pdf.text(letterData.department || '[Department]', margin + 10, yPosition);
      yPosition += 6;
      pdf.text('TCG TECH', margin + 10, yPosition);
      yPosition += 15;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Dear ' + (letterData.candidateName || '[Employee Name]') + ',', margin, yPosition);
      yPosition += 10;
      
      pdf.text('This letter serves as formal notification that your employment with TCG TECH', margin, yPosition);
      yPosition += 6;
      pdf.text('is being terminated effective ' + (letterData.lastWorkingDay || '[Termination Date]') + '.', margin, yPosition);
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Employment Details:', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      pdf.text('Position: ' + (letterData.position || '[Position]'), margin + 10, yPosition);
      yPosition += 6;
      pdf.text('Department: ' + (letterData.department || '[Department]'), margin + 10, yPosition);
      yPosition += 6;
      pdf.text('Termination Date: ' + (letterData.lastWorkingDay || '[Termination Date]'), margin + 10, yPosition);
      yPosition += 6;
      pdf.text('Notice Period: ' + letterData.noticePeriod, margin + 10, yPosition);
      yPosition += 15;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reason for Termination:', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      const terminationReasonLines = pdf.splitTextToSize(letterData.terminationReason || '[Reason for Termination]', contentWidth - 20);
      terminationReasonLines.forEach((line: string) => {
        pdf.text(line, margin + 10, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
      
      pdf.setFont('helvetica', 'bold');
      pdf.text('Exit Formalities:', margin, yPosition);
      yPosition += 8;
      
      pdf.setFont('helvetica', 'normal');
      const terminationExitLines = pdf.splitTextToSize(letterData.exitFormalities, contentWidth - 20);
      terminationExitLines.forEach((line: string) => {
        pdf.text(line, margin + 10, yPosition);
        yPosition += 6;
      });
      yPosition += 10;
      
      pdf.text('You are required to return all company property, including but not limited to:', margin, yPosition);
      yPosition += 6;
      pdf.text('• ID cards, access cards, and keys', margin + 10, yPosition);
      yPosition += 6;
      pdf.text('• Company-issued equipment (laptop, phone, etc.)', margin + 10, yPosition);
      yPosition += 6;
      pdf.text('• All confidential documents and materials', margin + 10, yPosition);
      yPosition += 15;
      
      pdf.text('For any clarification regarding the termination process, please contact:', margin, yPosition);
      yPosition += 8;
      pdf.text(letterData.contactPerson + ' - ' + letterData.contactEmail + ' - ' + letterData.contactPhone, margin + 10, yPosition);
      yPosition += 20;
      
      // Signature
      pdf.text('Sincerely,', margin, yPosition);
      yPosition += 15;
      pdf.text('_________________________', margin, yPosition);
      pdf.text(letterData.contactPerson, margin, yPosition + 5);
      pdf.text('HR Manager', margin, yPosition + 10);
      pdf.text('TCG TECH', margin, yPosition + 15);
    }
    
    const fileName = letterType === 'appointment' 
      ? `Appointment_Letter_${letterData.candidateName.replace(/\s+/g, '_')}.pdf`
      : letterType === 'relieving'
      ? `Relieving_Letter_${letterData.candidateName.replace(/\s+/g, '_')}.pdf`
      : `Termination_Letter_${letterData.candidateName.replace(/\s+/g, '_')}.pdf`;
    
    pdf.save(fileName);
  };

  const resetForm = () => {
    setLetterData({
      type: letterType,
      companyName: 'TCG TECH',
      candidateName: '',
      position: '',
      department: '',
      salaryType: 'custom',
      salary: '',
      startDate: '',
      reportingTo: '',
      workType: 'office',
      customWorkType: '',
      employmentType: 'Full-time',
      customEmploymentType: '',
      probationType: 'standard',
      probationPeriod: '6 months',
      customProbation: '',
      workingHours: '9:30 AM - 6:30 PM, Monday - Friday',
      benefits: 'Health Insurance, PF, ESIC, Paid Leave',
      jobDescription: '',
      terminationReason: '',
      lastWorkingDay: '',
      noticePeriod: '30 days',
      exitFormalities: 'Handover of company assets, clearance of dues',
      contactPerson: 'HR Manager',
      contactEmail: 'contact@tcgtech.in',
      contactPhone: '8072099570',
      authorizedSignatoryName: '',
      authorizedSignatoryDesignation: 'HR',
      customDesignation: ''
    });
    setShowPreview(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Letter Generator</h2>
        <div className="flex gap-3">
          <button
            onClick={() => {
              // Validate custom fields before preview
              if (letterType === 'appointment') {
                if (letterData.salaryType === 'custom' && !letterData.salary.trim()) {
                  alert('Please enter salary amount when Custom salary type is selected');
                  return;
                }
                if (letterData.workType === 'custom' && !letterData.customWorkType.trim()) {
                  alert('Please enter custom work type when Custom is selected');
                  return;
                }
                if (letterData.probationType === 'custom' && !letterData.customProbation.trim()) {
                  alert('Please enter custom probation period when Custom is selected');
                  return;
                }
                if (letterData.authorizedSignatoryDesignation === 'custom' && !letterData.customDesignation.trim()) {
                  alert('Please enter custom designation when Custom is selected');
                  return;
                }
              }
              setShowPreview(!showPreview);
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FileText className="h-4 w-4 mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={downloadLetterPDF}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Letter Type Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Select Letter Type</h3>
        <div className="flex gap-4">
          <button
            onClick={() => { setLetterType('appointment'); resetForm(); }}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              letterType === 'appointment'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Briefcase className="h-5 w-5 mr-2" />
            Appointment Letter
          </button>
          <button
            onClick={() => { setLetterType('relieving'); resetForm(); }}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              letterType === 'relieving'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FileText className="h-5 w-5 mr-2" />
            Relieving Letter
          </button>
          <button
            onClick={() => { setLetterType('termination'); resetForm(); }}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              letterType === 'termination'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            Termination Letter
          </button>
        </div>
      </div>

      {!showPreview ? (
        /* Form */
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-6">
            {letterType === 'appointment' ? 'Appointment Letter Details' : letterType === 'relieving' ? 'Relieving Letter Details' : 'Termination Letter Details'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {letterType === 'appointment' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name *</label>
                  <input
                    type="text"
                    value={letterData.candidateName}
                    onChange={(e) => updateLetterData('candidateName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter candidate name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <input
                    type="text"
                    value={letterData.position}
                    onChange={(e) => updateLetterData('position', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job position"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input
                    type="text"
                    value={letterData.department}
                    onChange={(e) => updateLetterData('department', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter department"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Type *</label>
                  <select
                    value={letterData.salaryType}
                    onChange={(e) => updateLetterData('salaryType', e.target.value as 'project' | 'task' | 'custom')}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="project">As per Project</option>
                    <option value="task">As per Task</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                {letterData.salaryType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Salary (Annual) *</label>
                    <input
                      type="text"
                      value={letterData.salary}
                      onChange={(e) => updateLetterData('salary', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., ₹6,00,000 per annum"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={letterData.startDate}
                    onChange={(e) => updateLetterData('startDate', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reporting To *</label>
                  <input
                    type="text"
                    value={letterData.reportingTo}
                    onChange={(e) => updateLetterData('reportingTo', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Manager name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Type *</label>
                  <select
                    value={letterData.workType}
                    onChange={(e) => updateLetterData('workType', e.target.value as 'office' | 'wfh' | 'custom')}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="office">Office</option>
                    <option value="wfh">Work from Home</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                {letterData.workType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Work Type *</label>
                    <input
                      type="text"
                      value={letterData.customWorkType}
                      onChange={(e) => updateLetterData('customWorkType', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter custom work type"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    value={letterData.employmentType}
                    onChange={(e) => updateLetterData('employmentType', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                
                {letterData.employmentType === 'Custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Employment Type</label>
                    <input
                      type="text"
                      value={letterData.customEmploymentType}
                      onChange={(e) => updateLetterData('customEmploymentType', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter custom employment type"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Probation Type *</label>
                  <select
                    value={letterData.probationType}
                    onChange={(e) => updateLetterData('probationType', e.target.value as 'standard' | 'custom' | 'na')}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">Standard (6 months)</option>
                    <option value="custom">Custom</option>
                    <option value="na">N/A</option>
                  </select>
                </div>
                
                {letterData.probationType === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Probation Period *</label>
                    <input
                      type="text"
                      value={letterData.customProbation}
                      onChange={(e) => updateLetterData('customProbation', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 3 months"
                      required
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                  <input
                    type="text"
                    value={letterData.workingHours}
                    onChange={(e) => updateLetterData('workingHours', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                  <textarea
                    value={letterData.benefits}
                    onChange={(e) => updateLetterData('benefits', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="List benefits separated by commas"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                  <textarea
                    value={letterData.jobDescription}
                    onChange={(e) => updateLetterData('jobDescription', e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the job responsibilities, duties, and requirements in detail..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Authorized Signatory Name *</label>
                  <input
                    type="text"
                    value={letterData.authorizedSignatoryName}
                    onChange={(e) => updateLetterData('authorizedSignatoryName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter signatory name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Signatory Designation *</label>
                  <select
                    value={letterData.authorizedSignatoryDesignation}
                    onChange={(e) => updateLetterData('authorizedSignatoryDesignation', e.target.value as 'HR' | 'CEO' | 'CTO' | 'custom')}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="HR">HR</option>
                    <option value="CEO">CEO</option>
                    <option value="CTO">CTO</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                {letterData.authorizedSignatoryDesignation === 'custom' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Designation *</label>
                    <input
                      type="text"
                      value={letterData.customDesignation}
                      onChange={(e) => updateLetterData('customDesignation', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter custom designation"
                      required
                    />
                  </div>
                )}
              </>
            ) : letterType === 'relieving' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
                  <input
                    type="text"
                    value={letterData.candidateName}
                    onChange={(e) => updateLetterData('candidateName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter employee name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <input
                    type="text"
                    value={letterData.position}
                    onChange={(e) => updateLetterData('position', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job position"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input
                    type="text"
                    value={letterData.department}
                    onChange={(e) => updateLetterData('department', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter department"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Working Day *</label>
                  <input
                    type="date"
                    value={letterData.lastWorkingDay}
                    onChange={(e) => updateLetterData('lastWorkingDay', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                  <input
                    type="text"
                    value={letterData.noticePeriod}
                    onChange={(e) => updateLetterData('noticePeriod', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 30 days"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={letterData.contactPerson}
                    onChange={(e) => updateLetterData('contactPerson', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="HR contact person"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={letterData.contactEmail}
                    onChange={(e) => updateLetterData('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={letterData.contactPhone}
                    onChange={(e) => updateLetterData('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Relieving *</label>
                  <textarea
                    value={letterData.terminationReason}
                    onChange={(e) => updateLetterData('terminationReason', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed reason for relieving (e.g., resignation, completion of contract, mutual agreement)"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exit Formalities</label>
                  <textarea
                    value={letterData.exitFormalities}
                    onChange={(e) => updateLetterData('exitFormalities', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="List exit formalities"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
                  <input
                    type="text"
                    value={letterData.candidateName}
                    onChange={(e) => updateLetterData('candidateName', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter employee name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                  <input
                    type="text"
                    value={letterData.position}
                    onChange={(e) => updateLetterData('position', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job position"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <input
                    type="text"
                    value={letterData.department}
                    onChange={(e) => updateLetterData('department', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter department"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Termination Date *</label>
                  <input
                    type="date"
                    value={letterData.lastWorkingDay}
                    onChange={(e) => updateLetterData('lastWorkingDay', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notice Period</label>
                  <input
                    type="text"
                    value={letterData.noticePeriod}
                    onChange={(e) => updateLetterData('noticePeriod', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Immediate, 30 days"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={letterData.contactPerson}
                    onChange={(e) => updateLetterData('contactPerson', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="HR contact person"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={letterData.contactEmail}
                    onChange={(e) => updateLetterData('contactEmail', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={letterData.contactPhone}
                    onChange={(e) => updateLetterData('contactPhone', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Termination *</label>
                  <textarea
                    value={letterData.terminationReason}
                    onChange={(e) => updateLetterData('terminationReason', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Provide detailed reason for termination (e.g., performance issues, misconduct, policy violation)"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exit Formalities</label>
                  <textarea
                    value={letterData.exitFormalities}
                    onChange={(e) => updateLetterData('exitFormalities', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="List exit formalities"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        /* Preview */
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div ref={letterRef} className="max-w-4xl mx-auto">
            {letterType === 'appointment' ? (
              /* Appointment Letter Preview */
              <div className="space-y-6">
                {/* Header with Logo and Company Info */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-blue-600 mb-6">APPOINTMENT LETTER</h2>
                  
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <img 
                        src="/Images/Tcgtech.png"
                        alt="TCG TECH Logo"
                        className="h-16 w-16"
                      />
                    </div>
                    <div className="text-right">
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">TCG TECH</h1>
                      <p className="text-gray-600 text-sm">Email: contact@tcgtech.in</p>
                      <p className="text-gray-600 text-sm">Phone: 8072099570</p>
                    </div>
                  </div>
                </div>
                
                {/* Letter Content */}
                <div className="space-y-4">
                  <p>Dear <strong>{letterData.candidateName || '[Candidate Name]'}</strong>,</p>
                  
                  <p>
                    We are pleased to offer you the position of <strong>{letterData.position || '[Position]'}</strong> 
                    in the <strong>{letterData.department || '[Department]'}</strong> department at TCG TECH, 
                    with a joining date of <strong>{letterData.startDate ? new Date(letterData.startDate).toLocaleDateString('de-DE') : '[DD.MM.YYYY]'}</strong>.
                  </p>
                  
                  {letterData.jobDescription && letterData.jobDescription.trim() ? (
                    <div className="mt-4">
                      <p className="font-medium">Job Description:</p>
                      <p className="whitespace-pre-line bg-gray-50 p-3 rounded mt-2">{letterData.jobDescription}</p>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="font-medium">Job Description:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4 bg-gray-50 p-3 rounded mt-2">
                        <li>Perform assigned duties and responsibilities as per the job description</li>
                        <li>Maintain high standards of work quality and professionalism</li>
                        <li>Collaborate with team members and other departments</li>
                        <li>Follow company policies and procedures</li>
                        <li>Meet performance targets and deadlines</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Employment Terms:</strong></p>
                    {letterData.employmentType && letterData.employmentType.trim() && (
                      <p>• Employment Type: {getDisplayEmploymentType()}</p>
                    )}
                    {getSalaryDisplay() !== '[Salary]' && (
                      <p>• Annual Salary: {getSalaryDisplay()}</p>
                    )}
                    {letterData.startDate && letterData.startDate.trim() && (
                      <p>• Start Date: {letterData.startDate}</p>
                    )}
                    {getWorkTypeDisplay() !== '[Work Type]' && (
                      <p>• Work Type: {getWorkTypeDisplay()}</p>
                    )}
                    {letterData.workingHours && letterData.workingHours.trim() && (
                      <p>• Working Hours: {letterData.workingHours}</p>
                    )}
                    {getProbationDisplay() !== '[Probation Period]' && (
                      <p>• Probation Period: {getProbationDisplay()}</p>
                    )}
                    {letterData.reportingTo && letterData.reportingTo.trim() && (
                      <p>• Reporting To: {letterData.reportingTo}</p>
                    )}
                  </div>
                  
                                    
                  <p>
                    Please confirm your acceptance of this offer by signing below. 
                    This offer is subject to satisfactory background verification and document verification.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-8 mt-12 items-end">
                    <div>
                      <p className="text-sm text-gray-600">Candidate Signature</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">{letterData.authorizedSignatoryName || '[Name]'}, {getAuthorizedSignatoryDesignation()}</p>
                      <p className="text-sm text-gray-600">Authorized Signatory</p>
                    </div>
                  </div>
                </div>
                
                {/* Rules and Regulations Preview */}
                <div className="mt-16 pt-8 border-t">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Rules and Regulations</h3>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-bold text-gray-700">1. Working Hours and Attendance</h4>
                      <p className="ml-4">{letterData.workingHours}</p>
                      <ul className="list-disc list-inside ml-8 space-y-1">
                        <li>Punctuality is essential. Late arrivals may affect performance evaluation</li>
                        <li>Prior approval required for any leave or absence</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-700">2. Probation Period</h4>
                      <ul className="list-disc list-inside ml-8 space-y-1">
                        <li>Probation period: {getProbationDisplay()}</li>
                        <li>Performance will be evaluated during probation</li>
                        <li>Confirmation subject to satisfactory performance</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-700">3. Confidentiality</h4>
                      <ul className="list-disc list-inside ml-8 space-y-1">
                        <li>All company information is confidential</li>
                        <li>Do not disclose sensitive information to external parties</li>
                        <li>Maintain data security and privacy standards</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-700">4. Code of Conduct</h4>
                      <ul className="list-disc list-inside ml-8 space-y-1">
                        <li>Maintain professional behavior at all times</li>
                        <li>Respect colleagues and clients</li>
                        <li>Follow company dress code and policies</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-gray-700">5. Property and Equipment</h4>
                      <ul className="list-disc list-inside ml-8 space-y-1">
                        <li>Company property must be used responsibly</li>
                        <li>Return all equipment upon termination</li>
                        <li>Report any damage or loss immediately</li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* NDA Section */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-3">Non-Disclosure Agreement (NDA)</h4>
                    <p className="text-sm text-gray-700 mb-3">
                      By signing this offer letter, you agree to:
                    </p>
                    <ul className="list-disc list-inside ml-8 space-y-1 text-sm text-gray-700">
                      <li>Maintain confidentiality of all proprietary information</li>
                      <li>Not to use company information for personal gain</li>
                      <li>Return all confidential materials upon termination</li>
                      <li>Continue confidentiality obligations after employment ends</li>
                      <li>Respect intellectual property rights of the company</li>
                    </ul>
                    <p className="text-sm text-red-600 mt-3 font-medium">
                      Violation of this NDA may result in legal action.
                    </p>
                    <div className="mt-6">
                      <p>_________________________</p>
                      <p className="text-sm text-gray-600">Employee Signature</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : letterType === 'relieving' ? (
              /* Relieving Letter Preview */
              <div className="space-y-6">
                {/* Header with Logo and Company Info */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-red-600 mb-6">RELIEVING LETTER</h2>
                  
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <img 
                        src="/Images/Tcgtech.png"
                        alt="TCG TECH Logo"
                        className="h-16 w-16"
                      />
                    </div>
                    <div className="text-right">
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">TCG TECH</h1>
                      <p className="text-gray-600 text-sm">Email: contact@tcgtech.in</p>
                      <p className="text-gray-600 text-sm">Phone: 8072099570</p>
                    </div>
                  </div>
                </div>
                
                {/* Letter Content */}
                <div className="space-y-4">
                  <div>
                    <p>To:</p>
                    <p><strong>{letterData.candidateName || '[Employee Name]'}</strong></p>
                    <p>{letterData.position || '[Position]'}</p>
                    <p>{letterData.department || '[Department]'}</p>
                    <p>TCG TECH</p>
                  </div>
                  
                  <p>Dear <strong>{letterData.candidateName || '[Employee Name]'}</strong>,</p>
                  
                  <p>
                    This letter serves as formal confirmation that your employment with TCG TECH as 
                    <strong> {letterData.position || '[Position]'}</strong> in the 
                    <strong> {letterData.department || '[Department]'}</strong> department has been concluded.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Employment Details:</strong></p>
                    <p>• Position: {letterData.position || '[Position]'}</p>
                    <p>• Department: {letterData.department || '[Department]'}</p>
                    <p>• Last Working Day: {letterData.lastWorkingDay || '[Last Working Day]'}</p>
                    <p>• Notice Period: {letterData.noticePeriod}</p>
                  </div>
                  
                  <div>
                    <p><strong>Reason for Relieving:</strong></p>
                    <p className="bg-gray-50 p-3 rounded">{letterData.terminationReason || '[Reason for Relieving]'}</p>
                  </div>
                  
                  <div>
                    <p><strong>Exit Formalities:</strong></p>
                    <p>{letterData.exitFormalities}</p>
                  </div>
                  
                  <p>
                    For any clarification regarding the relieving process, please contact 
                    <strong> {letterData.contactPerson}</strong> at 
                    <strong> {letterData.contactEmail}</strong> or <strong>{letterData.contactPhone}</strong>.
                  </p>
                  
                  <p>We wish you the best in your future endeavors.</p>
                  
                  <div className="mt-12">
                    <p>Sincerely,</p>
                    <p className="mt-4">_________________________</p>
                    <p><strong>{letterData.contactPerson}</strong></p>
                    <p>HR Manager</p>
                    <p>TCG TECH</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Termination Letter Preview */
              <div className="space-y-6">
                {/* Header with Logo and Company Info */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-red-600 mb-6">TERMINATION LETTER</h2>
                  
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <img 
                        src="/Images/Tcgtech.png"
                        alt="TCG TECH Logo"
                        className="h-16 w-16"
                      />
                    </div>
                    <div className="text-right">
                      <h1 className="text-2xl font-bold text-gray-800 mb-2">TCG TECH</h1>
                      <p className="text-gray-600 text-sm">Email: contact@tcgtech.in</p>
                      <p className="text-gray-600 text-sm">Phone: 8072099570</p>
                    </div>
                  </div>
                </div>
                
                {/* Letter Content */}
                <div className="space-y-4">
                  <div>
                    <p>To:</p>
                    <p><strong>{letterData.candidateName || '[Employee Name]'}</strong></p>
                    <p>{letterData.position || '[Position]'}</p>
                    <p>{letterData.department || '[Department]'}</p>
                    <p>TCG TECH</p>
                  </div>
                  
                  <p>Dear <strong>{letterData.candidateName || '[Employee Name]'}</strong>,</p>
                  
                  <p>
                    This letter serves as formal notification that your employment with TCG TECH 
                    is being terminated effective <strong>{letterData.lastWorkingDay || '[Termination Date]'}</strong>.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p><strong>Employment Details:</strong></p>
                    <p>• Position: {letterData.position || '[Position]'}</p>
                    <p>• Department: {letterData.department || '[Department]'}</p>
                    <p>• Termination Date: {letterData.lastWorkingDay || '[Termination Date]'}</p>
                    <p>• Notice Period: {letterData.noticePeriod}</p>
                  </div>
                  
                  <div>
                    <p><strong>Reason for Termination:</strong></p>
                    <p className="bg-gray-50 p-3 rounded">{letterData.terminationReason || '[Reason for Termination]'}</p>
                  </div>
                  
                  <div>
                    <p><strong>Exit Formalities:</strong></p>
                    <p className="bg-gray-50 p-3 rounded">{letterData.exitFormalities}</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p><strong>You are required to return all company property, including but not limited to:</strong></p>
                    <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                      <li>ID cards, access cards, and keys</li>
                      <li>Company-issued equipment (laptop, phone, etc.)</li>
                      <li>All confidential documents and materials</li>
                    </ul>
                  </div>
                  
                  <p>
                    For any clarification regarding the termination process, please contact 
                    <strong> {letterData.contactPerson}</strong> at 
                    <strong> {letterData.contactEmail}</strong> or <strong>{letterData.contactPhone}</strong>.
                  </p>
                  
                  <div className="mt-12">
                    <p>Sincerely,</p>
                    <p className="mt-4">_________________________</p>
                    <p><strong>{letterData.contactPerson}</strong></p>
                    <p>HR Manager</p>
                    <p>TCG TECH</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
