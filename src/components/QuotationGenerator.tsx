import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Eye, 
  RotateCcw, 
  Save, 
  FolderOpen, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Edit3
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Table, 
  TableCell, 
  TableRow, 
  WidthType, 
  AlignmentType
} from 'docx';
import { saveAs } from 'file-saver';

export interface QuotationItem {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface PaymentMilestone {
  percentage: number;
  description: string;
}

export interface QuotationData {
  // Quotation Info
  quotationNumber: string;
  date: string;
  validUntil: string;
  projectTitle: string;
  preparedBy: string;
  preparedByDesignation: string;

  // Company Details
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  companyWebsite: string;
  companyGst?: string;

  // Client Details
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientGst?: string;

  // Items / Scope
  items: QuotationItem[];

  // Financials
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  gstType: 'IGST' | 'SGST_CGST' | 'NONE';
  taxRate: number; // 18 for default GST
  currency: string;

  // Terms & Delivery
  estimatedTimeline: string;
  warrantyPeriod: string;
  paymentMilestones: PaymentMilestone[];
  termsAndConditions: string[];
  additionalNotes: string;
}

const PRESET_TEMPLATES = [
  {
    name: 'Custom Web Application',
    projectTitle: 'Full-Stack Web Application Development',
    items: [
      {
        id: '1',
        title: 'UI/UX Design & Wireframing',
        description: 'Interactive Figma mockups, responsive designs for mobile, tablet, and desktop viewports.',
        quantity: 1,
        unit: 'Milestone',
        rate: 15000,
        amount: 15000
      },
      {
        id: '2',
        title: 'Frontend Development (React / Next.js / Tailwind CSS)',
        description: 'Pixel-perfect, high-performance responsive frontend with interactive UI components and state management.',
        quantity: 1,
        unit: 'Milestone',
        rate: 35000,
        amount: 35000
      },
      {
        id: '3',
        title: 'Backend API & Database Architecture',
        description: 'Secure REST/GraphQL APIs, role-based authentication, PostgreSQL/Supabase database setup, and CRUD operations.',
        quantity: 1,
        unit: 'Milestone',
        rate: 30000,
        amount: 30000
      },
      {
        id: '4',
        title: 'Admin Control Panel & Analytics',
        description: 'Comprehensive administrative dashboard with management controls, reporting, and metrics overview.',
        quantity: 1,
        unit: 'Milestone',
        rate: 20000,
        amount: 20000
      },
      {
        id: '5',
        title: 'Deployment, CI/CD & Cloud Setup',
        description: 'Cloud hosting setup, SSL configuration, domain mapping, automated build pipeline, and production release.',
        quantity: 1,
        unit: 'Milestone',
        rate: 10000,
        amount: 10000
      }
    ]
  },
  {
    name: 'Mobile App Development (iOS & Android)',
    projectTitle: 'Cross-Platform Mobile Application Development',
    items: [
      {
        id: '1',
        title: 'Mobile UI/UX Design System',
        description: 'User journeys, modern mobile layouts, light/dark mode design for iOS and Android.',
        quantity: 1,
        unit: 'Milestone',
        rate: 20000,
        amount: 20000
      },
      {
        id: '2',
        title: 'Cross-Platform App Development (Flutter / React Native)',
        description: 'High-speed native app build with push notifications, offline storage, and responsive screen handling.',
        quantity: 1,
        unit: 'Milestone',
        rate: 55000,
        amount: 55000
      },
      {
        id: '3',
        title: 'Backend Services & Cloud Sync',
        description: 'Cloud API integration, real-time database listeners, secure user auth, and file uploads.',
        quantity: 1,
        unit: 'Milestone',
        rate: 35000,
        amount: 35000
      },
      {
        id: '4',
        title: 'App Store & Play Store Publishing',
        description: 'App package building, signing, store listing assets, compliance checks, and submission support.',
        quantity: 1,
        unit: 'Milestone',
        rate: 15000,
        amount: 15000
      }
    ]
  },
  {
    name: 'E-Commerce Platform',
    projectTitle: 'Full-Featured E-Commerce Web & Store Solution',
    items: [
      {
        id: '1',
        title: 'Storefront & Catalog Management',
        description: 'Product listing, category filtering, search, dynamic product variations, and cart checkout flow.',
        quantity: 1,
        unit: 'Milestone',
        rate: 35000,
        amount: 35000
      },
      {
        id: '2',
        title: 'Payment Gateway & Order Processing',
        description: 'Integration with Razorpay / Stripe / UPI, automated invoice generation, and customer order emails.',
        quantity: 1,
        unit: 'Milestone',
        rate: 20000,
        amount: 20000
      },
      {
        id: '3',
        title: 'Inventory & Vendor / Admin Dashboard',
        description: 'Stock tracking, sales analytics, discount coupon engine, and shipping partner integration.',
        quantity: 1,
        unit: 'Milestone',
        rate: 25000,
        amount: 25000
      }
    ]
  },
  {
    name: 'AI Chatbot & Automation Solution',
    projectTitle: 'AI-Powered Customer Assistant & Workflow Automation',
    items: [
      {
        id: '1',
        title: 'Knowledge Base Vectorization & RAG Pipeline',
        description: 'Custom domain knowledge indexing, document embedding, and semantic search retrieval.',
        quantity: 1,
        unit: 'Milestone',
        rate: 25000,
        amount: 25000
      },
      {
        id: '2',
        title: 'AI Chatbot Interface & Web Widget',
        description: 'Conversational chat widget with streaming responses, multi-language support, and lead capture.',
        quantity: 1,
        unit: 'Milestone',
        rate: 20000,
        amount: 20000
      },
      {
        id: '3',
        title: 'CRM & WhatsApp / Email Integration',
        description: 'Automated notification routing, customer handoff, and lead sync to central database.',
        quantity: 1,
        unit: 'Milestone',
        rate: 15000,
        amount: 15000
      }
    ]
  },
  {
    name: 'Annual Maintenance & Support (AMC)',
    projectTitle: 'Software Maintenance, Support & Security AMC',
    items: [
      {
        id: '1',
        title: 'Ongoing Server Monitoring & Uptime Maintenance',
        description: '24/7 server health tracking, database automated backups, SSL renewals, and error log audits.',
        quantity: 12,
        unit: 'Months',
        rate: 3000,
        amount: 36000
      },
      {
        id: '2',
        title: 'Bug Fixes, Minor Feature Enhancements & Patching',
        description: 'Dedicated tech support for resolving bugs, dependency security patches, and minor tweaks.',
        quantity: 12,
        unit: 'Months',
        rate: 4000,
        amount: 48000
      }
    ]
  }
];

export default function QuotationGenerator() {
  const [showPreview, setShowPreview] = useState(false);
  const [base64Logo, setBase64Logo] = useState<string>('');
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const quotationRef = useRef<HTMLDivElement>(null);

  // Default initial dates
  const today = new Date().toISOString().split('T')[0];
  const defaultValidUntil = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const generateQuotationNumber = () => {
    const year = new Date().getFullYear();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `TCG/QUO/${year}/${randomSuffix}`;
  };

  const [data, setData] = useState<QuotationData>({
    quotationNumber: generateQuotationNumber(),
    date: today,
    validUntil: defaultValidUntil,
    projectTitle: 'Custom Software Development & Implementation Proposal',
    preparedBy: 'TCG Tech Sales & Solutions Team',
    preparedByDesignation: 'Solutions Architect',

    companyName: 'TCG TECHNOLOGY',
    companyAddress: '3/228, Chinnathottam, Thottiapalayam, Coimbatore, Tamil Nadu - 641669',
    companyEmail: 'contact@tcgtech.in',
    companyPhone: '+91 80720 99570 / +91 97919 62802',
    companyWebsite: 'www.tcgtechnology.com',
    companyGst: '',

    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    clientGst: '',

    items: [
      {
        id: '1',
        title: 'Custom Software Architecture & Core Engine',
        description: 'Requirement analysis, system architecture, database schema design, and core backend implementation.',
        quantity: 1,
        unit: 'Scope',
        rate: 40000,
        amount: 40000
      },
      {
        id: '2',
        title: 'Client Web Interface & User Dashboard',
        description: 'Responsive, dynamic frontend dashboard with secure user authentication and custom views.',
        quantity: 1,
        unit: 'Scope',
        rate: 25000,
        amount: 25000
      }
    ],

    discountType: 'percentage',
    discountValue: 0,
    gstType: 'IGST',
    taxRate: 18,
    currency: 'INR',

    estimatedTimeline: '4 to 6 Weeks from Project Kickoff',
    warrantyPeriod: '3 Months Free Bug-Fix & Technical Support',
    paymentMilestones: [
      { percentage: 40, description: 'Advance Payment upon Project Initiation & Agreement' },
      { percentage: 40, description: 'Upon Beta Delivery & Client Milestone Review' },
      { percentage: 20, description: 'Upon Final Testing, Production Deployment & Handover' }
    ],
    termsAndConditions: [
      'The quotation is valid until the specified expiry date.',
      'Any additional features outside this agreed scope will be estimated and billed separately.',
      'Cloud hosting, third-party API subscription costs, and domain charges are not included unless stated.',
      'Deliverables will be published to staging environment for client review and acceptance.',
      'Payment is due within 7 business days from milestone invoice generation.'
    ],
    additionalNotes: 'We are committed to delivering high-quality, scalable, and secure software solutions tailored to your business goals. Thank you for choosing TCG Technology.'
  });

  // Convert logo to Base64 on mount for seamless PDF export
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/Images/Tcgtech.png');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setBase64Logo(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Error loading logo for quotation:', err);
      }
    };
    loadLogo();
  }, []);

  const showNotify = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper calculation functions
  const calculateSubtotal = () => {
    return data.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };

  const calculateDiscountAmount = () => {
    const subtotal = calculateSubtotal();
    if (data.discountType === 'percentage') {
      return (subtotal * (Number(data.discountValue) || 0)) / 100;
    }
    return Number(data.discountValue) || 0;
  };

  const calculateTaxableAmount = () => {
    return Math.max(0, calculateSubtotal() - calculateDiscountAmount());
  };

  const calculateTaxAmount = () => {
    if (data.gstType === 'NONE') return 0;
    const taxable = calculateTaxableAmount();
    return (taxable * (Number(data.taxRate) || 18)) / 100;
  };

  const calculateGrandTotal = () => {
    return Math.round(calculateTaxableAmount() + calculateTaxAmount());
  };

  // Convert Number to Words (Indian Format)
  const numberToWords = (num: number): string => {
    if (num === 0) return 'Zero Rupees Only';
    const a = [
      '', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ',
      'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n: number): string => {
      let str = '';
      if (n > 99) {
        str += a[Math.floor(n / 100)] + 'Hundred ';
        n %= 100;
      }
      if (n > 19) {
        str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
      } else if (n > 0) {
        str += a[n];
      }
      return str;
    };

    let n = Math.floor(num);
    const crore = Math.floor(n / 10000000);
    n %= 10000000;
    const lakh = Math.floor(n / 100000);
    n %= 100000;
    const thousand = Math.floor(n / 1000);
    n %= 1000;
    const remainder = n;

    let res = '';
    if (crore > 0) res += inWords(crore) + 'Crore ';
    if (lakh > 0) res += inWords(lakh) + 'Lakh ';
    if (thousand > 0) res += inWords(thousand) + 'Thousand ';
    if (remainder > 0) res += inWords(remainder);

    return (res.trim() + ' Rupees Only').replace(/\s+/g, ' ');
  };

  // Item modifications
  const handleItemChange = (id: string, field: keyof QuotationItem, value: string | number) => {
    setData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            const qty = field === 'quantity' ? Number(value) : item.quantity;
            const rate = field === 'rate' ? Number(value) : item.rate;
            updated.amount = (qty || 0) * (rate || 0);
          }
          return updated;
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      quantity: 1,
      unit: 'Unit',
      rate: 0,
      amount: 0
    };
    setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    if (data.items.length <= 1) {
      showNotify('At least one item is required in the quotation', 'error');
      return;
    }
    setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const applyPreset = (presetIndex: number) => {
    const preset = PRESET_TEMPLATES[presetIndex];
    if (!preset) return;
    setData(prev => ({
      ...prev,
      projectTitle: preset.projectTitle,
      items: preset.items.map((it, idx) => ({ ...it, id: `${Date.now()}_${idx}` }))
    }));
    showNotify(`Loaded template: "${preset.name}"`, 'success');
  };

  // Milestone modifications
  const handleMilestoneChange = (index: number, field: keyof PaymentMilestone, value: string | number) => {
    setData(prev => {
      const updated = [...prev.paymentMilestones];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, paymentMilestones: updated };
    });
  };

  const addMilestone = () => {
    setData(prev => ({
      ...prev,
      paymentMilestones: [...prev.paymentMilestones, { percentage: 20, description: 'Next Phase Milestone Delivery' }]
    }));
  };

  const removeMilestone = (index: number) => {
    setData(prev => ({
      ...prev,
      paymentMilestones: prev.paymentMilestones.filter((_, idx) => idx !== index)
    }));
  };

  // Terms modifications
  const handleTermChange = (index: number, value: string) => {
    setData(prev => {
      const updated = [...prev.termsAndConditions];
      updated[index] = value;
      return { ...prev, termsAndConditions: updated };
    });
  };

  const addTerm = () => {
    setData(prev => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, 'New customized agreement condition.']
    }));
  };

  const removeTerm = (index: number) => {
    setData(prev => ({
      ...prev,
      termsAndConditions: prev.termsAndConditions.filter((_, idx) => idx !== index)
    }));
  };

  // Save / Load Draft from LocalStorage
  const saveDraftLocally = () => {
    try {
      localStorage.setItem('tcg_quotation_draft', JSON.stringify(data));
      showNotify('Quotation draft saved successfully in browser!', 'success');
    } catch {
      showNotify('Failed to save draft locally', 'error');
    }
  };

  const loadDraftLocally = () => {
    try {
      const saved = localStorage.getItem('tcg_quotation_draft');
      if (saved) {
        setData(JSON.parse(saved));
        showNotify('Draft loaded successfully!', 'success');
      } else {
        showNotify('No saved draft found', 'info');
      }
    } catch {
      showNotify('Failed to load draft', 'error');
    }
  };

  const resetForm = () => {
    if (window.confirm('Are you sure you want to reset the quotation form? All unsaved inputs will be cleared.')) {
      setData({
        quotationNumber: generateQuotationNumber(),
        date: today,
        validUntil: defaultValidUntil,
        projectTitle: 'Custom Software Development Proposal',
        preparedBy: 'TCG Tech Sales & Solutions Team',
        preparedByDesignation: 'Solutions Architect',
        companyName: 'TCG TECHNOLOGY',
        companyAddress: '3/228, Chinnathottam, Thottiapalayam, Coimbatore, Tamil Nadu - 641669',
        companyEmail: 'contact@tcgtech.in',
        companyPhone: '+91 80720 99570 / +91 97919 62802',
        companyWebsite: 'www.tcgtechnology.com',
        companyGst: '',
        clientName: '',
        clientCompany: '',
        clientEmail: '',
        clientPhone: '',
        clientAddress: '',
        clientGst: '',
        items: [
          {
            id: '1',
            title: 'Custom Software Architecture & Core Engine',
            description: 'Requirement analysis, database architecture, and initial system build.',
            quantity: 1,
            unit: 'Scope',
            rate: 35000,
            amount: 35000
          }
        ],
        discountType: 'percentage',
        discountValue: 0,
        gstType: 'IGST',
        taxRate: 18,
        currency: 'INR',
        estimatedTimeline: '4 to 6 Weeks',
        warrantyPeriod: '3 Months Free Bug-Fix Support',
        paymentMilestones: [
          { percentage: 40, description: 'Advance Payment upon Project Initiation' },
          { percentage: 40, description: 'Upon Beta Delivery & Client Milestone Review' },
          { percentage: 20, description: 'Upon Final Testing & Production Deployment' }
        ],
        termsAndConditions: [
          'The quotation is valid until the specified expiry date.',
          'Any additional scope will be estimated and billed separately.',
          'Payment is due within 7 business days from milestone invoice generation.'
        ],
        additionalNotes: 'We are committed to delivering high-quality, scalable, and secure software solutions tailored to your business goals.'
      });
      showNotify('Quotation form reset to defaults.', 'info');
    }
  };

  // PDF Export
  const downloadAsPDF = async () => {
    setIsExporting(true);
    setShowPreview(true);

    setTimeout(async () => {
      if (!quotationRef.current) {
        showNotify('Quotation document reference not found.', 'error');
        setIsExporting(false);
        return;
      }

      try {
        const logoImg = quotationRef.current.querySelector('#tcg-quotation-logo') as HTMLImageElement;
        if (logoImg && base64Logo) {
          logoImg.src = base64Logo;
        }

        const canvas = await html2canvas(quotationRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const calculatedHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let heightLeft = calculatedHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, calculatedHeight);
        heightLeft -= pdfHeight;

        while (heightLeft >= 0) {
          position = heightLeft - calculatedHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, calculatedHeight);
          heightLeft -= pdfHeight;
        }

        const cleanClientName = (data.clientName || data.clientCompany || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
        const cleanQuoNum = data.quotationNumber.replace(/[^a-zA-Z0-9]/g, '_');
        pdf.save(`${cleanQuoNum}_${cleanClientName}_Quotation.pdf`);
        showNotify('Quotation PDF downloaded successfully!', 'success');
      } catch (error) {
        console.error('Error generating Quotation PDF:', error);
        showNotify('Failed to generate PDF. Please try again.', 'error');
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  // Word (.docx) Export
  const downloadAsWord = async () => {
    try {
      setIsExporting(true);

      const subtotal = calculateSubtotal();
      const discount = calculateDiscountAmount();
      const tax = calculateTaxAmount();
      const grandTotal = calculateGrandTotal();

      // Format currency
      const formatCurrency = (amount: number) => `₹ ${amount.toLocaleString('en-IN')}`;

      // Build Table Rows for Items
      const tableHeaderRow = new TableRow({
        tableHeader: true,
        children: [
          new TableCell({
            width: { size: 8, type: WidthType.PERCENTAGE },
            shading: { fill: '0284C7', type: ShadingType.CLEAR },
            children: [new Paragraph({ children: [new TextRun({ text: '#', bold: true, color: 'FFFFFF' })] })]
          }),
          new TableCell({
            width: { size: 52, type: WidthType.PERCENTAGE },
            shading: { fill: '0284C7', type: ShadingType.CLEAR },
            children: [new Paragraph({ children: [new TextRun({ text: 'Scope Description & Modules', bold: true, color: 'FFFFFF' })] })]
          }),
          new TableCell({
            width: { size: 12, type: WidthType.PERCENTAGE },
            shading: { fill: '0284C7', type: ShadingType.CLEAR },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Qty / Unit', bold: true, color: 'FFFFFF' })] })]
          }),
          new TableCell({
            width: { size: 14, type: WidthType.PERCENTAGE },
            shading: { fill: '0284C7', type: ShadingType.CLEAR },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Rate (INR)', bold: true, color: 'FFFFFF' })] })]
          }),
          new TableCell({
            width: { size: 14, type: WidthType.PERCENTAGE },
            shading: { fill: '0284C7', type: ShadingType.CLEAR },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Amount (INR)', bold: true, color: 'FFFFFF' })] })]
          })
        ]
      });

      const itemRows = data.items.map((item, idx) => {
        return new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `${idx + 1}` })] })]
            }),
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: item.title, bold: true, size: 22 })] }),
                new Paragraph({ children: [new TextRun({ text: item.description, size: 18, color: '555555' })] })
              ]
            }),
            new TableCell({
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${item.quantity} ${item.unit}` })] })]
            }),
            new TableCell({
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: formatCurrency(item.rate) })] })]
            }),
            new TableCell({
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: formatCurrency(item.amount), bold: true })] })]
            })
          ]
        });
      });

      // Payment Milestones Table
      const milestoneRows = data.paymentMilestones.map((m, idx) => {
        const milestoneAmount = Math.round((grandTotal * m.percentage) / 100);
        return new TableRow({
          children: [
            new TableCell({
              width: { size: 15, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: `Phase ${idx + 1} (${m.percentage}%)`, bold: true })] })]
            }),
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: m.description })] })]
            }),
            new TableCell({
              width: { size: 25, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: formatCurrency(milestoneAmount), bold: true })] })]
            })
          ]
        });
      });

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: {
                  top: 720,
                  bottom: 720,
                  left: 720,
                  right: 720
                }
              }
            },
            children: [
              // Header Title
              new Paragraph({
                children: [new TextRun({ text: 'TCG TECHNOLOGY', bold: true, size: 36, color: '0284C7' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 80 }
              }),
              new Paragraph({
                children: [new TextRun({ text: '3/228, Chinnathottam, Thottiapalayam, Coimbatore, Tamil Nadu - 641669', size: 18, color: '555555' })],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: 'Email: contact@tcgtech.in | Phone: +91 80720 99570 / +91 97919 62802 | Web: www.tcgtechnology.com', size: 18, color: '555555' })
                ],
                alignment: AlignmentType.CENTER,
                spacing: { after: 250 }
              }),

              // Divider
              new Paragraph({
                children: [new TextRun({ text: '_________________________________________________________________________________', color: '0284C7' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
              }),

              // Document Title
              new Paragraph({
                children: [new TextRun({ text: 'SOFTWARE DEVELOPMENT PROPOSAL & QUOTATION', bold: true, size: 28, color: '1E293B' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 }
              }),

              // Quotation & Client Details Table
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({ children: [new TextRun({ text: 'QUOTATION FOR (CLIENT):', bold: true, size: 20, color: '0284C7' })] }),
                          new Paragraph({ children: [new TextRun({ text: `Client Name: ${data.clientName || 'N/A'}`, bold: true })] }),
                          new Paragraph({ children: [new TextRun({ text: `Company / Org: ${data.clientCompany || 'N/A'}` })] }),
                          new Paragraph({ children: [new TextRun({ text: `Email: ${data.clientEmail || 'N/A'}` })] }),
                          new Paragraph({ children: [new TextRun({ text: `Phone: ${data.clientPhone || 'N/A'}` })] }),
                          new Paragraph({ children: [new TextRun({ text: `Address: ${data.clientAddress || 'N/A'}` })] }),
                          ...(data.clientGst ? [new Paragraph({ children: [new TextRun({ text: `GSTIN: ${data.clientGst}` })] })] : [])
                        ]
                      }),
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [
                          new Paragraph({ children: [new TextRun({ text: 'QUOTATION DETAILS:', bold: true, size: 20, color: '0284C7' })] }),
                          new Paragraph({ children: [new TextRun({ text: `Quotation No: ${data.quotationNumber}`, bold: true })] }),
                          new Paragraph({ children: [new TextRun({ text: `Date: ${new Date(data.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` })] }),
                          new Paragraph({ children: [new TextRun({ text: `Valid Until: ${new Date(data.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}` })] }),
                          new Paragraph({ children: [new TextRun({ text: `Estimated Delivery: ${data.estimatedTimeline}` })] }),
                          new Paragraph({ children: [new TextRun({ text: `Prepared By: ${data.preparedBy}` })] })
                        ]
                      })
                    ]
                  })
                ]
              }),

              // Project Title Box
              new Paragraph({
                spacing: { before: 200, after: 150 },
                children: [
                  new TextRun({ text: 'Project / Scope Title: ', bold: true, size: 22 }),
                  new TextRun({ text: data.projectTitle, size: 22, color: '0284C7', bold: true })
                ]
              }),

              // Scope & Pricing Table
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [tableHeaderRow, ...itemRows]
              }),

              // Pricing Summary Block
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { before: 200 },
                children: [new TextRun({ text: `Subtotal: ${formatCurrency(subtotal)}`, size: 20 })]
              }),
              ...(discount > 0 ? [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: `Discount: - ${formatCurrency(discount)}`, size: 20, color: '16A34A' })]
                })
              ] : []),
              ...(data.gstType !== 'NONE' ? [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: `GST (${data.gstType} @ ${data.taxRate}%): ${formatCurrency(tax)}`, size: 20 })]
                })
              ] : []),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 100 },
                children: [new TextRun({ text: `Grand Total: ${formatCurrency(grandTotal)}`, bold: true, size: 26, color: '0284C7' })]
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
                children: [new TextRun({ text: `Amount in Words: ${numberToWords(grandTotal)}`, italic: true, size: 18, color: '475569' })]
              }),

              // Milestones Section
              new Paragraph({
                children: [new TextRun({ text: 'Payment Milestones & Schedule', bold: true, size: 22, color: '0284C7' })],
                spacing: { before: 200, after: 100 }
              }),
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: [
                  new TableRow({
                    tableHeader: true,
                    children: [
                      new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9', type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: 'Milestone', bold: true })] })] }),
                      new TableCell({ width: { size: 60, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9', type: ShadingType.CLEAR }, children: [new Paragraph({ children: [new TextRun({ text: 'Deliverable Description', bold: true })] })] }),
                      new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, shading: { fill: 'F1F5F9', type: ShadingType.CLEAR }, children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Amount', bold: true })] })] })
                    ]
                  }),
                  ...milestoneRows
                ]
              }),

              // Terms & Conditions
              new Paragraph({
                children: [new TextRun({ text: 'Terms & Conditions', bold: true, size: 22, color: '0284C7' })],
                spacing: { before: 250, after: 100 }
              }),
              ...data.termsAndConditions.map((term, i) =>
                new Paragraph({
                  children: [new TextRun({ text: `${i + 1}. ${term}`, size: 18, color: '475569' })],
                  spacing: { after: 50 }
                })
              ),

              // Warranty & Support
              new Paragraph({
                children: [
                  new TextRun({ text: 'Warranty & Free Support: ', bold: true, size: 18 }),
                  new TextRun({ text: data.warrantyPeriod, size: 18, color: '16A34A', bold: true })
                ],
                spacing: { before: 100, after: 200 }
              }),

              // Authorization Signatures
              new Paragraph({
                spacing: { before: 300 },
                children: [new TextRun({ text: '_______________________________                      _______________________________', color: '94A3B8' })]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Authorized Signatory (TCG Technology)                     Client Acceptance & Stamp`, bold: true, size: 18 })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: `Name: ${data.preparedBy} (${data.preparedByDesignation})`, size: 16, color: '64748B' })
                ]
              })
            ]
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      const cleanClientName = (data.clientName || data.clientCompany || 'Client').replace(/[^a-zA-Z0-9]/g, '_');
      const cleanQuoNum = data.quotationNumber.replace(/[^a-zA-Z0-9]/g, '_');
      saveAs(blob, `${cleanQuoNum}_${cleanClientName}_Quotation.docx`);
      showNotify('Quotation Word (.docx) downloaded successfully!', 'success');
    } catch (error) {
      console.error('Error generating Word docx:', error);
      showNotify('Failed to generate Word document.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const subtotal = calculateSubtotal();
  const discountAmount = calculateDiscountAmount();
  const taxAmount = calculateTaxAmount();
  const grandTotal = calculateGrandTotal();

  return (
    <div className="space-y-6">
      {/* Top Banner / Notification */}
      {notification && (
        <div className={`p-4 rounded-xl shadow-md flex items-center justify-between transition-all ${
          notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border border-red-200 text-red-800' :
          'bg-blue-50 border border-blue-200 text-blue-800'
        }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-medium text-sm">{notification.text}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* Control Header & Action Buttons */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Software Quotation Generator</h2>
              <p className="text-sm text-gray-500">Create, customize, and export professional client proposals & quotations in PDF and Word format.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm ${
              showPreview 
                ? 'bg-gray-800 text-white hover:bg-gray-900' 
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            {showPreview ? <Edit3 className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? 'Back to Editor' : 'Live Preview'}
          </button>

          <button
            onClick={downloadAsPDF}
            disabled={isExporting}
            className="flex items-center px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium text-sm shadow-sm transition-all disabled:opacity-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Generating...' : 'Download PDF'}
          </button>

          <button
            onClick={downloadAsWord}
            disabled={isExporting}
            className="flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-medium text-sm shadow-sm transition-all disabled:opacity-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Word (.docx)
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          <button
            onClick={saveDraftLocally}
            title="Save draft in browser"
            className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-gray-200 transition-colors"
          >
            <Save className="h-4 w-4" />
          </button>

          <button
            onClick={loadDraftLocally}
            title="Load saved draft"
            className="p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-gray-200 transition-colors"
          >
            <FolderOpen className="h-4 w-4" />
          </button>

          <button
            onClick={resetForm}
            title="Reset form"
            className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-gray-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Preset Software Templates Bar */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-4 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-blue-900 font-semibold text-sm">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span>Quick 1-Click Software Presets:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_TEMPLATES.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(idx)}
              className="px-3 py-1.5 bg-white hover:bg-blue-600 hover:text-white text-gray-700 text-xs font-medium rounded-lg border border-blue-200 shadow-sm transition-all"
            >
              + {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Form Editor OR Preview */}
      {!showPreview ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main 2 Cols: Details & Scope */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Quotation & Project Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2 border-b pb-3">
                <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                <span>Quotation & Project Metadata</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Quotation Number</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={data.quotationNumber}
                      onChange={(e) => setData({ ...data, quotationNumber: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setData({ ...data, quotationNumber: generateQuotationNumber() })}
                      title="Generate new number"
                      className="p-2 border rounded-xl hover:bg-gray-100 text-gray-600"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Quotation Date</label>
                  <input
                    type="date"
                    value={data.date}
                    onChange={(e) => setData({ ...data, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Valid Until</label>
                  <input
                    type="date"
                    value={data.validUntil}
                    onChange={(e) => setData({ ...data, validUntil: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Project / Proposal Title</label>
                <input
                  type="text"
                  value={data.projectTitle}
                  onChange={(e) => setData({ ...data, projectTitle: e.target.value })}
                  placeholder="e.g., Hospital Management System Software Proposal"
                  className="w-full px-3 py-2.5 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Estimated Delivery Timeline</label>
                  <input
                    type="text"
                    value={data.estimatedTimeline}
                    onChange={(e) => setData({ ...data, estimatedTimeline: e.target.value })}
                    placeholder="e.g., 4 to 6 Weeks"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Warranty & Support Period</label>
                  <input
                    type="text"
                    value={data.warrantyPeriod}
                    onChange={(e) => setData({ ...data, warrantyPeriod: e.target.value })}
                    placeholder="e.g., 3 Months Free Support"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Client Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2 border-b pb-3">
                <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                <span>Client & Organization Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Client Contact Name *</label>
                  <input
                    type="text"
                    value={data.clientName}
                    onChange={(e) => setData({ ...data, clientName: e.target.value })}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    value={data.clientCompany}
                    onChange={(e) => setData({ ...data, clientCompany: e.target.value })}
                    placeholder="e.g., NexaTech Enterprises Pvt Ltd"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Client Email Address</label>
                  <input
                    type="email"
                    value={data.clientEmail}
                    onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
                    placeholder="e.g., client@company.com"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Client Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={data.clientPhone}
                    onChange={(e) => setData({ ...data, clientPhone: e.target.value })}
                    placeholder="e.g., +91 98765 43210"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Client Billing Address</label>
                  <input
                    type="text"
                    value={data.clientAddress}
                    onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                    placeholder="e.g., 45, Avinashi Road, Coimbatore, Tamil Nadu - 641018"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Client GSTIN (Optional)</label>
                  <input
                    type="text"
                    value={data.clientGst || ''}
                    onChange={(e) => setData({ ...data, clientGst: e.target.value })}
                    placeholder="e.g., 33AAAAA0000A1Z5"
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 uppercase"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Software Modules & Pricing Items */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-green-600"></span>
                  <span>Software Modules & Deliverables Pricing</span>
                </h3>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Module
                </button>
              </div>

              <div className="space-y-4">
                {data.items.map((item, index) => (
                  <div key={item.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-300 transition-all space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shrink-0 mt-1">
                        {index + 1}
                      </span>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">Module / Feature Name *</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleItemChange(item.id, 'title', e.target.value)}
                            placeholder="e.g., Admin Control Panel & User Role Management"
                            className="w-full px-3 py-1.5 border rounded-lg text-sm font-semibold focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Unit / Scope</label>
                          <input
                            type="text"
                            value={item.unit}
                            onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                            placeholder="Milestone / Qty"
                            className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        title="Remove item"
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Detailed Technical Scope / Features Included</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                        placeholder="Detail the deliverable components, technology stack, responsive UI, validations, and security checks..."
                        className="w-full px-3 py-1.5 border rounded-lg text-xs focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-gray-200/60">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Rate / Price (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={item.rate}
                          onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Total Amount (₹)</label>
                        <div className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-800">
                          ₹ {(item.amount || 0).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 4: Payment Milestones */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-purple-600"></span>
                  <span>Payment Milestones Breakdown</span>
                </h3>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl text-xs font-semibold border border-purple-200 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Milestone
                </button>
              </div>

              <div className="space-y-3">
                {data.paymentMilestones.map((milestone, idx) => {
                  const milestoneAmount = Math.round((grandTotal * milestone.percentage) / 100);
                  return (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="w-24 shrink-0">
                        <label className="block text-xs font-medium text-gray-500 mb-0.5">Share (%)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={milestone.percentage}
                          onChange={(e) => handleMilestoneChange(idx, 'percentage', Number(e.target.value))}
                          className="w-full px-2 py-1.5 border rounded-lg text-sm font-bold bg-white"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-0.5">Deliverable Trigger</label>
                        <input
                          type="text"
                          value={milestone.description}
                          onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                          className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white"
                        />
                      </div>
                      <div className="w-32 text-right shrink-0">
                        <label className="block text-xs font-medium text-gray-500 mb-0.5">Est. Amount</label>
                        <div className="text-sm font-bold text-purple-700">₹ {milestoneAmount.toLocaleString('en-IN')}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMilestone(idx)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg mt-4"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 5: Terms & Conditions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                  <span>Terms & Conditions</span>
                </h3>
                <button
                  type="button"
                  onClick={addTerm}
                  className="flex items-center px-3 py-1.5 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 rounded-xl text-xs font-semibold border border-yellow-200 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Term
                </button>
              </div>

              <div className="space-y-2">
                {data.termsAndConditions.map((term, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => handleTermChange(idx, e.target.value)}
                      className="flex-1 px-3 py-1.5 border rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeTerm(idx)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Calculations & Signatory Details */}
          <div className="space-y-6">
            {/* Financial Summary Box */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2 border-b pb-3">
                <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                <span>Financial Calculations</span>
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Scope Subtotal:</span>
                  <span className="font-semibold text-gray-900">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Discount Inputs */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-600">Discount:</span>
                    <div className="flex text-xs rounded-lg border overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setData({ ...data, discountType: 'percentage' })}
                        className={`px-2 py-0.5 ${data.discountType === 'percentage' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-50 text-gray-600'}`}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() => setData({ ...data, discountType: 'fixed' })}
                        className={`px-2 py-0.5 ${data.discountType === 'fixed' ? 'bg-blue-600 text-white font-bold' : 'bg-gray-50 text-gray-600'}`}
                      >
                        ₹ Fixed
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={data.discountValue}
                    onChange={(e) => setData({ ...data, discountValue: Number(e.target.value) })}
                    placeholder="Discount amount"
                    className="w-full px-3 py-1.5 border rounded-lg text-sm bg-white"
                  />
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-green-600 mt-1">
                      <span>Discount applied:</span>
                      <span>- ₹ {discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>

                {/* Tax / GST Selection */}
                <div className="pt-2 border-t">
                  <label className="block text-xs font-medium text-gray-600 mb-1">GST Tax Type</label>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    <button
                      type="button"
                      onClick={() => setData({ ...data, gstType: 'IGST', taxRate: 18 })}
                      className={`py-1 text-xs rounded-lg border font-medium ${data.gstType === 'IGST' ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'bg-white text-gray-600'}`}
                    >
                      IGST (18%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setData({ ...data, gstType: 'SGST_CGST', taxRate: 18 })}
                      className={`py-1 text-xs rounded-lg border font-medium ${data.gstType === 'SGST_CGST' ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'bg-white text-gray-600'}`}
                    >
                      CGST+SGST
                    </button>
                    <button
                      type="button"
                      onClick={() => setData({ ...data, gstType: 'NONE', taxRate: 0 })}
                      className={`py-1 text-xs rounded-lg border font-medium ${data.gstType === 'NONE' ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold' : 'bg-white text-gray-600'}`}
                    >
                      No Tax (0%)
                    </button>
                  </div>

                  {data.gstType !== 'NONE' && (
                    <div className="space-y-1 text-xs text-gray-600">
                      {data.gstType === 'SGST_CGST' ? (
                        <>
                          <div className="flex justify-between">
                            <span>CGST (9%):</span>
                            <span>₹ {(taxAmount / 2).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SGST (9%):</span>
                            <span>₹ {(taxAmount / 2).toLocaleString('en-IN')}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-between">
                          <span>IGST ({data.taxRate}%):</span>
                          <span>₹ {taxAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-base font-bold text-gray-900">Grand Total:</span>
                    <span className="text-2xl font-black text-blue-600">
                      ₹ {grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 italic bg-gray-50 p-2 rounded-lg border">
                    {numberToWords(grandTotal)}
                  </div>
                </div>

                {/* Signatory Settings */}
                <div className="pt-4 border-t space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Signatory Details</h4>
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">Prepared / Approved By</label>
                    <input
                      type="text"
                      value={data.preparedBy}
                      onChange={(e) => setData({ ...data, preparedBy: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-0.5">Designation</label>
                    <input
                      type="text"
                      value={data.preparedByDesignation}
                      onChange={(e) => setData({ ...data, preparedByDesignation: e.target.value })}
                      className="w-full px-2.5 py-1.5 border rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Instant Download Action Bar */}
                <div className="pt-4 space-y-2">
                  <button
                    onClick={downloadAsPDF}
                    disabled={isExporting}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF Quotation</span>
                  </button>
                  <button
                    onClick={downloadAsWord}
                    disabled={isExporting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Download Word (.docx)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Live Preview Mode */
        <div className="bg-gray-100 p-4 md:p-8 rounded-2xl flex flex-col items-center">
          <div className="max-w-4xl w-full flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Quotation Document Preview</h3>
              <p className="text-xs text-gray-500">This exact preview is exported to PDF and Word formats.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50"
              >
                Back to Edit
              </button>
              <button
                onClick={downloadAsPDF}
                className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 flex items-center"
              >
                <Download className="h-4 w-4 mr-1.5" />
                Download PDF
              </button>
              <button
                onClick={downloadAsWord}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 flex items-center"
              >
                <FileText className="h-4 w-4 mr-1.5" />
                Download Word
              </button>
            </div>
          </div>

          {/* Quotation A4 Template Container */}
          <div
            ref={quotationRef}
            className="w-full max-w-4xl bg-white p-8 md:p-12 shadow-2xl rounded-none border border-gray-200 text-gray-800 font-sans"
            style={{ minHeight: '1120px' }}
          >
            {/* Header with TCG Tech Logo & Official Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-blue-600 pb-6 mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <img
                  id="tcg-quotation-logo"
                  src={base64Logo || '/Images/Tcgtech.png'}
                  alt="TCG TECH Logo"
                  className="h-20 w-auto object-contain"
                  crossOrigin="anonymous"
                />
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-gray-900">
                    <span className="text-red-600">T</span>
                    <span className="text-green-600">C</span>
                    <span className="text-yellow-500">G</span>{' '}
                    <span className="text-blue-600">TECHNOLOGY</span>
                  </h1>
                  <p className="text-[11px] text-gray-500 max-w-sm mt-0.5 leading-tight">
                    {data.companyAddress}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1 font-medium">
                    Email: <span className="text-blue-600">{data.companyEmail}</span> | Phone: {data.companyPhone}
                  </p>
                  <p className="text-[11px] text-gray-600 font-medium">
                    Web: <span className="text-blue-600">{data.companyWebsite}</span>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-lg mb-2">
                  Official Quotation
                </span>
                <div className="text-sm font-bold text-gray-900">{data.quotationNumber}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Date: <span className="font-semibold text-gray-700">{new Date(data.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Valid Until: <span className="font-semibold text-gray-700">{new Date(data.validUntil).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Client & Quotation Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
              <div>
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[10px] mb-1.5">Quotation Prepared For:</h4>
                <div className="text-sm font-bold text-gray-900">{data.clientName || 'Valued Client'}</div>
                {data.clientCompany && <div className="font-semibold text-gray-700">{data.clientCompany}</div>}
                {data.clientEmail && <div className="text-gray-600 mt-0.5">Email: {data.clientEmail}</div>}
                {data.clientPhone && <div className="text-gray-600">Phone: {data.clientPhone}</div>}
                {data.clientAddress && <div className="text-gray-600 mt-0.5">{data.clientAddress}</div>}
                {data.clientGst && <div className="text-gray-700 font-medium mt-1">GSTIN: {data.clientGst}</div>}
              </div>

              <div>
                <h4 className="font-bold text-blue-900 uppercase tracking-wider text-[10px] mb-1.5">Project Scope Summary:</h4>
                <div className="text-xs font-bold text-blue-700 mb-1">{data.projectTitle}</div>
                <div className="text-gray-600">Estimated Timeline: <span className="font-semibold text-gray-800">{data.estimatedTimeline}</span></div>
                <div className="text-gray-600">Warranty / Support: <span className="font-semibold text-green-700">{data.warrantyPeriod}</span></div>
                <div className="text-gray-600 mt-1">Lead Architect: <span className="font-semibold text-gray-800">{data.preparedBy}</span></div>
              </div>
            </div>

            {/* Scope & Pricing Items Table */}
            <div className="mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white text-xs">
                    <th className="py-2.5 px-3 rounded-l-lg font-bold w-10 text-center">#</th>
                    <th className="py-2.5 px-3 font-bold">Scope Deliverables & Module Description</th>
                    <th className="py-2.5 px-3 font-bold text-center w-24">Qty / Unit</th>
                    <th className="py-2.5 px-3 font-bold text-right w-28">Rate (₹)</th>
                    <th className="py-2.5 px-3 rounded-r-lg font-bold text-right w-32">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs">
                  {data.items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-center text-gray-400 font-bold">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                        <div className="text-gray-600 text-[11px] mt-0.5 whitespace-pre-line leading-relaxed">{item.description}</div>
                      </td>
                      <td className="py-3 px-3 text-center text-gray-700">{item.quantity} {item.unit}</td>
                      <td className="py-3 px-3 text-right text-gray-700">₹ {Number(item.rate).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-right font-bold text-gray-900">₹ {Number(item.amount).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & Summary Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start pt-4 border-t border-gray-200 mb-6 gap-6">
              <div className="w-full sm:w-1/2 space-y-4">
                {/* Milestones in Preview */}
                <div>
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Payment Milestones:</h4>
                  <div className="space-y-1.5 text-[11px]">
                    {data.paymentMilestones.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center p-1.5 rounded bg-slate-50 border border-slate-100">
                        <span className="font-semibold text-gray-700">{m.percentage}% - {m.description}</span>
                        <span className="font-bold text-blue-700">₹ {Math.round((grandTotal * m.percentage) / 100).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {data.additionalNotes && (
                  <div className="text-[11px] text-gray-500 bg-blue-50/40 p-2.5 rounded-lg border border-blue-100">
                    <span className="font-semibold text-blue-900">Note: </span>{data.additionalNotes}
                  </div>
                )}
              </div>

              <div className="w-full sm:w-1/2 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Scope Subtotal:</span>
                  <span className="font-semibold text-gray-900">₹ {subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount ({data.discountType === 'percentage' ? `${data.discountValue}%` : 'Fixed'}):</span>
                    <span className="font-semibold">- ₹ {discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {data.gstType !== 'NONE' && (
                  <>
                    {data.gstType === 'SGST_CGST' ? (
                      <>
                        <div className="flex justify-between text-gray-600">
                          <span>CGST (9%):</span>
                          <span>₹ {(taxAmount / 2).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>SGST (9%):</span>
                          <span>₹ {(taxAmount / 2).toLocaleString('en-IN')}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between text-gray-600">
                        <span>GST ({data.gstType} @ {data.taxRate}%):</span>
                        <span>₹ {taxAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </>
                )}

                <div className="flex justify-between items-baseline pt-2 border-t-2 border-blue-600 text-sm">
                  <span className="font-bold text-gray-900">Grand Total:</span>
                  <span className="text-xl font-black text-blue-600">₹ {grandTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="text-[10px] text-gray-500 italic text-right">
                  {numberToWords(grandTotal)}
                </div>
              </div>
            </div>

            {/* Terms and Conditions Block */}
            <div className="border-t border-gray-200 pt-4 mb-8">
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-2">Terms & Conditions:</h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-600">
                {data.termsAndConditions.map((term, idx) => (
                  <li key={idx} className="leading-relaxed">{term}</li>
                ))}
              </ol>
            </div>

            {/* Signature & Authorization Section */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200 text-xs mt-auto">
              <div>
                <div className="h-12 border-b border-gray-300 w-48 mb-2"></div>
                <div className="font-bold text-gray-900">{data.preparedBy}</div>
                <div className="text-gray-500 text-[11px]">{data.preparedByDesignation}, TCG Technology</div>
                <div className="text-gray-400 text-[10px] mt-0.5">Authorized Signatory</div>
              </div>

              <div className="text-right flex flex-col items-end">
                <div className="h-12 border-b border-gray-300 w-48 mb-2"></div>
                <div className="font-bold text-gray-900">{data.clientName || 'Client Representative'}</div>
                <div className="text-gray-500 text-[11px]">{data.clientCompany || 'Client Acceptance & Signature'}</div>
                <div className="text-gray-400 text-[10px] mt-0.5">Date & Organization Seal</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
