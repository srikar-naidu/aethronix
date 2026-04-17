# RUBIX AI 🚀

RUBIX AI is a premium, AI-powered platform designed to bridge the gap between talented developers and fast-growing startups. Built with Next.js 15, Tailwind CSS, and powered by Groq's high-speed AI models.

## ✨ Core Features

### 🎙 AI Hire (Nexus)
Real-time, voice-interative technical interviews conducted by **Nexus**, our AI Lead Engineer. Uses Web Speech API and MediaRecorder combined with Groq's Llama 3.1 & Whisper models for a seamless, low-latency experience.

### 🧩 DSA Skill Verification
A full coding assessment workspace where users solve AI-generated Data Structures & Algorithms problems. Features live code editing, mock execution, and AI-powered performance evaluation to earn verified badges.

### ⚡ QuickHire
A lightning-fast matching engine for startups to find top tier talent based on skills, urgency, and budget. Uses AI success prediction to match the best candidates instantly.

### 🎯 MockPrep Studio
A dedicated preparation hub featuring:
- **Mock Interviews**: Domain-specific AI question generation and feedback.
- **Milestone Tracker**: visualized project progress, weekly submissions, and mentor comments.

### 🗺 Analytics Heatmap
A data-driven dashboard visualizing opportunity density, skill distribution, and hiring demand across different regions and industries.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI Infrastructure**: Groq SDK (Llama 3.1, Whisper-large-v3)
- **Styling**: Tailwind CSS v4 with Premium Dark Glassmorphism 
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts & D3-scale

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kachamsiddarth/hackverse.git
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add your Groq API Key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🛡 Security Note
All API keys are managed via environment variables and are excluded from the repository via `.gitignore`.
