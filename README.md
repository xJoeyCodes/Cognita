# Cognita AI

> Transform any PDF into intelligent flashcards and quizzes with the power of AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## Overview

Cognita AI is an intelligent learning platform that revolutionizes how students and professionals study by transforming PDF documents into interactive flashcards and quizzes using artificial intelligence. The platform leverages AI technology to automatically analyze educational content and generate personalized learning materials.

### ✨ Key Features

- **🤖 AI-Powered Analysis**: Automatically processes PDFs and extracts key concepts
- **📚 Smart Flashcards**: Generates high-quality flashcards with varying difficulty levels
- **🧠 Spaced Repetition**: Implements proven learning algorithms for optimal retention
- **📊 Progress Tracking**: Comprehensive analytics and performance monitoring
- **🎯 Adaptive Learning**: Personalized study schedules based on performance
- **📱 Responsive Design**: Works seamlessly across all devices
- **🔐 Secure & Private**: Your data is protected and never shared

## 🎯 Problem Solved

Traditional study methods often involve:
- Time-consuming manual note-taking from PDFs
- Inefficient memorization techniques
- Lack of personalized learning paths
- Difficulty creating effective study materials
- Limited access to interactive learning tools

Cognita AI solves these challenges by automating the creation of study materials and implementing scientifically-proven learning techniques.

## Tech Stack

### Frontend
- **React 18** with TypeScript 
- **Tailwind CSS** for responsive styling
- **Framer Motion** for smooth animations
- **Shadcn/ui** for consistent component library

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** for data storage
- **Row Level Security** for data protection

### AI Integration
- **Google Gemini API** for content analysis
- **Custom prompts** for educational content generation
- **JSON parsing** for structured data extraction

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Supabase account (free tier available)
- Google AI Studio account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cognita-ai.git
   cd cognita-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your credentials to `.env.local`:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL commands from `docs/SETUP.md`
   - Get your API keys from Supabase settings

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:8080`

## 📖 Documentation

- **[Setup Guide](docs/SETUP.md)** - Detailed installation instructions
- **[Usage Guide](docs/USAGE.md)** - How to use the platform
- **[Team Information](docs/TEAM.md)** - Project team and contributors
- **[Acknowledgements](docs/ACKNOWLEDGEMENTS.md)** - Third-party libraries and resources

## Features

### PDF Processing
- Drag-and-drop PDF upload interface
- AI-powered content analysis using Google Gemini
- Automatic flashcard and quiz generation
- Support for various document types

### Study Materials
- **Flashcards**: Question-answer pairs with difficulty levels
- **Quizzes**: Multiple-choice questions with instant feedback
- **Spaced Repetition**: Optimized review scheduling
- **Progress Tracking**: Real-time statistics and analytics

### User Experience
- Clean, intuitive design with purple gradient theme
- Responsive layout for all device sizes
- Smooth animations and micro-interactions
- Accessible design following WCAG guidelines

## 🔒 Security

- User authentication via Supabase
- Row-level security for data protection
- Secure PDF processing

## 📈 Roadmap ( My future developments to the project )

### Phase 2 (Coming Soon)
- [ ] Audio support with text-to-speech
- [ ] Export options (Anki, Quizlet, CSV)
- [ ] Collaborative learning features
- [ ] Mobile applications

### Phase 3 (Future)
- [ ] Advanced AI with image analysis
- [ ] Multi-language support
- [ ] LMS integrations
- [ ] Advanced analytics dashboard

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com/) for the backend infrastructure
- [Google AI](https://ai.google.dev/) for the Gemini API
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Shadcn/ui](https://ui.shadcn.com/) for the component library


**Made with ❤️ by the Cognita AI Team (which is just ME)**
