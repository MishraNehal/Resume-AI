# ResumeAI 

> AI-powered resume analyzer for optimizing job applications. Built to help students and professionals improve their resumes using intelligent AI analysis.

**[Live Demo](https://resume-ai-pi-three.vercel.app/)** | **[API Docs](https://resume-ai-backend-sn3m.onrender.com/docs)** | **[Video Demo](https://youtu.be/_x-MEgZDmW8)**

---

## 📌 Overview

ResumeAI is an AI-powered platform designed to help job seekers optimize and understand their resumes. Using NexusAI's Gemini model, the application provides actionable insights through multiple analysis tools - from ATS compatibility checking to personalized skill gap analysis.

**Technology Used:**
- **Backend:** FastAPI (Python 3.10+)
- **Frontend:** React + Vite + Tailwind CSS
- **AI:** NexusAI (Gemini 2.5 Flash model)
- **Hosting:** Render (Backend) + Vercel (Frontend)

---

## ✨ Features

### 1. 📄 **Resume Parsing**

**What it does:** Upload any resume file and automatically extract all structured data using AI.

**Key Details:**
- Supports PDF, DOCX, and TXT file formats
- Extracts all resume sections automatically (contact info, skills, experience, education, certifications, languages)
- Returns clean, structured JSON data ready for analysis
- Handles complex resume formats and layouts
- File size limit: 5MB maximum per upload
- Processes and returns data within seconds

**Use Case:** Get resume data in a structured format for further analysis or integration with other tools.

---

### 2. 🎯 **ATS (Applicant Tracking System) Checker**

**What it does:** Analyze how well your resume matches a specific job description using ATS scoring.

**Key Details:**
- Compares resume against job description keyword by keyword
- Provides overall compatibility score (0-100)
- Shows exactly which keywords from the job description are matched in your resume
- Identifies missing keywords that would improve your ATS score
- Provides specific recommendations to improve match rate
- Helps you understand what ATS systems look for

**Use Case:** Before applying for a job, check if your resume will pass through automated screening systems.

---

### 3. 💬 **Resume Chat (AI Q&A)**

**What it does:** Ask questions about your resume and get AI-powered answers based on your actual data.

**Key Details:**
- Chat interface to have conversations about your resume
- Answers only resume-related questions
- Provides insights based on your parsed resume data
- Maintains chat history for context-aware responses
- Can answer questions like: "What are my strongest skills?", "Do I have relevant experience for X role?"
- Provides personalized career advice based on your profile

**Use Case:** Get instant answers about your resume strengths, experience relevance, and career fit.

---

### 4. 📊 **Resume Quality Score & Analysis**

**What it does:** Get a comprehensive quality assessment of your resume across multiple dimensions.

**Key Details:**
- Overall quality score (0-100)
- Detailed breakdown across categories:
  - Contact completeness (all contact info present)
  - Summary quality (how compelling your summary is)
  - Experience depth (level of detail in job descriptions)
  - Skills relevance (how relevant skills are listed)
  - Education strength (education section completeness)
  - ATS friendliness (optimization for automated systems)
- Lists top strengths of your resume
- Identifies critical areas needing improvement
- Suggests specific actionable improvements
- Industry fit assessment (what sectors your resume targets)
- Experience level classification (Fresher, Junior, Mid-level, Senior, Lead)

**Use Case:** Understand exactly what's strong about your resume and what needs improvement before sending applications.

---

### 5. 🔄 **Resume Comparison**

**What it does:** Compare two resumes side-by-side to see how they differ and which is stronger.

**Key Details:**
- Upload two resumes and get detailed comparison
- AI-powered analysis of both resumes
- Category-based scoring:
  - Experience comparison (years, achievements)
  - Skills alignment (common, unique to each)
  - Education evaluation
  - Communication clarity
  - ATS friendliness
  - Leadership qualities
- Overall winner determination based on combined factors
- Identifies strengths and weaknesses of each resume
- Provides hiring recommendations for different roles
- Lists common skills between both resumes
- Shows unique skills in each resume

**Use Case:** For recruiters evaluating candidates, or for job seekers comparing their resume with a peer's resume.

---

### 6. 🛠️ **Skill Gap Analyzer**

**What it does:** Identify which skills you need to learn for your target job role.

**Key Details:**
- Analyzes your current skills against target job requirements
- Calculates role match percentage (how close you are to the role)
- Lists skills you already have (with proficiency levels: Beginner, Intermediate, Expert)
- Identifies missing skills categorized by priority:
  - Must Have (critical for the role)
  - Good to Have (helpful but not essential)
  - Nice to Have (bonus skills)
- For each missing skill, provides:
  - Estimated learning time (days/weeks/months)
  - Resource links for learning
- Creates a personalized learning roadmap with weekly milestones
- Provides "readiness verdict" (Ready to Apply / Almost Ready / Needs Work / Major Gap)

**Use Case:** Understand what you need to learn to be qualified for your dream job, with a clear learning plan.

---

### 7. 📝 **Cover Letter Generator**

**What it does:** Generate personalized, professional cover letters in seconds.

**Key Details:**
- Creates cover letters based on your resume and the job description
- Automatically fills in company name and job title
- Customizable tone (professional, friendly, formal)
- Returns formatted cover letter with:
  - Proper salutation
  - Opening paragraph (about the company)
  - Body paragraphs (why you're qualified)
  - Closing paragraph (call to action)
  - Professional signature
- Incorporates specific details from your resume and the job posting
- Maintains professional formatting ready for submission
- Can be easily edited before sending

**Use Case:** Save time creating tailored cover letters for each job application.

---

## 🛠️ Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Backend Framework** | FastAPI | 0.115.0 |
| **Frontend Framework** | React | 18+ |
| **Build Tool** | Vite | Latest |
| **Styling** | Tailwind CSS | Latest |
| **AI Provider** | NexusAI | - |
| **AI Model** | Gemini 2.5 Flash | Latest |
| **PDF Parsing** | pdfplumber | 0.11.4 |
| **Word Parsing** | python-docx | 1.1.2 |
| **HTTP Client** | Axios | Latest |
| **OpenAI Client** | openai | 1.30.5 |
| **Python** | 3.10+ | - |

---

## 🔄 How It Works (Technical Flow)

```
1. User uploads resume file (PDF/DOCX/TXT)
   ↓
2. Frontend sends file to backend API
   ↓
3. Backend extracts text using:
   - pdfplumber (for PDF files)
   - python-docx (for DOCX files)
   - Direct UTF-8 parsing (for TXT files)
   ↓
4. Send extracted text to NexusAI API with smart prompt
   ↓
5. NexusAI returns structured JSON with resume data
   ↓
6. Backend validates and parses JSON response
   - Handles truncated responses
   - Recovers malformed JSON
   - Validates all fields
   ↓
7. Return structured data to frontend
   ↓
8. React components render results
   ↓
9. User can run additional analysis:
   - ATS Score
   - Resume Score
   - Chat
   - Skill Gap
   - Comparison
   - Cover Letter
```

---

## 📁 Project Structure

```
resume-ai/
├── README.md
├── backend/
│   ├── main.py                  # FastAPI app with all endpoints
│   ├── requirements.txt         # Python dependencies
│   ├── runtime.txt              # Python version specification
│   ├── render.yaml              # Render deployment config
│   └── .env.example             # Environment variables template
│
└── frontend/
    ├── package.json             # NPM dependencies
    ├── vite.config.js           # Vite build configuration
    ├── tailwind.config.js        # Tailwind CSS configuration
    ├── postcss.config.js         # PostCSS configuration
    ├── src/
    │   ├── App.jsx              # Main app component
    │   ├── main.jsx             # React entry point
    │   ├── index.css            # Global styles
    │   ├── components/
    │   │   ├── DropZone.jsx             # File upload drag & drop
    │   │   ├── ResumeResults.jsx        # Display parsed resume data
    │   │   ├── ATSChecker.jsx           # ATS score interface
    │   │   ├── ResumeChat.jsx           # Chat with resume AI
    │   │   ├── ResumeComparison.jsx     # Compare two resumes
    │   │   ├── SkillGapAnalyzer.jsx     # Skill gap analysis
    │   │   ├── CoverLetterGenerator.jsx # Cover letter creation
    │   │   ├── ScoreDashboard.jsx       # Display resume score
    │   │   └── ToastContainer.jsx       # Toast notifications
    │   ├── services/
    │   │   ├── api.js                   # API client for backend calls
    │   │   └── keepAlive.js             # Keeps backend awake
    │   └── hooks/
    │       └── useToast.js              # Custom toast hook
    └── index.html
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- NexusAI API key (get free at [console.navigatelabsai.com](https://console.navigatelabsai.com/))

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env and add your API key
# NEXUS_API_KEY=your_api_key_here

# Start development server
uvicorn main:app --reload --port 8000
```

**Backend will be available at:** http://localhost:8000/docs

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be available at:** http://localhost:5173

---

## 🔌 API Endpoints Reference

**Base URL:** `/api` (or `/` for root)

### Resume Management

#### `POST /parse` - Parse Resume
Upload and parse a resume file.

**Input:** Multipart form-data with file (PDF, DOCX, or TXT)

**Output:**
```json
{
  "success": true,
  "filename": "resume.pdf",
  "resume_text": "[extracted raw text]",
  "data": {
    "name": "John Doe",
    "contact": {
      "email": "john@example.com",
      "phone": "+1 234-567-8900",
      "location": "New York, NY",
      "linkedin": "linkedin.com/in/johndoe",
      "github": "github.com/johndoe",
      "website": "johndoe.com"
    },
    "summary": "Software engineer with 5+ years of experience...",
    "skills": ["Python", "React", "PostgreSQL", "AWS", "Docker"],
    "experience": [
      {
        "title": "Senior Engineer",
        "company": "Tech Corp",
        "dates": "Jan 2020 - Present",
        "description": "Led team of 5 engineers, architected microservices..."
      }
    ],
    "education": [
      {
        "degree": "B.Tech Computer Science",
        "institution": "State University",
        "dates": "2016 - 2020",
        "gpa": "3.8"
      }
    ],
    "certifications": ["AWS Solutions Architect", "Docker Certified Associate"],
    "languages": ["English", "Spanish"]
  }
}
```

---

### AI Analysis Features

#### `POST /ats-score` - Calculate ATS Compatibility Score
Compare resume against a job description.

**Input:**
```json
{
  "resume_text": "[your resume text]",
  "job_description": "[job description text]"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "overall_score": 78,
    "keyword_match": 80,
    "experience_match": 75,
    "skills_match": 78,
    "education_match": 70,
    "matched_keywords": ["Python", "React", "REST API", "Agile"],
    "missing_keywords": ["Docker", "Kubernetes", "CI/CD", "AWS"],
    "strong_points": ["Strong technical skills", "Relevant experience"],
    "improvement_suggestions": ["Add containerization skills", "Mention cloud platforms"],
    "verdict": "Good Match"
  }
}
```

---

#### `POST /resume-score` - Get Detailed Resume Quality Score
Get comprehensive quality assessment.

**Input:**
```json
{
  "resume_data": { /* parsed resume object */ }
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "overall": 82,
    "sections": {
      "contact_completeness": {
        "score": 90,
        "feedback": "All contact info provided"
      },
      "summary_quality": {
        "score": 75,
        "feedback": "Summary could be more specific"
      },
      "experience_depth": {
        "score": 85,
        "feedback": "Good detail in job descriptions"
      },
      "skills_relevance": {
        "score": 80,
        "feedback": "Relevant skills listed"
      },
      "education_strength": {
        "score": 75,
        "feedback": "Education section complete"
      },
      "ats_friendliness": {
        "score": 75,
        "feedback": "Good keyword usage"
      }
    },
    "top_strengths": ["Clear structure", "Good technical depth"],
    "critical_improvements": ["Add metrics to achievements", "Improve action verbs"],
    "industry_fit": ["Technology", "Software Development"],
    "experience_level": "Mid-level"
  }
}
```

---

#### `POST /chat` - Chat with Resume AI
Ask questions about resume data.

**Input:**
```json
{
  "message": "What are my strongest skills?",
  "resume_data": { /* parsed resume */ },
  "chat_history": []
}
```

**Output:**
```json
{
  "success": true,
  "reply": "Based on your resume, your strongest skills are Python, React, and system design. You have deep experience with..."
}
```

---

#### `POST /skill-gap` - Analyze Skill Gaps for Target Role
Identify missing skills and create learning roadmap.

**Input:**
```json
{
  "resume_data": { /* parsed resume */ },
  "target_role": "DevOps Engineer"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "role_match_percentage": 65,
    "has_skills": [
      {
        "skill": "Python",
        "level": "Intermediate",
        "relevance": "High"
      },
      {
        "skill": "AWS",
        "level": "Beginner",
        "relevance": "High"
      }
    ],
    "missing_skills": [
      {
        "skill": "Docker",
        "priority": "Must Have",
        "learn_time": "2 weeks",
        "resource": "https://docs.docker.com"
      },
      {
        "skill": "Kubernetes",
        "priority": "Must Have",
        "learn_time": "1 month",
        "resource": "https://kubernetes.io"
      }
    ],
    "roadmap": [
      {
        "week": "1-2",
        "focus": "Docker Fundamentals",
        "action": "Complete Docker getting started guide"
      }
    ],
    "verdict": "Almost Ready"
  }
}
```

---

#### `POST /compare-resumes` - Compare Two Resumes
Compare and analyze two resumes.

**Input:**
```json
{
  "resume_1": { /* first resume data */ },
  "resume_2": { /* second resume data */ },
  "job_description": "[optional job description]"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "winner": "resume_1",
    "overall_scores": {
      "resume_1": 78,
      "resume_2": 72
    },
    "category_comparison": {
      "experience": {
        "resume_1_score": 80,
        "resume_2_score": 70,
        "winner": "resume_1"
      }
    },
    "skills_comparison": {
      "common_skills": ["Python", "React"],
      "only_in_resume_1": ["Docker", "Kubernetes"],
      "only_in_resume_2": ["Node.js", "MongoDB"]
    }
  }
}
```

---

#### `POST /cover-letter` - Generate Cover Letter
Generate personalized cover letter.

**Input:**
```json
{
  "resume_data": { /* parsed resume */ },
  "job_description": "[job description]",
  "tone": "professional"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "subject": "Application for Senior Engineer Position at Tech Corp",
    "cover_letter": "Dear Hiring Manager,\n\n[Generated cover letter text]"
  }
}
```

---

#### `GET /health` - Check Backend Status
Quick health check.

**Output:**
```json
{
  "status": "ok"
}
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in backend directory:

```env
NEXUS_API_KEY=your_nexus_ai_api_key_here
```

**Get API Key:**
- Visit [console.navigatelabsai.com](https://console.navigatelabsai.com/)
- Sign up for free account
- Generate API key from dashboard
- Copy and paste into `.env` file

### Deployment

**Frontend (Vercel):**
- Automatic deployment on git push to main branch
- Build command: `npm run build`
- Environment variables: None required for frontend

**Backend (Render):**
- Free tier instances have cold starts (~30 seconds on first request)
- Environment variable required: `NEXUS_API_KEY`
- Keep-alive pinging prevents automatic sleep
- Set up via Render dashboard after connecting GitHub repository

---

## 📊 Features Comparison Table

| Feature | Free | Details |
|---------|------|---------|
| Resume Parsing | ✅ | Unlimited uploads |
| ATS Checker | ✅ | Unlimited checks |
| Resume Chat | ✅ | Unlimited questions |
| Quality Score | ✅ | Unlimited scoring |
| Resume Compare | ✅ | Compare 2 resumes |
| Skill Gap | ✅ | Unlimited analysis |
| Cover Letter | ✅ | Unlimited generation |

---

## 📚 Resources & Links

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Official Docs](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [pdfplumber GitHub](https://github.com/jsvine/pdfplumber)
- [python-docx Documentation](https://python-docx.readthedocs.io/)
- [NexusAI Console](https://console.navigatelabsai.com/)
- [OpenAI Python Client](https://github.com/openai/openai-python)

---

## 📝 License

MIT License - Open source and free to use, modify, and distribute.

---

## 🎯 Summary

ResumeAI is a comprehensive AI-powered resume analysis tool built with modern web technologies. It provides 7 key features to help optimize resumes for job applications, from automated parsing to ATS compatibility checking to AI-powered skill gap analysis.

**Key Highlights:**
- ✅ Fully functional and deployed to production
- ✅ Clean, intuitive user interface
- ✅ Powerful AI-driven analysis using NexusAI
- ✅ Multiple analysis tools in one platform
- ✅ Free to use
- ✅ Ready for portfolio and interviews

---

**Built for learning | Deployed to production | Ready for real use**

