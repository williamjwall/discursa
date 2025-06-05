# CognitioFlux 🧠⚡

> Agent-powered learning platform that turns any topic into sequenced micro-courses built from peer-reviewed sources

CognitioFlux is an intelligent learning system that transforms any subject—whether "psycholinguistics" or "quantum finance"—into a structured micro-course with bite-sized lessons, spaced repetition, and live academic citations. The platform creates a continuous "flow of learning" (cognitio + flux) that feels lighter than a textbook but deeper than a tweet.

## 🚀 Features

### Core Learning Engine
- **Syllabus Generation Agent**: Breaks topics into 4-6 digestible modules with clear learning objectives
- **Source Retrieval Agent**: Fetches high-quality papers from arXiv, Semantic Scholar, and academic sources
- **Lesson Composer Agent**: Creates 3-minute explainers with inline APA citations
- **Spaced Repetition Scheduler**: SM-2 algorithm for optimal review timing
- **Quiz Generator**: Creates MCQ and cloze questions for each lesson

### Learning Experience
- 📚 **Micro-lessons**: 250-300 word explanations designed for 3-minute reading
- 🔗 **Academic Citations**: Every claim backed by peer-reviewed sources
- 📅 **Daily Feed**: Personalized lessons and reviews delivered daily
- 📊 **Progress Tracking**: Statistics, streaks, and completion metrics
- 🧠 **Adaptive Learning**: Difficulty-based scheduling for optimal retention

### Full-Stack Web Application
- 🎨 **Beautiful React Frontend**: Modern UI with Tailwind CSS and Framer Motion
- ⚡ **FastAPI Backend**: High-performance API with automatic documentation
- 🗄️ **SQLite Database**: Local storage with comprehensive schema
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔄 **Real-time Updates**: Live progress tracking and notifications

## 🏗️ Architecture

The platform follows a modular agent-based architecture with a modern React frontend:

```
Frontend (React + Vite)          Backend (FastAPI + SQLAlchemy)
┌─────────────────────┐         ┌─────────────────────────────┐
│ • Landing Page      │         │ ┌─────────────────┐         │
│ • Dashboard         │ ◄────── │ │ Syllabus Agent  │         │
│ • Course Creator    │         │ └─────────────────┘         │
│ • Learning Feed     │         │ ┌─────────────────┐         │
│ • Lesson View       │         │ │ Retrieval Agent │         │
└─────────────────────┘         │ └─────────────────┘         │
         │                      │ ┌─────────────────┐         │
         │ HTTP/REST API        │ │ Lesson Composer │         │
         └──────────────────────► └─────────────────┘         │
                                │ ┌─────────────────┐         │
                                │ │ Course          │         │
                                │ │ Orchestrator    │         │
                                │ └─────────────────┘         │
                                │ ┌─────────────────┐         │
                                │ │ SQLite Database │         │
                                │ └─────────────────┘         │
                                └─────────────────────────────┘
```

## 🛠️ Installation & Setup

### Prerequisites
- **Python 3.8+** with pip
- **Node.js 16+** with npm
- **OpenAI API key** (required for course generation)

### Quick Start (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cognitioflux
   ```

2. **Set up Python environment**
   ```bash
   # Create virtual environment (recommended)
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   
   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Configure environment**
   ```bash
   # Copy environment template
   cp env_example.txt .env
   
   # Edit .env and add your OpenAI API key
   # OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Launch the full-stack application**
   ```bash
   python run_fullstack.py
   ```

   This will:
   - Install frontend dependencies automatically
   - Initialize the SQLite database
   - Start the FastAPI backend on http://localhost:8000
   - Start the React frontend on http://localhost:3000
   - Open your browser to the application

5. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs

### Manual Setup (Alternative)

If you prefer to run the services separately:

**Backend Setup:**
```bash
# Initialize database
python cli.py init

# Start FastAPI server
python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend Setup:**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🎯 Quick Start Guide

### 1. Create Your First Course

1. Open http://localhost:3000 in your browser
2. Enter your email on the landing page
3. Click "Create New Course" 
4. Enter a topic (e.g., "quantum computing")
5. Wait 2-3 minutes for AI agents to generate your course
6. Start learning with your personalized daily feed!

### 2. Using the CLI (Optional)

You can also use the command-line interface:

```bash
# Create a course
python cli.py create "psycholinguistics" --email your@email.com

# Get your daily learning feed
python cli.py daily your@email.com

# View course overview
python cli.py overview 1

# Record lesson completion
python cli.py complete your@email.com 1 --correct --difficulty 3
```

### 3. API Usage (For Developers)

The REST API is available at http://localhost:8000 with full OpenAPI documentation:

```bash
# Create a course
curl -X POST "http://localhost:8000/courses/create" \
  -H "Content-Type: application/json" \
  -d '{"topic": "machine learning", "user_email": "test@example.com"}'

# Get daily feed
curl "http://localhost:8000/users/test@example.com/daily"
```

## 📱 Frontend Features

### 🎨 Beautiful User Interface
- **Landing Page**: Compelling introduction with feature highlights
- **Dashboard**: Comprehensive overview with progress tracking
- **Course Creator**: Intuitive form with real-time creation progress
- **Learning Feed**: Personalized daily lessons and reviews
- **Responsive Design**: Optimized for all screen sizes

### 🔧 Technical Stack
- **React 18** with hooks and modern patterns
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **Lucide React** for beautiful icons
- **React Router** for client-side routing
- **Axios** for API communication
- **React Hot Toast** for notifications

### 📊 User Experience
- **Intuitive Navigation** with active state indicators
- **Real-time Progress Tracking** with visual feedback
- **Animated Transitions** for smooth interactions
- **Loading States** with elegant loading indicators
- **Error Handling** with user-friendly messages
- **Responsive Design** that works on all devices

## 🗄️ Database Schema

The platform uses SQLite with a comprehensive schema:

- **courses**: Course metadata and descriptions
- **modules**: Learning modules within courses  
- **lessons**: Individual lesson content with citations
- **sources**: Academic papers and references
- **users**: User accounts and preferences
- **user_progress**: Spaced repetition tracking (SM-2 algorithm)
- **quizzes**: Assessment questions with explanations

## 🧠 Learning Algorithm

### Spaced Repetition (SM-2)

The platform implements the SuperMemo SM-2 algorithm for optimal review scheduling:

1. **Quality Assessment**: User performance + difficulty rating → quality score (0-5)
2. **Interval Calculation**: Based on previous performance and easiness factor
3. **Adaptive Scheduling**: Difficult items appear more frequently

### Quality Score Mapping

| Quiz Result | Difficulty Rating | Quality Score | Next Interval |
|-------------|------------------|---------------|---------------|
| ✅ Correct | 1-2 (Easy) | 5 | Longer |
| ✅ Correct | 3 (Medium) | 4 | Standard |
| ✅ Correct | 4-5 (Hard) | 3 | Shorter |
| ❌ Incorrect | Any | 1-2 | Reset |

## 🔍 Academic Source Quality

### Source Validation Criteria

- **DOI or Academic URL required**
- **Minimum abstract length**: 50 characters
- **Academic indicators**: Research, study, analysis, method, theory
- **Relevance threshold**: 0.3+ keyword overlap
- **Source diversity**: arXiv, Semantic Scholar, academic domains

### Citation Standards

- **APA Format**: (Author, Year) inline citations
- **Full References**: Complete bibliographic information
- **Citation Audit**: LLM validates all factual claims are cited
- **Source Linking**: DOI/URL for verification

## 🎯 API Reference

### Core Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/courses/create` | Create new course from topic |
| `GET` | `/users/{email}/daily` | Get daily learning feed |
| `GET` | `/courses/{id}` | Get course overview |
| `POST` | `/lessons/complete` | Record lesson completion |
| `GET` | `/users/{email}/statistics` | Get learning statistics |
| `GET` | `/health` | Health check endpoint |

### Example API Usage

**Create a Course:**
```json
POST /courses/create
{
  "topic": "behavioral economics",
  "user_email": "learner@example.com",
  "context": "Focus on decision-making biases"
}
```

**Daily Feed Response:**
```json
{
  "user_email": "learner@example.com",
  "daily_lessons": [
    {
      "lesson_id": 1,
      "title": "Introduction to Cognitive Biases",
      "type": "new",
      "estimated_time": 3,
      "repetition": 0
    }
  ],
  "statistics": {
    "total_lessons": 5,
    "completed_lessons": 0,
    "current_streak": 0,
    "lessons_due_today": 1
  }
}
```

## 🚧 Development

### Project Structure

```
cognitioflux/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Application pages
│   │   ├── lib/             # Utilities and API client
│   │   └── App.jsx          # Main application component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── agents/                   # AI agents for course generation
│   ├── syllabus_agent.py    # Syllabus generation
│   ├── retrieval_agent.py   # Source retrieval
│   ├── lesson_composer.py   # Lesson composition
│   └── scheduler.py         # Spaced repetition
├── api/                     # FastAPI backend
│   └── main.py              # API routes and endpoints
├── database/                # Database models and setup
│   ├── models.py            # SQLAlchemy models
│   └── database.py          # Database configuration
├── course_orchestrator.py   # Main orchestration logic
├── cli.py                   # Command-line interface
├── demo.py                  # Demo script
├── run_fullstack.py         # Full-stack launcher
└── requirements.txt         # Python dependencies
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
# Use a production WSGI server like Gunicorn
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker api.main:app
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
RESEND_API_KEY=your_resend_api_key_here
NEWS_API_KEY=your_news_api_key_here
LANGSMITH_API_KEY=your_langsmith_api_key_here
```

### Settings (`config.py`)

- `max_sources_per_module`: Number of sources to retrieve (default: 5)
- `lesson_word_count`: Target word count for lessons (default: 300)
- `openai_model`: OpenAI model to use (default: "gpt-4-turbo-preview")

## 🚀 Deployment

### Docker (Recommended)

```dockerfile
# Example Dockerfile for production deployment
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ .
RUN npm run build

FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
COPY --from=frontend-build /app/frontend/dist ./static
EXPOSE 8000
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloud Platforms

The application can be deployed on:
- **Vercel/Netlify** (Frontend) + **Railway/Heroku** (Backend)
- **AWS** (S3 + Lambda/EC2)
- **Google Cloud Platform** (Cloud Run)
- **DigitalOcean** (App Platform)

## 🔮 Roadmap

### V1 Features (Current)
- ✅ Core agent pipeline with full-stack web interface
- ✅ Beautiful React frontend with modern UI/UX
- ✅ FastAPI backend with comprehensive API
- ✅ Local SQLite database with full schema
- ✅ Spaced repetition with SM-2 algorithm
- ✅ Academic source retrieval and validation

### V2 Features (Planned)
- 📧 Email notifications and newsletters
- 📱 Progressive Web App (PWA) capabilities
- 🔍 Enhanced source filtering and quality scoring
- 📊 Advanced analytics dashboard
- 🌐 Multi-language support
- 👥 User accounts with authentication

### V3 Features (Future)
- 🤖 News watch agent for current research
- 🎯 Personalized learning paths with ML
- 🏆 Gamification and achievement system
- 👥 Collaborative learning features
- 🔌 Integration marketplace and plugins
- 🎓 Certification and credentialing

## 🤝 Support & Community

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides and API docs
- **Demo**: Try the live demo at [demo.cognitioflux.ai](https://demo.cognitioflux.ai)
- **Discord**: Join our learning community

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **LangChain**: For the agent framework and LLM integrations
- **arXiv**: For open access to research papers
- **Semantic Scholar**: For academic paper metadata and search
- **SuperMemo**: For the SM-2 spaced repetition algorithm
- **OpenAI**: For GPT-4 language model capabilities
- **React Community**: For the amazing ecosystem and tools

---

**CognitioFlux**: Making learning flow naturally from curiosity to mastery 🧠⚡

*Built with ❤️ for lifelong learners, researchers, and knowledge enthusiasts* 