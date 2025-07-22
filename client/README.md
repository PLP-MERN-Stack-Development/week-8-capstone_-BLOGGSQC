# EduTech Pro - School Management System Frontend

## 🚀 Modern School Management System Frontend

A comprehensive, production-ready frontend application built with React 18, TypeScript, and Tailwind CSS for modern educational institutions.

## ✨ Features

### 🎨 Modern UI/UX Design
- **Dark Theme**: Sophisticated dark mode with gold (#f59e0b) and neon accents
- **Glass Morphism**: Beautiful glass effects with backdrop blur
- **Smooth Animations**: Framer Motion powered micro-interactions
- **Responsive Design**: Optimized for mobile, tablet, desktop, and smartboards
- **3D Effects**: Elevated cards with hover states and shadows

### 🔐 Authentication & Authorization
- Role-based access control (Admin, Teacher, Student, Parent)
- JWT token management with refresh tokens
- Secure login with demo credentials
- Protected routes and conditional rendering

### 📊 Comprehensive Dashboard
- Real-time statistics and analytics
- Activity feeds and notifications
- Quick action buttons
- Performance metrics visualization

### 👥 User Management
- **Students**: Complete profiles, academic records, attendance tracking
- **Teachers**: Faculty management, subject assignments, performance tracking
- **Classes**: Class organization, student enrollment, subject mapping
- **Subjects**: Curriculum management, syllabus tracking, teacher assignments

### 📚 Academic Features
- **Attendance**: Multiple tracking methods (manual, QR code, geofencing)
- **Assignments**: Creation, submission, grading, and progress tracking
- **Notes & Materials**: Teaching resources, file attachments, sharing
- **Analytics**: Performance insights, grade distribution, trends

### 📅 Communication & Events
- **Announcements**: School-wide communication with priority levels
- **Calendar**: Event management, scheduling, reminders
- **Real-time Updates**: Live notifications and activity feeds

## 🛠️ Technical Stack

- **Framework**: React 18.3+ with TypeScript
- **Styling**: Tailwind CSS 3.4+ with custom design system
- **Animations**: Framer Motion for smooth transitions
- **State Management**: React Query for server state
- **Routing**: React Router DOM 6.20+
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Build Tool**: Vite 5.0+
- **Fonts**: Inter from Google Fonts

## 📁 Project Structure

```
Client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Dashboard/      # Dashboard components
│   │   ├── Layout/         # Layout components (Header, Sidebar)
│   │   ├── FeatureCards.tsx
│   │   ├── Hero.tsx
│   │   └── Navigation.tsx
│   ├── context/           # React context providers
│   │   └── AuthContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   └── useAuth.ts
│   ├── pages/             # Page components
│   │   ├── Home.tsx
│   │   ├── Auth/
│   │   ├── Students/
│   │   ├── Teachers/
│   │   ├── Classes/
│   │   ├── Subjects/
│   │   ├── Attendance/
│   │   ├── Assignments/
│   │   ├── Notes/
│   │   ├── Analytics/
│   │   ├── Announcements/
│   │   └── Calendar/
│   ├── services/          # API services
│   │   └── api.ts
│   ├── index.css          # Global styles
│   ├── main.tsx           # Application entry point
│   └── App.tsx            # Main app component
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. **Navigate to the Client directory**
   ```bash
   cd Client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the Client directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=EduTech Pro
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will start on `http://localhost:3000`

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-50: #fffbeb
--primary-500: #f59e0b  /* Gold */
--primary-600: #d97706
--primary-900: #78350f

/* Dark Theme */
--dark-800: #1e293b
--dark-900: #0f172a
--dark-950: #020617

/* Neon Accents */
--neon-cyan: #00ffff
--neon-pink: #ff00ff
--neon-green: #00ff00
```

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Line Heights**: 150% for body, 120% for headings

### Spacing System
- **Base Unit**: 8px
- **Scale**: 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px

### Animation Guidelines
- **Duration**: 200-500ms for micro-interactions
- **Easing**: ease-in-out for most transitions
- **Hover States**: scale(1.05) for buttons, scale(1.02) for cards
- **Loading**: Smooth spinner animations

## 🔧 Configuration

### Tailwind CSS Extensions
```javascript
// Custom utilities and components
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.neon-glow {
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

.neon-glow-gold {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
}
```

### API Integration
```typescript
// Axios configuration with interceptors
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 0px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### Mobile Optimizations
- Touch-friendly button sizes (minimum 44px)
- Swipe gestures for navigation
- Optimized typography scales
- Collapsible navigation menu
- Progressive Web App (PWA) ready

## 🔒 Security Features

- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based requests
- **Secure Storage**: JWT tokens in localStorage with expiration
- **Route Protection**: Private route guards
- **Input Validation**: Client-side form validation

## 📊 Performance Optimizations

- **Code Splitting**: Lazy-loaded routes and components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Optimized chunk sizes
- **Caching**: React Query for server state caching
- **Tree Shaking**: Unused code elimination

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm run test

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Testing Stack
- **Unit Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright
- **Component Testing**: Storybook

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deployment Platforms
- **Vercel**: Recommended for React applications
- **Netlify**: Alternative with form handling
- **AWS S3 + CloudFront**: Enterprise deployment
- **Docker**: Containerized deployment

### Environment Variables for Production
```env
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=EduTech Pro
VITE_ENVIRONMENT=production
```

## 🎯 Features by User Role

### Admin Dashboard
- Complete system overview with analytics
- User management (students, teachers, parents)
- School-wide announcements and events
- System performance monitoring
- Advanced reporting and insights

### Teacher Panel
- Class and subject management
- Student attendance tracking
- Assignment creation and grading
- Teaching materials upload
- Parent communication portal

### Student Portal
- Personal dashboard with grades and attendance
- Assignment submission and tracking
- Access to notes and study materials
- Calendar with upcoming events
- Communication with teachers

### Parent Portal
- Child's academic progress monitoring
- Attendance and grade tracking
- Communication with teachers
- Event and announcement notifications
- Fee payment tracking

## 🔧 Customization

### Theme Customization
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add your custom colors
        brand: {
          primary: '#your-color',
          secondary: '#your-color'
        }
      }
    }
  }
}
```

### Component Customization
All components are built with flexibility in mind:
- Prop-based styling options
- CSS custom properties for theming
- Modular component architecture
- Easy color scheme modifications

## 📚 API Integration

### Authentication
```typescript
// Login example
const login = async (email: string, password: string) => {
  const response = await authAPI.login({ email, password })
  const { user, token } = response.data
  localStorage.setItem('token', token)
  return user
}
```

### Data Fetching
```typescript
// React Query example
const { data, isLoading, error } = useQuery(
  'students',
  () => studentsAPI.getAll(),
  {
    refetchOnWindowFocus: false,
    retry: 1
  }
)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@edutech-pro.com
- Documentation: [docs.edutech-pro.com](https://docs.edutech-pro.com)
- Issues: [GitHub Issues](https://github.com/edutech-pro/issues)

## 🎉 Demo Credentials

Use these credentials to test different user roles:

- **Admin**: admin@edutech-pro.com / Admin123!
- **Teacher**: sarah.johnson@edutech-pro.com / Teacher123!
- **Student**: john.smith@student.edutech-pro.com / Student123!
- **Parent**: robert.smith@parent.edutech-pro.com / Parent123!

---

Built with ❤️ for modern education management.