# TalentSync AI - Unified Career, Skills & Hiring Platform

A comprehensive, AI-driven recruitment, placement, learning, and hiring ecosystem platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎯 Overview

TalentSync AI is an enterprise-grade platform featuring three major user roles:
- **Candidate Portal**: Job discovery, AI resume analysis, aptitude tests, AI interviews, learning resources
- **College Portal**: Student management, campus drive coordination, placement analytics
- **Corporate Portal**: Job posting, AI screening, workflow automation, candidate management

## ✨ Key Features

### For Candidates
- 🎯 AI-powered job matching with skill-based scoring
- 📄 Resume analysis and optimization
- 🧠 Aptitude test system with analytics
- 🤖 AI-powered interview simulation
- 📚 Career roadmaps and learning resources
- 📊 Application tracking with detailed timeline

### For Colleges
- 👥 Student pool management
- 🏢 Campus drive coordination
- 📅 Logistics and event scheduling
- 📈 Placement analytics and reports
- 📑 Document repository

### For Corporates/HR
- 💼 Job posting system (on-campus/off-campus)
- 🔍 AI-powered candidate screening
- ⚙️ Customizable hiring workflow
- 👤 Candidate management dashboard
- 📊 Hiring analytics and insights

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

## 🎨 Design Features

- Professional blue-purple-cyan gradient color palette
- Dark/Light mode support
- Fully responsive design (mobile, tablet, desktop)
- Glassmorphism effects
- Smooth animations and transitions
- Accessible UI components

## 📁 Project Structure

```
talentsync-ai/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── candidate/           # Candidate portal pages
│   │   ├── dashboard/
│   │   ├── jobs/
│   │   ├── applications/
│   │   ├── career-assistant/
│   │   ├── aptitude/
│   │   ├── interview/
│   │   └── learning/
│   ├── college/             # College portal pages
│   │   └── dashboard/
│   ├── corporate/           # Corporate portal pages
│   │   └── dashboard/
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   └── globals.css
├── components/
│   ├── layouts/             # Layout components
│   │   ├── CandidateLayout.tsx
│   │   ├── CollegeLayout.tsx
│   │   └── CorporateLayout.tsx
│   └── ui/                  # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Toast.tsx
│       ├── Loading.tsx
│       └── EmptyState.tsx
├── lib/
│   ├── types.ts             # TypeScript type definitions
│   └── data/
│       └── mock-data.ts     # Sample data for demo
├── public/
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd talentsync-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎭 User Portals

### Landing Page
The home page (`/`) displays three role cards:
- Candidate Portal
- College Portal  
- Corporate Portal

Click any card to navigate to the respective dashboard.

### Candidate Portal Routes
- `/candidate/dashboard` - Overview with stats and job suggestions
- `/candidate/jobs` - Job discovery with AI matching
- `/candidate/applications` - Application tracking
- `/candidate/career-assistant` - AI resume analysis
- `/candidate/aptitude` - Aptitude tests (placeholder)
- `/candidate/interview` - AI interview (placeholder)
- `/candidate/learning` - Learning resources and roadmaps

### College Portal Routes
- `/college/dashboard` - Placement statistics and overview

### Corporate Portal Routes
- `/corporate/dashboard` - Hiring funnel and job postings

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6 to #2563EB) - Trustworthy, professional
- **Secondary**: Purple (#8B5CF6 to #7C3AED) - Creative, innovative
- **Accent**: Cyan (#06B6D4) - Modern, tech-forward

### Gradients
- `gradient-primary`: Blue to Purple
- `gradient-secondary`: Purple to Pink
- `gradient-accent`: Cyan to Blue

### Dark Mode
Toggle dark mode using the moon/sun icon in the header. Theme preference persists across sessions.

## 📊 Mock Data

The application uses realistic mock data for demonstration:
- 5 job postings (various companies and roles)
- Sample candidate profile  
- 2 application examples with full timeline
- Aptitude test questions
- Career learning roadmaps

Location: `lib/data/mock-data.ts`

## 🔮 AI Features (Simulated)

Current version includes AI feature simulations:
- **Resume Scoring**: Algorithm-based scoring (completeness, keywords, formatting)
- **Job Matching**: Skill overlap calculation
- **Aptitude Tests**: Score analytics and recommendations
- **AI Interview**: NLP keyword matching (simulated)

For production, integrate:
- OpenAI API for NLP
- AWS Rekognition for proctoring
- Backend API (Django/FastAPI/Node.js)
- PostgreSQL database

## 🏗️ Building for Production

```bash
npm run build
npm run start
```

## 🚀 Deployment

The application can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- Any Node.js hosting platform

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Deploy with default settings

## 🎯 Future Enhancements

- Real AI/ML integration
- Backend API development
- Database integration (PostgreSQL)
- Authentication system (JWT + OAuth)
- WhatsApp/Email notifications
- Video interview recording
- Real-time proctoring
- Payment integration
- Admin panel
- Mobile apps

## 📝 License

This project is created as a demonstration platform.

## 👤 Author

Built with ❤️ using Antigravity AI

---

**Note**: This is a demonstration version with simulated AI features. For production deployment, you'll need to integrate real AI services, backend APIs, and databases as outlined in the implementation plan.
