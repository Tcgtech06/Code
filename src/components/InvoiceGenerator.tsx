import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Download, Search, Edit, X, Save, Eye, Copy } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  noOfPages?: number;
  noOfDays?: number;
  [key: string]: string | number | undefined; // Allow dynamic custom fields
}

interface CustomColumn {
  id: string;
  name: string;
  type: 'text' | 'number';
}

interface ColumnOrder {
  id: string;
  name: string;
  type: 'default' | 'custom';
}

interface Invoice {
  id?: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  status: string;
  version: number;
  originalId?: string;
  invoiceType?: string;
  customInvoiceTitle?: string;
  showNoOfPages?: boolean;
  showNoOfDays?: boolean;
  customColumns?: CustomColumn[];
  hiddenColumns?: string[];
  columnOrder?: ColumnOrder[];
}

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    clientPhone: '',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0, noOfPages: 0, noOfDays: 0 }],
    subtotal: 0,
    taxRate: 18,
    taxAmount: 0,
    total: 0,
    notes: '',
    status: 'draft',
    version: 1,
    invoiceType: 'INVOICE',
    customInvoiceTitle: '',
    showNoOfPages: false,
    showNoOfDays: false,
    customColumns: [],
    hiddenColumns: [],
    columnOrder: [
      { id: 'description', name: 'Description', type: 'default' },
      { id: 'quantity', name: 'Qty', type: 'default' },
      { id: 'rate', name: 'Rate', type: 'default' },
      { id: 'amount', name: 'Amount', type: 'default' }
    ]
  });

  const [showPreview, setShowPreview] = useState(false);
  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [showAddRows, setShowAddRows] = useState(false);
  const [includeDueDate, setIncludeDueDate] = useState(false);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState<'text' | 'number'>('text');
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateNextInvoiceNumber();
    loadSavedInvoices();
  }, []);

  const generateNextInvoiceNumber = async () => {
    try {
      // Use the database function to get next invoice number atomically
      const { data, error } = await supabase
        .rpc('get_next_invoice_number');

      if (error) throw error;

      const newInvoiceNumber = data;
      setInvoice(prev => ({ ...prev, invoiceNumber: newInvoiceNumber }));
    } catch (error) {
      console.error('Error generating invoice number:', error);
      // Fallback: query the last invoice number manually
      try {
        const { data, error: fallbackError } = await supabase
          .from('invoices')
          .select('invoice_number')
          .order('invoice_number', { ascending: false })
          .limit(1);

        if (fallbackError) throw fallbackError;

        let nextNumber = 1;
        if (data && data.length > 0) {
          const lastInvoiceNumber = data[0].invoice_number;
          const match = lastInvoiceNumber.match(/INV-(\d+)/);
          if (match) {
            nextNumber = parseInt(match[1]) + 1;
          }
        }

        const newInvoiceNumber = `INV-${nextNumber.toString().padStart(4, '0')}`;
        setInvoice(prev => ({ ...prev, invoiceNumber: newInvoiceNumber }));
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setInvoice(prev => ({ ...prev, invoiceNumber: `INV-${Date.now()}` }));
      }
    }
  };

  const loadSavedInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure all numeric properties are properly initialized
      const processedInvoices = (data || []).map(invoice => ({
        ...invoice,
        items: (invoice.items || []).map((item: any) => ({
          ...item,
          quantity: Number(item.quantity) || 0,
          rate: Number(item.rate) || 0,
          amount: Number(item.amount) || 0
        })),
        subtotal: Number(invoice.subtotal) || 0,
        taxRate: Number(invoice.tax_rate) || 0,
        taxAmount: Number(invoice.tax_amount) || 0,
        total: Number(invoice.total) || 0
      }));
      
      setSavedInvoices(processedInvoices);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setMessage({ text: 'Failed to load saved invoices', type: 'error' });
    }
  };

  const searchInvoices = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .or(`invoice_number.ilike.%${term}%,client_name.ilike.%${term}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure all numeric properties are properly initialized
      const processedResults = (data || []).map(invoice => ({
        ...invoice,
        items: (invoice.items || []).map((item: any) => ({
          ...item,
          quantity: Number(item.quantity) || 0,
          rate: Number(item.rate) || 0,
          amount: Number(item.amount) || 0
        })),
        subtotal: Number(invoice.subtotal) || 0,
        taxRate: Number(invoice.tax_rate) || 0,
        taxAmount: Number(invoice.tax_amount) || 0,
        total: Number(invoice.total) || 0
      }));
      
      setSearchResults(processedResults);
    } catch (error) {
      console.error('Error searching invoices:', error);
      setMessage({ text: 'Failed to search invoices', type: 'error' });
    }
  };

  const saveInvoiceToDatabase = async (invoiceData: Invoice, isEdit: boolean = false) => {
    try {
      setIsLoading(true);
      
      // Validate required fields
      if (!invoiceData.clientName.trim()) {
        setMessage({ text: 'Client name is required', type: 'error' });
        return null;
      }
      
      if (!invoiceData.invoiceNumber.trim()) {
        setMessage({ text: 'Invoice number is required', type: 'error' });
        return null;
      }
      
      if (invoiceData.items.length === 0 || invoiceData.items.every(item => !item.description.trim())) {
        setMessage({ text: 'At least one item with description is required', type: 'error' });
        return null;
      }
      
      // Ensure dueDate is not empty
      if (!invoiceData.dueDate.trim()) {
        setMessage({ text: 'Due date is required', type: 'error' });
        return null;
      }
      
      const invoiceToSave = {
        invoice_number: invoiceData.invoiceNumber,
        client_name: invoiceData.clientName,
        client_email: invoiceData.clientEmail || null,
        client_address: invoiceData.clientAddress || null,
        invoice_date: invoiceData.date,
        due_date: invoiceData.dueDate,
        items: invoiceData.items,
        subtotal: invoiceData.subtotal,
        tax_rate: invoiceData.taxRate,
        tax_amount: invoiceData.taxAmount,
        total: invoiceData.total,
        notes: invoiceData.notes || null,
        status: invoiceData.status || 'draft',
        version: invoiceData.version || 1,
        original_id: invoiceData.originalId || null
      };

      console.log('Attempting to save invoice:', invoiceToSave);

      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceToSave])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Invoice saved successfully:', data);
      setMessage({ text: `Invoice ${isEdit ? 'updated' : 'saved'} successfully!`, type: 'success' });
      loadSavedInvoices();
      
      return data;
    } catch (error) {
      console.error('Error saving invoice:', error);
      let errorMessage = 'Failed to save invoice';
      
      if (error instanceof Error) {
        if (error.message.includes('duplicate key')) {
          errorMessage = 'Invoice number already exists';
        } else if (error.message.includes('violates')) {
          errorMessage = 'Invalid data provided';
        } else if (error.message.includes('null value in column')) {
          errorMessage = 'Required field is missing';
        } else {
          errorMessage = error.message;
        }
      }
      
      setMessage({ text: errorMessage, type: 'error' });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const editInvoice = async (originalInvoice: any) => {
    // Create a new version of the invoice with proper field mapping
    const editedInvoice: Invoice = {
      id: undefined, // Remove ID to create new record
      invoiceNumber: originalInvoice.invoice_number || originalInvoice.invoiceNumber,
      date: originalInvoice.invoice_date || originalInvoice.date,
      dueDate: originalInvoice.due_date || originalInvoice.dueDate,
      clientName: originalInvoice.client_name || originalInvoice.clientName,
      clientEmail: originalInvoice.client_email || originalInvoice.clientEmail || '',
      clientAddress: originalInvoice.client_address || originalInvoice.clientAddress || '',
      clientPhone: originalInvoice.client_phone || originalInvoice.clientPhone || '',
      items: originalInvoice.items || [],
      subtotal: Number(originalInvoice.subtotal) || 0,
      taxRate: Number(originalInvoice.tax_rate || originalInvoice.taxRate) || 18,
      taxAmount: Number(originalInvoice.tax_amount || originalInvoice.taxAmount) || 0,
      total: Number(originalInvoice.total) || 0,
      notes: originalInvoice.notes || '',
      status: originalInvoice.status || 'draft',
      version: (originalInvoice.version || 1) + 1,
      originalId: originalInvoice.original_id || originalInvoice.originalId || originalInvoice.id,
      invoiceType: originalInvoice.invoice_type || originalInvoice.invoiceType || 'INVOICE',
      customInvoiceTitle: originalInvoice.custom_invoice_title || originalInvoice.customInvoiceTitle || '',
      showNoOfPages: originalInvoice.show_no_of_pages || originalInvoice.showNoOfPages || false,
      showNoOfDays: originalInvoice.show_no_of_days || originalInvoice.showNoOfDays || false,
      customColumns: originalInvoice.custom_columns || originalInvoice.customColumns || [],
      hiddenColumns: originalInvoice.hidden_columns || originalInvoice.hiddenColumns || [],
      columnOrder: originalInvoice.column_order || originalInvoice.columnOrder || [
        { id: 'description', name: 'Description', type: 'default' },
        { id: 'quantity', name: 'Qty', type: 'default' },
        { id: 'rate', name: 'Rate', type: 'default' },
        { id: 'amount', name: 'Amount', type: 'default' }
      ]
    };

    setInvoice(editedInvoice);
    setEditingInvoice(originalInvoice);
    setShowPreview(false);
    setShowSearch(false);
  };

  const addMultipleItems = (count: number) => {
    const newItems: InvoiceItem[] = [];
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: Date.now().toString() + i,
        description: '',
        quantity: 1,
        rate: 0,
        amount: 0,
        noOfPages: 0,
        noOfDays: 0
      });
    }
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, ...newItems]
    }));
  };

  const addItem = () => {
    addMultipleItems(1);
  };

  const clearAllItems = () => {
    if (window.confirm('Are you sure you want to clear all items?')) {
      setInvoice(prev => ({
        ...prev,
        items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0, noOfPages: 0, noOfDays: 0 }]
      }));
      calculateTotals();
    }
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    calculateTotals();
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
    setTimeout(calculateTotals, 0);
  };

  const calculateTotals = () => {
    setInvoice(prev => {
      const subtotal = prev.items.reduce((sum, item) => sum + item.amount, 0);
      const taxAmount = (subtotal * prev.taxRate) / 100;
      const total = subtotal + taxAmount;
      
      return {
        ...prev,
        subtotal,
        taxAmount,
        total
      };
    });
  };

  const toggleColumn = (columnName: string) => {
    setInvoice(prev => {
      const hiddenColumns = prev.hiddenColumns || [];
      const isHidden = hiddenColumns.includes(columnName);
      
      return {
        ...prev,
        hiddenColumns: isHidden 
          ? hiddenColumns.filter(col => col !== columnName)
          : [...hiddenColumns, columnName]
      };
    });
  };
  
  const isColumnVisible = (columnName: string) => {
    return !(invoice.hiddenColumns || []).includes(columnName);
  };
  
  const addCustomColumn = () => {
    if (!newColumnName.trim()) {
      setMessage({ text: 'Please enter a column name', type: 'error' });
      return;
    }
    
    const newColumn: CustomColumn = {
      id: `custom_${Date.now()}`,
      name: newColumnName.trim(),
      type: newColumnType
    };
    
    setInvoice(prev => ({
      ...prev,
      customColumns: [...(prev.customColumns || []), newColumn],
      columnOrder: [
        ...(prev.columnOrder || []),
        { id: newColumn.id, name: newColumn.name, type: 'custom' }
      ],
      items: prev.items.map(item => ({
        ...item,
        [newColumn.id]: newColumnType === 'number' ? 0 : ''
      }))
    }));
    
    setNewColumnName('');
    setNewColumnType('text');
    setShowAddColumn(false);
    setMessage({ text: 'Custom column added successfully!', type: 'success' });
  };
  
  const deleteCustomColumn = (columnId: string) => {
    setInvoice(prev => ({
      ...prev,
      customColumns: (prev.customColumns || []).filter(col => col.id !== columnId),
      columnOrder: (prev.columnOrder || []).filter(col => col.id !== columnId),
      items: prev.items.map(item => {
        const { [columnId]: removed, ...rest } = item;
        return rest as InvoiceItem;
      })
    }));
  };
  
  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (targetColumnId: string) => {
    if (!draggedColumn || draggedColumn === targetColumnId) {
      setDraggedColumn(null);
      return;
    }
    
    setInvoice(prev => {
      const columnOrder = [...(prev.columnOrder || [])];
      const draggedIndex = columnOrder.findIndex(col => col.id === draggedColumn);
      const targetIndex = columnOrder.findIndex(col => col.id === targetColumnId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      // Remove dragged column and insert at target position
      const [removed] = columnOrder.splice(draggedIndex, 1);
      columnOrder.splice(targetIndex, 0, removed);
      
      return {
        ...prev,
        columnOrder
      };
    });
    
    setDraggedColumn(null);
  };
  
  const getOrderedColumns = () => {
    const columnOrder = invoice.columnOrder || [];
    const orderedCols: Array<{ id: string; name: string; type: 'default' | 'custom' }> = [];
    
    // Add columns in order
    columnOrder.forEach(col => {
      if (isColumnVisible(col.id)) {
        orderedCols.push(col);
      }
    });
    
    // Add No of Pages and No of Days if enabled
    if (invoice.showNoOfPages) {
      orderedCols.push({ id: 'noOfPages', name: 'No of Pages', type: 'default' });
    }
    if (invoice.showNoOfDays) {
      orderedCols.push({ id: 'noOfDays', name: 'No of Days', type: 'default' });
    }
    
    return orderedCols;
  };
  
  const renderColumnHeader = (col: { id: string; name: string; type: 'default' | 'custom' }) => {
    return (
      <th
        key={col.id}
        className="border border-gray-300 px-4 py-2 text-center cursor-move bg-gray-50 hover:bg-gray-100"
        draggable
        onDragStart={() => handleDragStart(col.id)}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(col.id)}
      >
        <div className="flex items-center justify-center gap-1">
          <span className="select-none">☰</span>
          <span>{col.name}</span>
          <button
            onClick={() => col.type === 'custom' ? deleteCustomColumn(col.id) : toggleColumn(col.id)}
            className="text-red-600 hover:text-red-800"
            title={col.type === 'custom' ? 'Delete column' : 'Hide column'}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </th>
    );
  };
  
  const renderColumnCell = (item: InvoiceItem, col: { id: string; name: string; type: 'default' | 'custom' }) => {
    if (col.id === 'description') {
      return (
        <td key={col.id} className="border border-gray-300 px-4 py-2">
          <input
            type="text"
            value={item.description}
            onChange={(e) => updateItem(item.id, 'description', e.target.value)}
            className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500"
            placeholder="Item description"
          />
        </td>
      );
    }
    
    if (col.id === 'quantity') {
      return (
        <td key={col.id} className="border border-gray-300 px-4 py-2">
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
            className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 text-center"
            min="0"
            step="0.01"
          />
        </td>
      );
    }
    
    if (col.id === 'rate') {
      return (
        <td key={col.id} className="border border-gray-300 px-4 py-2">
          <input
            type="number"
            value={item.rate}
            onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
            className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 text-center"
            min="0"
            step="0.01"
          />
        </td>
      );
    }
    
    if (col.id === 'amount') {
      return (
        <td key={col.id} className="border border-gray-300 px-4 py-2 text-center font-medium">
          ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </td>
      );
    }
    
    if (col.id === 'noOfPages') {
      return (
        <td key={col.id} className="border border-gray-300 px-4 py-2">
          <input
            type="number"
            value={item.noOfPages || 0}
            onChange={(e) => updateItem(item.id, 'noOfPages', parseFloat(e.target.value) || 0)}
            className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 text-center"
            min="0"
            step="1"
          />
        </td>
      );
    }
    
    if (col.id === 'noOfDays') {
      return (
        <td key={col.id} className="border border-gray-300 px-4 py-2">
          <input
            type="number"
            value={item.noOfDays || 0}
            onChange={(e) => updateItem(item.id, 'noOfDays', parseFloat(e.target.value) || 0)}
            className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 text-center"
            min="0"
            step="1"
          />
        </td>
      );
    }
    
    // Custom column
    const customCol = (invoice.customColumns || []).find(c => c.id === col.id);
    if (customCol) {
      return (
        <td key={col.id} className="border border-gray-300 px-4 py-2">
          <input
            type={customCol.type}
            value={item[col.id] || (customCol.type === 'number' ? 0 : '')}
            onChange={(e) => updateItem(item.id, col.id, customCol.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
            className="w-full px-2 py-1 border rounded focus:ring-1 focus:ring-blue-500 text-center"
            placeholder={col.name}
          />
        </td>
      );
    }
    
    return null;
  };

  const updateTaxRate = (rate: number) => {
    setInvoice(prev => {
      const taxAmount = (prev.subtotal * rate) / 100;
      const total = prev.subtotal + taxAmount;
      
      return {
        ...prev,
        taxRate: rate,
        taxAmount,
        total
      };
    });
  };

  const saveInvoice = async () => {
    if (!invoice.clientName.trim()) {
      setMessage({ text: 'Please enter client name', type: 'error' });
      return;
    }

    // Ensure due date is set
    if (!invoice.dueDate.trim()) {
      // Set due date to 30 days from invoice date if not set
      const dueDate = new Date(invoice.date);
      dueDate.setDate(dueDate.getDate() + 30);
      setInvoice(prev => ({ ...prev, dueDate: dueDate.toISOString().split('T')[0] }));
    }

    const savedInvoice = await saveInvoiceToDatabase(invoice, !!editingInvoice);
    if (savedInvoice) {
      // Reset form for new invoice
      await generateNextInvoiceNumber();
      setInvoice(prev => ({
        ...prev,
        clientName: '',
        clientEmail: '',
        clientAddress: '',
        clientPhone: '',
        items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
        subtotal: 0,
        taxAmount: 0,
        total: 0,
        notes: '',
        status: 'draft',
        version: 1
      }));
      setEditingInvoice(null);
    }
  };

  const loadInvoice = (savedInvoice: any) => {
    // Map database fields to invoice state
    const mappedInvoice: Invoice = {
      id: savedInvoice.id,
      invoiceNumber: savedInvoice.invoice_number || savedInvoice.invoiceNumber,
      date: savedInvoice.invoice_date || savedInvoice.date,
      dueDate: savedInvoice.due_date || savedInvoice.dueDate,
      clientName: savedInvoice.client_name || savedInvoice.clientName,
      clientEmail: savedInvoice.client_email || savedInvoice.clientEmail || '',
      clientAddress: savedInvoice.client_address || savedInvoice.clientAddress || '',
      clientPhone: savedInvoice.client_phone || savedInvoice.clientPhone || '',
      items: savedInvoice.items || [],
      subtotal: Number(savedInvoice.subtotal) || 0,
      taxRate: Number(savedInvoice.tax_rate || savedInvoice.taxRate) || 18,
      taxAmount: Number(savedInvoice.tax_amount || savedInvoice.taxAmount) || 0,
      total: Number(savedInvoice.total) || 0,
      notes: savedInvoice.notes || '',
      status: savedInvoice.status || 'draft',
      version: savedInvoice.version || 1,
      originalId: savedInvoice.original_id || savedInvoice.originalId,
      invoiceType: savedInvoice.invoice_type || savedInvoice.invoiceType || 'INVOICE',
      customInvoiceTitle: savedInvoice.custom_invoice_title || savedInvoice.customInvoiceTitle || '',
      showNoOfPages: savedInvoice.show_no_of_pages || savedInvoice.showNoOfPages || false,
      showNoOfDays: savedInvoice.show_no_of_days || savedInvoice.showNoOfDays || false,
      customColumns: savedInvoice.custom_columns || savedInvoice.customColumns || [],
      hiddenColumns: savedInvoice.hidden_columns || savedInvoice.hiddenColumns || [],
      columnOrder: savedInvoice.column_order || savedInvoice.columnOrder || [
        { id: 'description', name: 'Description', type: 'default' },
        { id: 'quantity', name: 'Qty', type: 'default' },
        { id: 'rate', name: 'Rate', type: 'default' },
        { id: 'amount', name: 'Amount', type: 'default' }
      ]
    };
    
    setInvoice(mappedInvoice);
    setShowPreview(false);
    setShowSearch(false);
  };

  // Convert logo to base64 for PDF generation
  const [base64Logo, setBase64Logo] = useState<string>('');
  
  useEffect(() => {
    // Load and convert logo to base64
    const loadLogoAsBase64 = async () => {
      try {
        const response = await fetch('/Images/Tcgtech.png');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Logo(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error loading logo:', error);
        // Fallback to a 1x1 transparent pixel if logo fails to load
        setBase64Logo('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
      }
    };
    
    loadLogoAsBase64();
  }, []);

  const downloadInvoicePDF = async (invoiceData?: Invoice) => {
    const currentInvoice = invoiceData || invoice;
    
    console.log('Starting PDF generation from HTML for invoice:', currentInvoice);
    
    // Check if preview is already shown
    const wasPreviewShown = showPreview;
    
    // If preview is not shown, show it temporarily without user seeing it
    if (!showPreview) {
      setShowPreview(true);
      // Wait for the preview to render, then download and hide it again
      setTimeout(async () => {
        await generatePDFFromPreview(currentInvoice);
        // Hide preview again if it wasn't shown before
        if (!wasPreviewShown) {
          setShowPreview(false);
        }
      }, 500);
      return;
    }
    
    // If preview is already shown, just generate PDF
    await generatePDFFromPreview(currentInvoice);
  };
  
  const generatePDFFromPreview = async (currentInvoice: Invoice) => {
    if (!invoiceRef.current) {
      setMessage({ text: 'Invoice preview element not found. Please try again.', type: 'error' });
      return;
    }

    try {
      // Temporarily replace the image src with base64 for html2canvas
      const logoElement = invoiceRef.current.querySelector('img[alt="TCG TECH Logo"]') as HTMLImageElement;
      let originalLogoSrc = '';
      if (logoElement) {
        originalLogoSrc = logoElement.src;
        logoElement.src = base64Logo;
      }

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 1.5, // Reduced from 2 to 1.5 for smaller file size while maintaining quality
        useCORS: true, // Enable cross-origin image loading
        logging: false, // Disable logging for better performance
        allowTaint: false,
        backgroundColor: '#ffffff'
      });

      // Restore original logo src
      if (logoElement && originalLogoSrc) {
        logoElement.src = originalLogoSrc;
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.85); // Use JPEG with 85% quality instead of PNG for smaller size
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps= pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST'); // Use JPEG and FAST compression
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      // Generate filename with fallback
      const filename = currentInvoice.invoiceNumber && currentInvoice.invoiceNumber.trim() 
        ? `${currentInvoice.invoiceNumber}.pdf`
        : `Invoice_${currentInvoice.clientName || 'Unknown'}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdf.save(filename);
      setMessage({ text: 'PDF downloaded successfully!', type: 'success' });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setMessage({ text: 'Error generating PDF. Please try again.', type: 'error' });
    }
  };

  const deleteInvoice = async (invoiceId: string, invoiceNumber: string) => {
    if (!window.confirm(`Are you sure you want to delete invoice ${invoiceNumber}? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;

      setMessage({ text: 'Invoice deleted successfully!', type: 'success' });
      loadSavedInvoices();
      
      // Remove from search results if present
      setSearchResults(prev => prev.filter(invoice => invoice.id !== invoiceId));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      setMessage({ text: 'Failed to delete invoice', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const newInvoice = async () => {
    await generateNextInvoiceNumber();
    setInvoice(prev => ({
      ...prev,
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
      subtotal: 0,
      taxAmount: 0,
      total: 0,
      notes: '',
      status: 'draft',
      version: 1
    }));
    setShowPreview(false);
    setEditingInvoice(null);
  };

  useEffect(() => {
    calculateTotals();
  }, [invoice.items]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchInvoices(searchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoice Generator</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Search className="h-4 w-4 mr-2" />
            Search Invoices
          </button>
          <button
            onClick={newInvoice}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Search Section */}
      {showSearch && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Search Invoices</h3>
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by invoice number or client name..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Search Results:</h4>
              {searchResults.map((result) => (
                <div key={result.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{result.invoiceNumber}</div>
                    <div className="text-sm text-gray-600">{result.clientName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(result.date).toLocaleDateString()} • ₹{result.total.toLocaleString('en-IN')}
                      {result.version > 1 && <span className="ml-2 text-blue-600">(v{result.version})</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => loadInvoice(result)}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => downloadInvoicePDF(result)}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      PDF
                    </button>
                    <button
                      onClick={() => result.id && deleteInvoice(result.id, result.invoiceNumber)}
                      className="flex items-center px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!showPreview ? (
        /* Invoice Form */
        <div className="bg-white rounded-lg shadow-lg p-6">
          {editingInvoice && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <Copy className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  Editing: {editingInvoice.invoiceNumber} (Creating version {invoice.version})
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Invoice Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoice.invoiceNumber}
                    onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Type</label>
                  <select
                    value={invoice.invoiceType}
                    onChange={(e) => setInvoice(prev => ({ ...prev, invoiceType: e.target.value, customInvoiceTitle: '' }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INVOICE">INVOICE</option>
                    <option value="INVOICE OF YEARLY MAINTENANCE">INVOICE OF YEARLY MAINTENANCE</option>
                    <option value="INVOICE OF DOMAIN RENEWAL">INVOICE OF DOMAIN RENEWAL</option>
                    <option value="INVOICE FOR APP DEVELOPMENT">INVOICE FOR APP DEVELOPMENT</option>
                    <option value="INVOICE FOR WEB DEVELOPMENT">INVOICE FOR WEB DEVELOPMENT</option>
                    <option value="INVOICE FOR SOFTWARE DEVELOPMENT">INVOICE FOR SOFTWARE DEVELOPMENT</option>
                    <option value="INVOICE FOR DIGITAL MARKETING">INVOICE FOR DIGITAL MARKETING</option>
                    <option value="INVOICE FOR SEO SERVICES">INVOICE FOR SEO SERVICES</option>
                    <option value="INVOICE FOR HOSTING SERVICES">INVOICE FOR HOSTING SERVICES</option>
                    <option value="INVOICE FOR TECHNICAL SUPPORT">INVOICE FOR TECHNICAL SUPPORT</option>
                    <option value="INVOICE FOR CONSULTING SERVICES">INVOICE FOR CONSULTING SERVICES</option>
                    <option value="INVOICE FOR DESIGN SERVICES">INVOICE FOR DESIGN SERVICES</option>
                    <option value="INVOICE FOR TRAINING SERVICES">INVOICE FOR TRAINING SERVICES</option>
                    <option value="INVOICE FOR MAINTENANCE SERVICES">INVOICE FOR MAINTENANCE SERVICES</option>
                    <option value="INVOICE FOR CLOUD SERVICES">INVOICE FOR CLOUD SERVICES</option>
                    <option value="INVOICE FOR SECURITY SERVICES">INVOICE FOR SECURITY SERVICES</option>
                    <option value="INVOICE FOR DATA SERVICES">INVOICE FOR DATA SERVICES</option>
                    <option value="INVOICE FOR IT INFRASTRUCTURE">INVOICE FOR IT INFRASTRUCTURE</option>
                    <option value="INVOICE FOR NETWORK SERVICES">INVOICE FOR NETWORK SERVICES</option>
                    <option value="INVOICE FOR PROJECT MANAGEMENT">INVOICE FOR PROJECT MANAGEMENT</option>
                    <option value="CUSTOM">Custom Title</option>
                  </select>
                </div>
                {invoice.invoiceType === 'CUSTOM' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Custom Invoice Title</label>
                    <input
                      type="text"
                      value={invoice.customInvoiceTitle}
                      onChange={(e) => setInvoice(prev => ({ ...prev, customInvoiceTitle: e.target.value }))}
                      placeholder="Enter custom invoice title"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={invoice.date}
                    onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <input
                      type="checkbox"
                      checked={includeDueDate}
                      onChange={(e) => {
                        setIncludeDueDate(e.target.checked);
                        if (!e.target.checked) {
                          setInvoice(prev => ({ ...prev, dueDate: '' }));
                        } else {
                          setInvoice(prev => ({ ...prev, dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }));
                        }
                      }}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    Include Due Date
                  </label>
                  {includeDueDate && (
                    <input
                      type="date"
                      value={invoice.dueDate}
                      onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Client Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Client Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={invoice.clientName}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientName: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                  <input
                    type="email"
                    value={invoice.clientEmail}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Address</label>
                  <textarea
                    value={invoice.clientAddress}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientAddress: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={invoice.clientPhone}
                    onChange={(e) => setInvoice(prev => ({ ...prev, clientPhone: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Invoice Items</h3>
              <div className="flex gap-2">
                {!invoice.showNoOfPages && (
                  <button
                    onClick={() => setInvoice(prev => ({ ...prev, showNoOfPages: true }))}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add No of Pages
                  </button>
                )}
                {!invoice.showNoOfDays && (
                  <button
                    onClick={() => setInvoice(prev => ({ ...prev, showNoOfDays: true }))}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add No of Days
                  </button>
                )}
                <button
                  onClick={() => addMultipleItems(1)}
                  className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </button>
                {invoice.items.length > 1 && (
                  <button
                    onClick={clearAllItems}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </button>
                )}
              </div>
            </div>

            <div className="mb-2 text-sm text-gray-600">
              Total Items: {invoice.items.length}
            </div>
            
            {/* Column Management */}
            <div className="mb-4 flex gap-2 items-center">
              <button
                onClick={() => setShowAddColumn(!showAddColumn)}
                className="flex items-center px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Custom Column
              </button>
              
              {showAddColumn && (
                <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
                  <input
                    type="text"
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="Column name"
                    className="px-2 py-1 border rounded text-sm"
                  />
                  <select
                    value={newColumnType}
                    onChange={(e) => setNewColumnType(e.target.value as 'text' | 'number')}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                  </select>
                  <button
                    onClick={addCustomColumn}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowAddColumn(false)}
                    className="px-3 py-1 bg-gray-400 text-white text-sm rounded hover:bg-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {getOrderedColumns().map(col => renderColumnHeader(col))}
                    <th className="border border-gray-300 px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      {getOrderedColumns().map(col => renderColumnCell(item, col))}
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={invoice.items.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={invoice.notes}
                onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes or payment terms..."
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">₹{invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Tax Rate (GST) (%):</span>
                  <input
                    type="number"
                    value={invoice.taxRate}
                    onChange={(e) => updateTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border rounded text-center"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
                
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span className="font-medium">₹{invoice.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{invoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={saveInvoice}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Invoice'}
            </button>
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button
              onClick={() => downloadInvoicePDF()}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
          </div>

          {/* Saved Invoices */}
          {savedInvoices.length > 0 && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Recent Invoices</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedInvoices.slice(0, 6).map((savedInvoice) => (
                  <div key={savedInvoice.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{savedInvoice.invoiceType === 'CUSTOM' && savedInvoice.customInvoiceTitle 
                        ? savedInvoice.customInvoiceTitle 
                        : savedInvoice.invoiceType || 'INVOICE'} #{savedInvoice.invoiceNumber}</h4>
                        {savedInvoice.version > 1 && (
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            Version {savedInvoice.version}
                          </span>
                        )}
                        <p className="text-sm text-gray-600">{savedInvoice.clientName}</p>
                        <p className="text-sm text-gray-500">{new Date(savedInvoice.date).toLocaleDateString()}</p>
                      </div>
                      <span className="text-lg font-bold text-green-600">
                        ₹{savedInvoice.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editInvoice(savedInvoice)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => downloadInvoicePDF(savedInvoice)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        PDF
                      </button>
                      <button
                        onClick={() => savedInvoice.id && deleteInvoice(savedInvoice.id, savedInvoice.invoiceNumber)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Invoice Preview */
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Invoice Preview</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Back to Edit
              </button>
              <button
                onClick={() => downloadInvoicePDF()}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>

          {/* Invoice Template */}
          <div ref={invoiceRef} className="bg-white p-8 border">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <img 
                  src="/Images/Tcgtech.png"
                  alt="TCG TECH Logo"
                  className="h-32 w-32 mb-4"
                />
                <h1 className="text-2xl font-bold text-gray-800">TCG TECH</h1>
                <p className="text-gray-600">3/228, CHINNATHOTTAM, THOTTIAPALAYAM, COIMBATORE, TAMILNADU - 641669</p>
                <p className="text-gray-600">Email: contact@tcgtech.in</p>
                <p className="text-gray-600">Phone: 8072099570</p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-blue-600 mb-2">
                  {invoice.invoiceType === 'CUSTOM' && invoice.customInvoiceTitle 
                    ? invoice.customInvoiceTitle 
                    : invoice.invoiceType || 'INVOICE'}
                </h2>
                <p className="text-gray-600">{invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-500">Reg No: UDYAM-TN-03-0306653</p>
                {invoice.version > 1 && (
                  <p className="text-sm text-blue-600">Version {invoice.version}</p>
                )}
              </div>
            </div>

            {/* Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Bill To:</h3>
                <div className="text-gray-700">
                  <p className="font-medium">{invoice.clientName}</p>
                  <p>{invoice.clientEmail}</p>
                  <p className="whitespace-pre-line">{invoice.clientAddress}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Invoice Date: </span>
                    <span className="font-medium">{new Date(invoice.date).toLocaleDateString('en-IN')}</span>
                  </div>
                  {invoice.dueDate && (
                    <div>
                      <span className="text-gray-600">Due Date: </span>
                      <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-blue-50">
                    {getOrderedColumns().map(col => (
                      <th key={col.id} className="border border-gray-300 px-4 py-3 text-center">
                        {col.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      {getOrderedColumns().map(col => {
                        if (col.id === 'description') {
                          return (
                            <td key={col.id} className="border border-gray-300 px-4 py-3">
                              {item.description}
                            </td>
                          );
                        }
                        
                        if (col.id === 'quantity') {
                          return (
                            <td key={col.id} className="border border-gray-300 px-4 py-3 text-center">
                              {item.quantity}
                            </td>
                          );
                        }
                        
                        if (col.id === 'rate') {
                          return (
                            <td key={col.id} className="border border-gray-300 px-4 py-3 text-center">
                              {item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                          );
                        }
                        
                        if (col.id === 'amount') {
                          return (
                            <td key={col.id} className="border border-gray-300 px-4 py-3 text-center font-medium">
                              {item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                          );
                        }
                        
                        if (col.id === 'noOfPages') {
                          return (
                            <td key={col.id} className="border border-gray-300 px-4 py-3 text-center">
                              {item.noOfPages || 0}
                            </td>
                          );
                        }
                        
                        if (col.id === 'noOfDays') {
                          return (
                            <td key={col.id} className="border border-gray-300 px-4 py-3 text-center">
                              {item.noOfDays || 0}
                            </td>
                          );
                        }
                        
                        // Custom column
                        const customCol = (invoice.customColumns || []).find(c => c.id === col.id);
                        if (customCol) {
                          const value = item[col.id];
                          return (
                            <td key={col.id} className="border border-gray-300 px-4 py-3 text-center">
                              {customCol.type === 'number' && typeof value === 'number'
                                ? value.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                                : value || '-'}
                            </td>
                          );
                        }
                        
                        return null;
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2">
                  <div className="flex justify-between py-2">
                    <span>Subtotal:</span>
                    <span className="font-medium">₹{invoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Tax ({invoice.taxRate}%):</span>
                    <span className="font-medium">₹{invoice.taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-2">
                    <div className="flex justify-between py-2 text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{invoice.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Notes:</h3>
                <p className="text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded">{invoice.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="border-t pt-6 text-center text-gray-600">
              <p className="font-medium">Thank you for your business!</p>
              <p className="text-sm mt-2">TCG TECH - Transforming businesses through innovative technology solutions</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
