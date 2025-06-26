# My Financial Twin - AI-Powered Financial Planning MVP

A comprehensive financial planning application that provides personalized AI recommendations for savings, investments, and financial goals with cultural context for Egypt and the Middle East.

## 🎯 MVP Features

### ✅ Core Features Implemented

1. **Profile Management**
   - Complete KYC (Know Your Customer) onboarding
   - Financial profile creation and management
   - Risk tolerance assessment
   - Investment preferences and goals

2. **AI/Rule Engine**
   - Personalized savings recommendations
   - Investment allocation suggestions (Gold, Stocks, Bonds, Real Estate)
   - Cultural context integration (Egypt/Middle East preferences)
   - Risk-based portfolio optimization

3. **Dashboard & Analytics**
   - Financial health overview with visual charts
   - Progress tracking for goals
   - Emergency fund monitoring
   - Investment readiness assessment

4. **Security & Privacy**
   - JWT-based authentication (MVP implementation)
   - Encrypted local storage
   - Secure data handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Angular CLI (v19)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd My-Financial-Twin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 📱 Application Flow

### 1. Landing Page
- Welcome screen with app introduction
- Start KYC process

### 2. KYC Onboarding (7 Steps)
- **Step 1**: Personal Information (Name, Age, Gender)
- **Step 2**: Financial Information (Income, Occupation)
- **Step 3**: Current Financial Status (Savings, Investments)
- **Step 4**: Financial Goals (Short-term & Long-term)
- **Step 5**: Risk Assessment (Tolerance & Investment Style)
- **Step 6**: Contact Preferences
- **Step 7**: Email Collection

### 3. Dashboard
- Financial health overview
- AI recommendations
- Progress tracking
- Quick actions

### 4. Profile Management
- Edit personal information
- Manage financial goals
- Update preferences

### 5. Investment Analysis
- Portfolio simulation
- Historical returns analysis
- Asset allocation recommendations

## 🧠 AI Features

### Rule-Based Engine
The application uses a sophisticated rule engine that considers:

- **Age-based adjustments**: Younger users get more aggressive allocations
- **Income stability**: Government/corporate jobs vs freelance
- **Cultural preferences**: High gold allocation for Egyptian users
- **Risk tolerance**: Conservative, Balanced, or Aggressive strategies

### Cultural Context
- **Gold preference**: 70% higher allocation for Egyptian users
- **Real estate**: 80% preference for property investments
- **Islamic finance**: Sharia-compliant investment options
- **Family planning**: Multi-generational wealth considerations

### Recommendations Include:
- Emergency fund building (6 months of expenses)
- Savings rate optimization (target: 15% of income)
- Asset allocation (Gold, Stocks, Bonds, Real Estate)
- Goal-based savings plans
- Investment opportunities

## 📊 Dashboard Features

### Financial Health Metrics
- **Risk Score**: Based on age, occupation, and preferences
- **Savings Efficiency**: Current savings rate vs recommended
- **Investment Readiness**: Emergency fund adequacy and income level
- **Overall Financial Health**: Composite score

### Visual Analytics
- Doughnut charts for financial health breakdown
- Bar charts for emergency fund progress
- Pie charts for asset allocation
- Progress bars for goal tracking

### AI Insights
- **Savings alerts**: Low savings rate warnings
- **Emergency fund alerts**: Insufficient emergency fund notifications
- **Investment opportunities**: Excess savings recommendations
- **Cultural insights**: Egypt-specific financial wisdom

## 🛠 Technical Architecture

### Frontend
- **Framework**: Angular 19 (Standalone Components)
- **Charts**: Chart.js with ng2-charts
- **Icons**: FontAwesome
- **Styling**: SCSS with modern CSS features
- **State Management**: Angular Services with RxJS

### Backend Integration
- **API**: RESTful API integration
- **Authentication**: JWT tokens
- **Storage**: Local storage with encryption
- **Data**: KYC data submission and retrieval

### Key Services
- `AIRuleEngineService`: AI recommendations and analysis
- `AuthService`: Authentication and user management
- `StorageService`: Secure data storage
- `KYCApiService`: Backend API integration
- `InvestmentAnalysisService`: Portfolio calculations

## 🎨 Design Features

### Modern UI/UX
- **Gradient backgrounds**: Purple-blue theme
- **Glass morphism**: Backdrop blur effects
- **Responsive design**: Mobile-first approach
- **Smooth animations**: Hover effects and transitions
- **Accessibility**: ARIA labels and keyboard navigation

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#28a745)
- **Warning**: Orange (#ffc107)
- **Danger**: Red (#dc3545)
- **Info**: Blue (#17a2b8)

## 🔒 Security Features

### Data Protection
- **Encryption**: Base64 encoding for sensitive data (MVP)
- **Token-based auth**: JWT implementation
- **Secure storage**: Local storage with encryption
- **Input validation**: Form validation and sanitization

### Privacy Compliance
- **GDPR ready**: Data handling practices
- **Egypt compliance**: Local data protection
- **User consent**: Clear data usage policies

## 📈 Future Enhancements

### Phase 2 Features
- **ML-based recommendations**: Machine learning models
- **Real-time data**: Live market data integration
- **Portfolio tracking**: Real investment tracking
- **Mobile app**: Native iOS/Android applications
- **Social features**: Community and sharing

### Advanced AI
- **Predictive analytics**: Market trend predictions
- **Behavioral analysis**: Spending pattern recognition
- **Personalized insights**: Advanced recommendation engine
- **Risk assessment**: Dynamic risk scoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the Egyptian and Middle Eastern financial community**
