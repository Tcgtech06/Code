import { useState, useRef } from 'react';
import { Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface SalarySlip {
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  month: string;
  year: string;
  bankName: string;
  accountNumber: string;
  panNumber: string;
  workingDays: number;
  presentDays: number;
  basicSalary: number;
  hra: number;
  conveyance: number;
  medicalAllowance: number;
  otherAllowances: number;
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  otherDeductions: number;
}

export default function SalarySlipGenerator() {
  const [salarySlip, setSalarySlip] = useState<SalarySlip>({
    employeeName: '',
    employeeId: '',
    designation: '',
    department: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    bankName: '',
    accountNumber: '',
    panNumber: '',
    workingDays: 0,
    presentDays: 0,
    basicSalary: 0,
    hra: 0,
    conveyance: 0,
    medicalAllowance: 0,
    otherAllowances: 0,
    providentFund: 0,
    professionalTax: 0,
    incomeTax: 0,
    otherDeductions: 0,
  });

  const [showPreview, setShowPreview] = useState(false);
  const slipRef = useRef<HTMLDivElement>(null);

  const calculateEarnings = () => {
    return (
      salarySlip.basicSalary +
      salarySlip.hra +
      salarySlip.conveyance +
      salarySlip.medicalAllowance +
      salarySlip.otherAllowances
    );
  };

  const calculateDeductions = () => {
    return (
      salarySlip.providentFund +
      salarySlip.professionalTax +
      salarySlip.incomeTax +
      salarySlip.otherDeductions
    );
  };

  const calculateNetSalary = () => {
    return calculateEarnings() - calculateDeductions();
  };

  const updateField = (field: keyof SalarySlip, value: string | number) => {
    setSalarySlip(prev => ({ ...prev, [field]: value }));
  };

  const downloadAsPDF = async () => {
    if (!slipRef.current) return;

    try {
      const canvas = await html2canvas(slipRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SalarySlip_${salarySlip.employeeName}_${salarySlip.month}_${salarySlip.year}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const downloadAsWord = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Company Header
            new Paragraph({
              children: [new TextRun({ text: 'TCG TECHNOLOGY', bold: true, size: 32 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: 'SALARY SLIP', bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            
            // Month and Year
            new Paragraph({
              children: [
                new TextRun({ text: `Month: ${salarySlip.month} ${salarySlip.year}`, bold: true })
              ],
              spacing: { after: 300 }
            }),

            // Employee Details Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Employee Name', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(salarySlip.employeeName)] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Employee ID', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(salarySlip.employeeId)] }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Designation', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(salarySlip.designation)] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Department', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(salarySlip.department)] }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Bank Name', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(salarySlip.bankName)] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Account Number', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(salarySlip.accountNumber)] }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PAN Number', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(salarySlip.panNumber)] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Working Days', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph(`${salarySlip.presentDays}/${salarySlip.workingDays}`)] }),
                  ]
                }),
              ]
            }),

            // Spacing
            new Paragraph({ text: '', spacing: { after: 300 } }),

            // Earnings and Deductions Table
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'EARNINGS', bold: true })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'AMOUNT (₹)', bold: true })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'DEDUCTIONS', bold: true })], alignment: AlignmentType.CENTER })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'AMOUNT (₹)', bold: true })], alignment: AlignmentType.CENTER })] }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Basic Salary')] }),
                    new TableCell({ children: [new Paragraph(salarySlip.basicSalary.toLocaleString('en-IN'))] }),
                    new TableCell({ children: [new Paragraph('Provident Fund')] }),
                    new TableCell({ children: [new Paragraph(salarySlip.providentFund.toLocaleString('en-IN'))] }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('HRA')] }),
                    new TableCell({ children: [new Paragraph(salarySlip.hra.toLocaleString('en-IN'))] }),
                    new TableCell({ children: [new Paragraph('Professional Tax')] }),
                    new TableCell({ children: [new Paragraph(salarySlip.professionalTax.toLocaleString('en-IN'))] }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Conveyance')] }),
                    new TableCell({ children: [new Paragraph(salarySlip.conveyance.toLocaleString('en-IN'))] }),
                    new TableCell({ children: [new Paragraph('Income Tax')] }),
                    new TableCell({ children: [new Paragraph(salarySlip.incomeTax.toLocaleString('en-IN'))] }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Medical Allowance')] }),
                    new TableCell({ children: [new Paragraph(salarySlip.medicalAllowance.toLocaleString('en-IN'))] }),
                    new TableCell({ children: [new Paragraph('Other Deductions')] }),
                    new TableCell({ children: [new Paragraph(salarySlip.otherDeductions.toLocaleString('en-IN'))] }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Other Allowances')] }),
                    new TableCell({ children: [new Paragraph(salarySlip.otherAllowances.toLocaleString('en-IN'))] }),
                    new TableCell({ children: [new Paragraph('')] }),
                    new TableCell({ children: [new Paragraph('')] }),
                  ]
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TOTAL EARNINGS', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: calculateEarnings().toLocaleString('en-IN'), bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TOTAL DEDUCTIONS', bold: true })] })] }),
                    new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: calculateDeductions().toLocaleString('en-IN'), bold: true })] })] }),
                  ]
                }),
              ]
            }),

            // Net Salary
            new Paragraph({ text: '', spacing: { after: 300 } }),
            new Paragraph({
              children: [
                new TextRun({ text: `NET SALARY: ₹${calculateNetSalary().toLocaleString('en-IN')}`, bold: true, size: 28 })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Footer
            new Paragraph({
              children: [new TextRun({ text: 'This is a computer-generated salary slip and does not require a signature.', italics: true })],
              alignment: AlignmentType.CENTER
            }),
          ]
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `SalarySlip_${salarySlip.employeeName}_${salarySlip.month}_${salarySlip.year}.docx`);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Error generating Word document. Please try again.');
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Salary Slip Generator</h2>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FileText className="h-4 w-4 mr-2" />
          {showPreview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {!showPreview ? (
        /* Form */
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Employee Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
                <input
                  type="text"
                  value={salarySlip.employeeName}
                  onChange={(e) => updateField('employeeName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter employee name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                <input
                  type="text"
                  value={salarySlip.employeeId}
                  onChange={(e) => updateField('employeeId', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter employee ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                <input
                  type="text"
                  value={salarySlip.designation}
                  onChange={(e) => updateField('designation', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter designation"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <input
                  type="text"
                  value={salarySlip.department}
                  onChange={(e) => updateField('department', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter department"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
                  <select
                    value={salarySlip.month}
                    onChange={(e) => updateField('month', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year *</label>
                  <select
                    value={salarySlip.year}
                    onChange={(e) => updateField('year', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={salarySlip.bankName}
                  onChange={(e) => updateField('bankName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter bank name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={salarySlip.accountNumber}
                  onChange={(e) => updateField('accountNumber', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter account number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                <input
                  type="text"
                  value={salarySlip.panNumber}
                  onChange={(e) => updateField('panNumber', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter PAN number"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
                  <input
                    type="number"
                    value={salarySlip.workingDays}
                    onChange={(e) => updateField('workingDays', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Present Days</label>
                  <input
                    type="number"
                    value={salarySlip.presentDays}
                    onChange={(e) => updateField('presentDays', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Salary Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Earnings</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary (₹)</label>
                <input
                  type="number"
                  value={salarySlip.basicSalary}
                  onChange={(e) => updateField('basicSalary', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HRA (₹)</label>
                <input
                  type="number"
                  value={salarySlip.hra}
                  onChange={(e) => updateField('hra', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Conveyance (₹)</label>
                <input
                  type="number"
                  value={salarySlip.conveyance}
                  onChange={(e) => updateField('conveyance', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical Allowance (₹)</label>
                <input
                  type="number"
                  value={salarySlip.medicalAllowance}
                  onChange={(e) => updateField('medicalAllowance', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Allowances (₹)</label>
                <input
                  type="number"
                  value={salarySlip.otherAllowances}
                  onChange={(e) => updateField('otherAllowances', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Deductions</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provident Fund (₹)</label>
                <input
                  type="number"
                  value={salarySlip.providentFund}
                  onChange={(e) => updateField('providentFund', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Professional Tax (₹)</label>
                <input
                  type="number"
                  value={salarySlip.professionalTax}
                  onChange={(e) => updateField('professionalTax', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Income Tax (₹)</label>
                <input
                  type="number"
                  value={salarySlip.incomeTax}
                  onChange={(e) => updateField('incomeTax', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Deductions (₹)</label>
                <input
                  type="number"
                  value={salarySlip.otherDeductions}
                  onChange={(e) => updateField('otherDeductions', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-xl font-bold text-green-600">₹{calculateEarnings().toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-xl font-bold text-red-600">₹{calculateDeductions().toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Salary</p>
                <p className="text-xl font-bold text-blue-600">₹{calculateNetSalary().toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Preview */
        <div className="space-y-4">
          <div className="flex gap-4 justify-end">
            <button
              onClick={downloadAsPDF}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download as PDF
            </button>
            <button
              onClick={downloadAsWord}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download as Word
            </button>
          </div>

          {/* Salary Slip Preview */}
          <div ref={slipRef} className="bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
              <img 
                src="/Images/Tcgtech.png"
                alt="TCG TECH Logo"
                className="h-20 w-20 mx-auto mb-2"
              />
              <h1 className="text-2xl font-bold text-gray-800">TCG TECHNOLOGY</h1>
              <p className="text-lg font-semibold text-gray-600 mt-2">SALARY SLIP</p>
              <p className="text-sm text-gray-600 mt-1">{salarySlip.month} {salarySlip.year}</p>
            </div>

            {/* Employee Details */}
            <div className="mb-6">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold text-gray-700 bg-gray-50">Employee Name</td>
                    <td className="py-2 px-4">{salarySlip.employeeName}</td>
                    <td className="py-2 px-4 font-semibold text-gray-700 bg-gray-50">Employee ID</td>
                    <td className="py-2 px-4">{salarySlip.employeeId}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold text-gray-700 bg-gray-50">Designation</td>
                    <td className="py-2 px-4">{salarySlip.designation}</td>
                    <td className="py-2 px-4 font-semibold text-gray-700 bg-gray-50">Department</td>
                    <td className="py-2 px-4">{salarySlip.department}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold text-gray-700 bg-gray-50">Bank Name</td>
                    <td className="py-2 px-4">{salarySlip.bankName}</td>
                    <td className="py-2 px-4 font-semibold text-gray-700 bg-gray-50">Account Number</td>
                    <td className="py-2 px-4">{salarySlip.accountNumber}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-semibold text-gray-700 bg-gray-50">PAN Number</td>
                    <td className="py-2 px-4">{salarySlip.panNumber}</td>
                    <td className="py-2 px-4 font-semibold text-gray-700 bg-gray-50">Working Days</td>
                    <td className="py-2 px-4">{salarySlip.presentDays}/{salarySlip.workingDays}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Earnings and Deductions */}
            <div className="mb-6">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border border-gray-300 text-left font-semibold">EARNINGS</th>
                    <th className="py-2 px-4 border border-gray-300 text-right font-semibold">AMOUNT (₹)</th>
                    <th className="py-2 px-4 border border-gray-300 text-left font-semibold">DEDUCTIONS</th>
                    <th className="py-2 px-4 border border-gray-300 text-right font-semibold">AMOUNT (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300">Basic Salary</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{salarySlip.basicSalary.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-4 border border-gray-300">Provident Fund</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{salarySlip.providentFund.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300">HRA</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{salarySlip.hra.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-4 border border-gray-300">Professional Tax</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{salarySlip.professionalTax.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300">Conveyance</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{salarySlip.conveyance.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-4 border border-gray-300">Income Tax</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{salarySlip.incomeTax.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300">Medical Allowance</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{salarySlip.medicalAllowance.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-4 border border-gray-300">Other Deductions</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{salarySlip.otherDeductions.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border border-gray-300">Other Allowances</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{salarySlip.otherAllowances.toLocaleString('en-IN')}</td>
                    <td className="py-2 px-4 border border-gray-300"></td>
                    <td className="py-2 px-4 border border-gray-300"></td>
                  </tr>
                  <tr className="bg-gray-100 font-bold">
                    <td className="py-2 px-4 border border-gray-300">TOTAL EARNINGS</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{calculateEarnings().toLocaleString('en-IN')}</td>
                    <td className="py-2 px-4 border border-gray-300">TOTAL DEDUCTIONS</td>
                    <td className="py-2 px-4 border border-gray-300 text-right">{calculateDeductions().toLocaleString('en-IN')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Net Salary */}
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-800">NET SALARY</span>
                <span className="text-2xl font-bold text-blue-600">₹{calculateNetSalary().toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 italic border-t pt-4">
              <p>This is a computer-generated salary slip and does not require a signature.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
