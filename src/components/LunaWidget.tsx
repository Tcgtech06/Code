import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './LunaWidget.css';

const lunaLogo = '/logo.gif';

// Configure axios base URL - Hugging Face deployment
const API_BASE_URL = 'https://tcgtech-luna06.hf.space';
const WHATSAPP_NUMBERS = ['919791962802', '919442961732']; // Both WhatsApp numbers

// Icon components
const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LeadData {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  package?: string;
  budget?: string;
  timeline?: string;
  jobRole?: string;
  sent?: boolean;
}

function LunaWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Luna, your marketing assistant from TCG TECH. How can I help you today? 😊"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [userProfile] = useState({ user_id: 'widget_' + Date.now() });
  const [leadData, setLeadData] = useState<LeadData>({});
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatWidgetRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLButtonElement>(null);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (
        isOpen &&
        chatWidgetRef.current &&
        bubbleRef.current &&
        !chatWidgetRef.current.contains(target) &&
        !bubbleRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Popup message every 15 seconds
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setShowPopup(true);
        // Auto-hide after 8 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 8000);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  // Reset lead data when widget opens
  useEffect(() => {
    if (isOpen) {
      setLeadData({});
      setShowPopup(false); // Hide popup when chat opens
    }
  }, [isOpen]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Convert URLs to clickable links
  const linkifyText = (text: string) => {
    if (!text) return text;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={index} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#667eea',
              textDecoration: 'underline',
              fontWeight: '500'
            }}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  // Extract lead information from message
  const extractLeadInfo = (message: string, isUserMessage = true): LeadData => {
    const lowerMessage = message.toLowerCase();
    const newLeadData = { ...leadData };
    
    // Only extract service from user messages, not from Luna's responses
    if (isUserMessage) {
      // Extract service interest - check in order of specificity (most specific first)
      const serviceKeywords = [
        { keywords: ['app development', 'mobile app'], service: 'App Development' },
        { keywords: ['digital marketing'], service: 'Digital Marketing' },
        { keywords: ['social media marketing', 'social media', 'instagram', 'facebook', 'fb', 'twitter', 'linkedin'], service: 'Social Media Marketing' },
        { keywords: ['seo'], service: 'SEO' },
        { keywords: ['attendance', 'management software', 'system software', 'software development', 'software'], service: 'Software Development' },
        { keywords: ['ai development', 'artificial intelligence', 'ai'], service: 'AI Development' },
        { keywords: ['chatbot'], service: 'Chatbot Development' },
        { keywords: ['ecommerce', 'e-commerce'], service: 'E-commerce' },
        { keywords: ['website', 'web development'], service: 'Web Development' },
        { keywords: ['ui/ux', 'design'], service: 'UI/UX Design' }
      ];
      
      for (const { keywords, service } of serviceKeywords) {
        for (const keyword of keywords) {
          if (lowerMessage.includes(keyword)) {
            newLeadData.service = service;
            // Clear package when service changes
            if (service !== 'Web Development') {
              delete newLeadData.package;
            }
            break;
          }
        }
        if (newLeadData.service) break;
      }
    }
    
    // Check for comma-separated format first: name,email,phone,budget,timeline
    const commaSeparated = message.split(',').map(s => s.trim());
    if (commaSeparated.length >= 3) {
      // First item is likely name (if not email or phone)
      if (commaSeparated[0] && !commaSeparated[0].includes('@') && !commaSeparated[0].match(/\d{7,}/) && !commaSeparated[0].toLowerCase().includes('contact')) {
        newLeadData.name = commaSeparated[0].replace(/^(name\s*:?\s*)/i, '').trim();
      }
      
      // Find email in any position
      for (const part of commaSeparated) {
        if (part.includes('@')) {
          newLeadData.email = part.replace(/^(email\s*:?\s*)/i, '').trim();
          break;
        }
      }
      
      // Find phone in any position (skip "contact" word)
      for (const part of commaSeparated) {
        if (part.toLowerCase().includes('contact') && part.match(/\d{10}/)) {
          // "contact: 9876543210" format
          const phoneMatch = part.match(/\d{10}/);
          if (phoneMatch) {
            newLeadData.phone = phoneMatch[0];
            break;
          }
        } else {
          const phoneMatch = part.match(/[6-9]\d{9}/);
          if (phoneMatch) {
            newLeadData.phone = phoneMatch[0];
            break;
          }
        }
      }
      
      // Find budget
      for (const part of commaSeparated) {
        const budgetMatch = part.match(/(\d+k|\d+\s*thousand|\d+\s*lakh)/i);
        if (budgetMatch) {
          newLeadData.budget = budgetMatch[1];
          break;
        }
      }
      
      // Find timeline
      for (const part of commaSeparated) {
        const timelineMatch = part.match(/(\d+\s*(?:days?|weeks?|months?))/i);
        if (timelineMatch) {
          newLeadData.timeline = timelineMatch[1];
          break;
        }
      }
    }
    
    // Fallback: Extract email
    if (!newLeadData.email) {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
      const emailMatch = message.match(emailRegex);
      if (emailMatch) {
        newLeadData.email = emailMatch[0];
      }
    }
    
    // Fallback: Extract phone number (Indian format)
    if (!newLeadData.phone) {
      // Try multiple patterns
      const phonePatterns = [
        /(\+91|91)?[\s-]?[6-9]\d{9}/,  // Standard Indian format
        /contact\s*:?\s*(\d{10})/i,     // "contact: 9876543210"
        /phone\s*:?\s*(\d{10})/i,       // "phone: 9876543210"
        /(\d{10})/                       // Just 10 digits
      ];
      
      for (const pattern of phonePatterns) {
        const phoneMatch = message.match(pattern);
        if (phoneMatch) {
          const phone = phoneMatch[1] || phoneMatch[0];
          // Validate it's a 10-digit number starting with 6-9
          const cleanPhone = phone.replace(/[\s\-+]/g, '').replace(/^91/, '');
          if (cleanPhone.length === 10 && /^[6-9]/.test(cleanPhone)) {
            newLeadData.phone = cleanPhone;
            break;
          }
        }
      }
    }
    
    // Fallback: Extract name (multiple patterns)
    if (!newLeadData.name) {
      const namePatterns = [
        /(?:my name is|i am|i'm|this is|name\s*:)\s*([a-z\s]+)/i,
        /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*,/  // Name at start with comma
      ];
      for (const pattern of namePatterns) {
        const nameMatch = message.match(pattern);
        if (nameMatch) {
          newLeadData.name = nameMatch[1].trim();
          break;
        }
      }
    }
    
    // Fallback: Extract budget
    if (!newLeadData.budget) {
      const budgetRegex = /(?:budget\s*:?\s*)?(\d+k|\d+\s*thousand|\d+\s*lakh)/i;
      const budgetMatch = message.match(budgetRegex);
      if (budgetMatch) {
        newLeadData.budget = budgetMatch[1];
      }
    }
    
    // Fallback: Extract timeline
    if (!newLeadData.timeline) {
      const timelineRegex = /(?:timeline\s*:?\s*)?(\d+\s*(?:days?|weeks?|months?))/i;
      const timelineMatch = message.match(timelineRegex);
      if (timelineMatch) {
        newLeadData.timeline = timelineMatch[1];
      }
    }
    
    // Extract package name from user message
    const packages = ['basic', 'standard', 'professional', 'premium', 'elite'];
    for (const pkg of packages) {
      if (lowerMessage.includes(pkg)) {
        newLeadData.package = pkg.toUpperCase();
        break;
      }
    }
    
    // Extract job interest
    const jobs = ['developer', 'designer', 'react', 'frontend', 'backend', 'full stack', 'ai engineer', 'job', 'career', 'hiring'];
    for (const job of jobs) {
      if (lowerMessage.includes(job)) {
        newLeadData.jobRole = job;
        break;
      }
    }
    
    setLeadData(newLeadData);
    return newLeadData;
  };

  // Check and send lead to WhatsApp via backend
  const checkAndSendLead = async (currentLeadData: LeadData) => {
    // Check if we have minimum required info (name + phone)
    if (currentLeadData.name && currentLeadData.phone) {
      if (currentLeadData.sent) return;
      
      currentLeadData.sent = true;
      setLeadData(currentLeadData);
      
      try {
        // Send lead to backend
        const response = await axios.post(`${API_BASE_URL}/send-lead`, {
          name: currentLeadData.name,
          phone: currentLeadData.phone,
          email: currentLeadData.email || null,
          service: currentLeadData.service || null,
          package: currentLeadData.package || null,
          budget: currentLeadData.budget || null,
          timeline: currentLeadData.timeline || null
        });
        
        console.log('Lead sent successfully:', response.data);
        console.log('Lead Category:', response.data.category);
        console.log('Lead Number:', response.data.lead_number);
        
        // Open WhatsApp with formatted message for BOTH numbers
        if (response.data.whatsapp_url) {
          // Open first WhatsApp
          window.open(response.data.whatsapp_url, '_blank');
          
          // Create message for second WhatsApp number
          const whatsappMessage = response.data.whatsapp_url.split('text=')[1];
          if (whatsappMessage) {
            const secondWhatsAppURL = `https://wa.me/${WHATSAPP_NUMBERS[1]}?text=${whatsappMessage}`;
            // Open second WhatsApp after a short delay
            setTimeout(() => {
              window.open(secondWhatsAppURL, '_blank');
            }, 1000);
          }
        }
        
      } catch (error) {
        console.error('Error sending lead:', error);
        
        // Fallback: Create WhatsApp message manually for BOTH numbers
        let whatsappMessage = `🌙 *New Lead from Luna Chatbot*\n\n`;
        whatsappMessage += `👤 *Name:* ${currentLeadData.name}\n`;
        whatsappMessage += `📱 *Contact:* ${currentLeadData.phone}\n`;
        
        if (currentLeadData.email) {
          whatsappMessage += `📧 *Email:* ${currentLeadData.email}\n`;
        }
        
        if (currentLeadData.package) {
          whatsappMessage += `📦 *Package:* ${currentLeadData.package}\n`;
        } else if (currentLeadData.service) {
          whatsappMessage += `🎯 *Service:* ${currentLeadData.service}\n`;
        }
        
        if (currentLeadData.budget) whatsappMessage += `💰 *Budget:* ${currentLeadData.budget}\n`;
        if (currentLeadData.timeline) whatsappMessage += `⏰ *Timeline:* ${currentLeadData.timeline}\n`;
        whatsappMessage += `\n🕐 *Time:* ${new Date().toLocaleString()}`;
        
        // Send to BOTH WhatsApp numbers
        const whatsappURL1 = `https://wa.me/${WHATSAPP_NUMBERS[0]}?text=${encodeURIComponent(whatsappMessage)}`;
        const whatsappURL2 = `https://wa.me/${WHATSAPP_NUMBERS[1]}?text=${encodeURIComponent(whatsappMessage)}`;
        
        window.open(whatsappURL1, '_blank');
        setTimeout(() => {
          window.open(whatsappURL2, '_blank');
        }, 1000);
      }
    }
  };

  // Send message to Luna
  const sendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    
    // Extract lead info from user message (pass true for isUserMessage)
    const currentLeadData = extractLeadInfo(inputMessage, true);
    console.log('Extracted lead data:', currentLeadData);
    
    setIsTyping(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: inputMessage,
        files: [],
        conversation_history: conversationHistory,
        user_profile: userProfile
      });

      // Clean response by removing <think> tags and their content
      let cleanedResponse = response.data.response;
      
      // Remove <think>...</think> blocks (including multiline)
      cleanedResponse = cleanedResponse.replace(/<think>[\s\S]*?<\/think>/gi, '');
      
      // Remove any remaining opening or closing think tags
      cleanedResponse = cleanedResponse.replace(/<\/?think>/gi, '');
      
      // Trim any extra whitespace
      cleanedResponse = cleanedResponse.trim();

      const assistantMessage: Message = {
        role: 'assistant',
        content: cleanedResponse
      };

      setMessages([...updatedMessages, assistantMessage]);
      
      // Extract package info from Luna's response - prioritize FIRST package mentioned
      // Don't extract service from Luna's response to avoid overwriting user's service
      if (!currentLeadData.package) {
        const assistantLower = response.data.response.toLowerCase();
        const packages = ['basic', 'standard', 'professional', 'premium', 'elite'];
        
        // Find the first occurrence of any package
        let firstPackageIndex = -1;
        let firstPackage = null;
        
        for (const pkg of packages) {
          const index = assistantLower.indexOf(pkg);
          if (index !== -1 && (firstPackageIndex === -1 || index < firstPackageIndex)) {
            firstPackageIndex = index;
            firstPackage = pkg;
          }
        }
        
        if (firstPackage) {
          currentLeadData.package = firstPackage.toUpperCase();
          setLeadData(currentLeadData);
        }
      }
      
      console.log('Final lead data before sending:', currentLeadData);
      
      // Update conversation history with cleaned response
      setConversationHistory([
        ...conversationHistory,
        { role: 'user', content: inputMessage },
        { role: 'assistant', content: cleanedResponse }
      ]);

      // Check if we should send lead (after a short delay to let Luna's thank you message show)
      setTimeout(() => {
        checkAndSendLead(currentLeadData);
      }, 500);

    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Popup Message */}
      {showPopup && !isOpen && (
        <div 
          className="luna-popup-message"
          onClick={() => {
            setShowPopup(false);
            setIsOpen(true);
          }}
          style={{ cursor: 'pointer' }}
        >
          <button 
            className="luna-popup-close"
            onClick={(e) => {
              e.stopPropagation();
              setShowPopup(false);
            }}
            aria-label="Close popup"
          >
            ×
          </button>
          <div className="luna-popup-content">
            <img src={lunaLogo} alt="Luna" className="luna-popup-avatar" />
            <div className="luna-popup-text">
              <p>Hello! Enoda Peru Luna. Ungaluku Ethavathu Help venum na Keluga 😊😊</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bubble Button */}
      <button 
        ref={bubbleRef}
        className="luna-bubble"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Luna Chat"
      >
        <img src={lunaLogo} alt="Luna" />
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className="luna-widget" ref={chatWidgetRef}>
          {/* Header */}
          <div className="luna-widget-header">
            <div className="luna-header-left">
              <img src={lunaLogo} alt="Luna" />
              <div className="luna-header-info">
                <h3>Luna</h3>
                <p>Marketing Assistant</p>
              </div>
            </div>
            <button 
              className="luna-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="luna-messages" ref={messagesContainerRef}>
            {messages.map((message, index) => (
              <div key={index} className={`luna-message ${message.role}`}>
                <div className="luna-message-avatar">
                  {message.role === 'assistant' ? (
                    <img src={lunaLogo} alt="Luna" />
                  ) : (
                    <UserIcon />
                  )}
                </div>
                <div className="luna-message-content">
                  {linkifyText(message.content)}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="luna-message assistant">
                <div className="luna-message-avatar">
                  <img src={lunaLogo} alt="Luna" />
                </div>
                <div className="luna-typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="luna-input-area">
            <div className="luna-input-container">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="luna-input"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="luna-send-btn"
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="luna-footer">
            Powered by{' '}
            <span style={{ color: '#ef4444', fontWeight: 'bold' }}>T</span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>C</span>
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>G</span>
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}> TECH</span>
          </div>
        </div>
      )}
    </>
  );
}

export default LunaWidget;
