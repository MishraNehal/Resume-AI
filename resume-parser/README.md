# Resume Parser

AI-powered resume parser using **FastAPI** (backend) + **React + Vite** (frontend) + **NexusAI** (OpenAI-compatible API).

---

## Project Structure

```
resume-parser/
├── backend/
│   ├── main.py              # FastAPI app — /parse endpoint
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Copy to .env and add your API key
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── DropZone.jsx
    │   │   └── ResumeResults.jsx
    │   └── services/
    │       └── api.js       # Axios calls to backend
    ├── package.json
    └── vite.config.js       # Proxies /api → localhost:8000
```

---

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- An [NexusAI API key](https://console.anthropic.com/)

---

### 1. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Set your API key
cp .env.example .env
# Edit .env and set: NEXUS_API_KEY=your_key_here

# Run the server
uvicorn main:app --reload --port 8000
```

Backend runs at: http://localhost:8000
API docs at: http://localhost:8000/docs

---

### 2. Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:5173

---

## How it works

1. User uploads PDF, DOCX, or TXT resume in the React UI
2. Frontend sends file to `POST /api/parse` (proxied to FastAPI on :8000)
3. Backend extracts raw text using `pdfplumber` (PDF) or `python-docx` (DOCX)
4. Extracted text is sent to Claude AI with a structured extraction prompt
5. Claude returns a JSON object with all resume fields
6. Frontend renders the parsed data in a clean card-based UI

---

## API Reference

### `POST /parse`
Upload a resume file for parsing.

**Request:** `multipart/form-data` with `file` field (PDF, DOCX, or TXT)

**Response:**
```json
{
  "success": true,
  "filename": "resume.pdf",
  "data": {
    "name": "Jane Doe",
    "contact": {
      "email": "jane@example.com",
      "phone": "+1 555-000-0000",
      "location": "New York, NY",
      "linkedin": "linkedin.com/in/janedoe",
      "github": "",
      "website": ""
    },
    "summary": "Senior software engineer with 8 years of experience...",
    "skills": ["Python", "React", "PostgreSQL"],
    "experience": [
      {
        "title": "Senior Engineer",
        "company": "Acme Corp",
        "dates": "Jan 2021 – Present",
        "description": "Led backend migration to microservices..."
      }
    ],
    "education": [
      {
        "degree": "B.Tech Computer Science",
        "institution": "IIT Bombay",
        "dates": "2012 – 2016",
        "gpa": "8.5"
      }
    ],
    "certifications": ["AWS Solutions Architect"],
    "languages": ["English", "Hindi"]
  }
}
```

---

## VS Code Tips

- Install the **Python** and **ESLint** extensions
- Use the **Thunder Client** extension to test the API at `http://localhost:8000/docs`
- Open both `backend/` and `frontend/` as a multi-root workspace in VS Code
# Resume-AI
