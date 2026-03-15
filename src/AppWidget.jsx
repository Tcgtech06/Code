import LunaWidget from './LunaWidget'
import './AppWidget.css'

function AppWidget() {
  return (
    <div className="app-widget">
      {/* Demo Page Content */}
      <div className="demo-page">
        <div className="demo-container">
          <img src="/logo.gif" alt="Luna Logo" className="demo-logo" />
          
          <h1>Luna Widget Demo</h1>
          <p className="subtitle">AI Marketing Assistant for TCG TECH</p>

          <div className="cta-box">
            <h3>👉 Click the floating bubble in the bottom-right corner!</h3>
            <p>Try chatting with Luna and see how she collects lead information</p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <div className="feature-title">Smart Conversations</div>
              <div className="feature-desc">Luna understands your needs and provides relevant information</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <div className="feature-title">Package Recommendations</div>
              <div className="feature-desc">Get personalized package suggestions based on your budget</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <div className="feature-title">WhatsApp Integration</div>
              <div className="feature-desc">Leads are automatically sent to WhatsApp for quick follow-up</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <div className="feature-title">Multi-language</div>
              <div className="feature-desc">Supports English, Tamil, and Tanglish conversations</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <div className="feature-title">Lead Capture</div>
              <div className="feature-desc">Automatically extracts name, phone, email, and requirements</div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <div className="feature-title">Fast & Responsive</div>
              <div className="feature-desc">Quick responses powered by Sarvam AI and Gemini</div>
            </div>
          </div>

          <div className="test-examples">
            <h3>Test Conversation Examples:</h3>
            <ul>
              <li>💬 "Hi, I need a website for my business"</li>
              <li>💬 "What packages do you have?"</li>
              <li>💬 "My budget is 10k"</li>
              <li>💬 "My name is John, phone: 9876543210"</li>
              <li>💬 "I'm looking for a job as a React developer"</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Luna Widget Component */}
      <LunaWidget />
    </div>
  )
}

export default AppWidget
