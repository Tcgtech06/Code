import React, { useState } from 'react';
import { FileText, Briefcase, AlertCircle, DollarSign } from 'lucide-react';
import InvoiceGenerator from './InvoiceGenerator';
import LetterGenerator from './LetterGenerator';
import SalarySlipGenerator from './SalarySlipGenerator';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'invoice' | 'letter' | 'salary'>('invoice');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage invoices and generate professional letters</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('invoice')}
                className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'invoice'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Invoice Generator
              </button>
              <button
                onClick={() => setActiveTab('letter')}
                className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'letter'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Briefcase className="h-5 w-5 mr-2" />
                Letter Generation
              </button>
              <button
                onClick={() => setActiveTab('salary')}
                className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'salary'
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DollarSign className="h-5 w-5 mr-2" />
                Salary Slip
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg">
          {activeTab === 'invoice' ? (
            <div className="p-6">
              <InvoiceGenerator />
            </div>
          ) : activeTab === 'letter' ? (
            <div className="p-6">
              <LetterGenerator />
            </div>
          ) : (
            <div className="p-6">
              <SalarySlipGenerator />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
