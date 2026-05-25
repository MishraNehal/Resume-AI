from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import pdfplumber
import docx
import io
import json
import os

load_dotenv()

app = FastAPI(title="Resume Parser API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.environ.get("NEXUS_API_KEY"),
    base_url="https://apidev.navigatelabsai.com",
)

MAX_FILE_SIZE = 5 * 1024 * 1024


# ── Pydantic Models ────────────────────────────────────────────────────────────

class ATSScoreRequest(BaseModel):
    resume_text: str
    job_description: str

class ChatRequest(BaseModel):
    message: str
    resume_data: dict
    chat_history: list = []

class CoverLetterRequest(BaseModel):
    resume_data: dict
    job_description: str
    tone: str = "professional"

class ResumeScoreRequest(BaseModel):
    resume_data: dict

class SkillGapRequest(BaseModel):
    resume_data: dict
    target_role: str

class CompareResumesRequest(BaseModel):
    resume_1: dict
    resume_2: dict
    job_description: str = ""


# ── Text Extractors ────────────────────────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)

def extract_text_from_docx(file_bytes: bytes) -> str:
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join(para.text for para in doc.paragraphs if para.text.strip())

def extract_text_from_txt(file_bytes: bytes) -> str:
    return file_bytes.decode("utf-8", errors="ignore")


# ── JSON Parser ────────────────────────────────────────────────────────────────

def parse_json_response(raw: str) -> dict:
    """Robustly parse JSON — handles truncation, markdown fences, extra text."""
    text = raw.strip()

    # Strip markdown fences
    if "```" in text:
        parts = text.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            try:
                result = json.loads(part)
                if isinstance(result, dict):
                    return result
            except Exception:
                continue

    # Try direct parse
    try:
        result = json.loads(text)
        if isinstance(result, dict):
            return result
    except Exception:
        pass

    # Last resort — find outermost { } and parse
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        try:
            result = json.loads(text[start:end + 1])
            if isinstance(result, dict):
                return result
        except Exception:
            pass

    raise json.JSONDecodeError("No valid JSON object found", text, 0)


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Resume Parser API is running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/parse")
async def parse_resume(file: UploadFile = File(...)):
    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ("pdf", "docx", "txt"):
        raise HTTPException(status_code=400, detail="Unsupported file type. Use PDF, DOCX, or TXT.")

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Max 5MB.")

    try:
        if ext == "pdf":
            text = extract_text_from_pdf(file_bytes)
        elif ext == "docx":
            text = extract_text_from_docx(file_bytes)
        else:
            text = extract_text_from_txt(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Failed to extract text: {str(e)}")

    if not text or len(text.strip()) < 30:
        raise HTTPException(status_code=422, detail="Could not extract sufficient text.")

    raw = ""
    try:
        prompt = (
            "You are a resume parsing expert. Extract ALL information from the resume text below.\n"
            "Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just JSON.\n\n"
            "Required JSON structure:\n"
            '{"name":"","contact":{"email":"","phone":"","location":"","linkedin":"","github":"","website":""},'
            '"summary":"","skills":[],"experience":[{"title":"","company":"","dates":"","description":""}],'
            '"education":[{"degree":"","institution":"","dates":"","gpa":""}],'
            '"certifications":[],"languages":[]}\n\n'
            f"Resume text:\n{text[:8000]}"
        )
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.choices[0].message.content.strip()
        parsed = parse_json_response(raw)
    except json.JSONDecodeError:
        print("PARSE - FAILED RAW:", raw[:300])
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Please try again.")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI API error: {str(e)}")

    return {"success": True, "data": parsed, "resume_text": text, "filename": file.filename}


@app.post("/ats-score")
async def ats_score(request: ATSScoreRequest):
    raw = ""
    try:
        prompt = (
            "You are an ATS (Applicant Tracking System) expert.\n"
            "Compare the resume against the job description carefully.\n"
            "Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just JSON.\n\n"
            "Required JSON structure (fill all fields with real values):\n"
            '{"overall_score":75,"keyword_match":80,"experience_match":70,"skills_match":75,"education_match":65,'
            '"matched_keywords":["python","machine learning"],'
            '"missing_keywords":["docker","kubernetes"],'
            '"strong_points":["Strong ML background","Good Python skills","Relevant experience"],'
            '"improvement_suggestions":["Add Docker experience","Include cloud certifications","Add more quantified achievements"],'
            '"verdict":"Good Match"}\n\n'
            "verdict must be one of: Strong Match, Good Match, Partial Match, Weak Match\n\n"
            "IMPORTANT: Keep matched_keywords and missing_keywords lists under 10 items each. Be concise."
            f"Resume:\n{request.resume_text[:4000]}\n\n"
            f"Job Description:\n{request.job_description[:3000]}"
        )
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            max_tokens=8000,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.choices[0].message.content.strip()
        print("ATS RAW:", raw[:200])
        result = parse_json_response(raw)
        return {"success": True, "data": result}
    except json.JSONDecodeError:
        print("ATS - FAILED RAW:", raw[:300])
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")
    except Exception as e:
        print("ATS ERROR:", str(e))
        raise HTTPException(status_code=502, detail=f"AI API error: {str(e)}")


@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        messages = []
        for msg in request.chat_history[-10:]:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

        user_message = (
            "You are a career advisor AI. You have access to this resume:\n\n"
            f"{json.dumps(request.resume_data, indent=2)[:3000]}\n\n"
            "Answer the following question based on this resume. "
            "Be specific, concise (max 150 words), encouraging but honest.\n\n"
            f"Question: {request.message}"
        )
        messages.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            max_tokens=500,
            messages=messages,
        )
        reply = response.choices[0].message.content.strip()
        return {"success": True, "reply": reply}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI API error: {str(e)}")


@app.post("/cover-letter")
async def cover_letter(request: CoverLetterRequest):
    raw = ""
    try:
        prompt = (
            f"Generate a professional cover letter. Tone: {request.tone}\n"
            "Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just JSON.\n\n"
            "Required JSON structure:\n"
            '{"subject":"Application for [Job Title] Position","cover_letter":"Dear Hiring Manager,\\n\\n[full letter text]\\n\\nSincerely,\\n[Name]"}\n\n'
            f"Resume data:\n{json.dumps(request.resume_data, indent=2)[:3000]}\n\n"
            f"Job description:\n{request.job_description[:2000]}"
        )
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            max_tokens=2500,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.choices[0].message.content.strip()
        result = parse_json_response(raw)
        return {"success": True, "data": result}
    except json.JSONDecodeError:
        print("COVER LETTER - FAILED RAW:", raw[:300])
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI API error: {str(e)}")


@app.post("/resume-score")
async def resume_score(request: ResumeScoreRequest):
    raw = ""
    try:
        prompt = (
            "You are a resume quality expert. Analyze this resume and score it.\n"
            "Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just JSON.\n\n"
            "Required JSON structure (use real scores based on the resume):\n"
            '{"overall":75,'
            '"sections":{'
            '"contact_completeness":{"score":80,"feedback":"Good contact info provided"},'
            '"summary_quality":{"score":70,"feedback":"Summary could be more specific"},'
            '"experience_depth":{"score":75,"feedback":"Good experience detail"},'
            '"skills_relevance":{"score":80,"feedback":"Relevant skills listed"},'
            '"education_strength":{"score":70,"feedback":"Education section complete"},'
            '"ats_friendliness":{"score":65,"feedback":"Could improve keyword usage"}},'
            '"top_strengths":["Strong technical skills","Relevant experience","Good education background"],'
            '"critical_improvements":["Add more quantified achievements","Improve ATS keywords"],'
            '"industry_fit":["Technology","Data Science","Software Engineering"],'
            '"experience_level":"Mid-level"}\n\n'
            "experience_level must be one of: Fresher, Junior, Mid-level, Senior, Lead\n\n"
            "IMPORTANT: Keep all feedback under 10 words each. Keep lists under 5 items. Be concise."
            f"Resume data:\n{json.dumps(request.resume_data, indent=2)[:4000]}"
        )
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            max_tokens=8000,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.choices[0].message.content.strip()
        print("SCORE RAW:", raw[:200])
        result = parse_json_response(raw)
        return {"success": True, "data": result}
    except json.JSONDecodeError:
        print("SCORE - FAILED RAW:", raw[:300])
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")
    except Exception as e:
        print("SCORE ERROR:", str(e))
        raise HTTPException(status_code=502, detail=f"AI API error: {str(e)}")


@app.post("/skill-gap")
async def skill_gap(request: SkillGapRequest):
    raw = ""
    try:
        prompt = (
            f"You are a tech hiring expert. Analyze this resume for the target role: {request.target_role}\n"
            "Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just JSON.\n\n"
            "Required JSON structure:\n"
            '{"role_match_percentage":72,'
            '"has_skills":[{"skill":"Python","level":"Expert","relevance":"High"},{"skill":"SQL","level":"Intermediate","relevance":"High"}],'
            '"missing_skills":[{"skill":"Docker","priority":"Must Have","learn_time":"2 weeks","resource":"https://docs.docker.com"},{"skill":"Kubernetes","priority":"Good to Have","learn_time":"1 month","resource":"https://kubernetes.io/docs"}],'
            '"roadmap":[{"week":"1-2","focus":"Learn Docker basics","action":"Complete Docker getting started tutorial"},{"week":"3-4","focus":"Cloud fundamentals","action":"Complete AWS free tier course"}],'
            '"verdict":"Almost Ready"}\n\n'
            "level must be: Expert, Intermediate, or Beginner\n"
            "priority must be: Must Have, Good to Have, or Nice to Have\n"
            "verdict must be: Ready to Apply, Almost Ready, Needs Work, or Major Gap\n\n"
            "IMPORTANT: has_skills max 8 items. missing_skills max 6 items. roadmap max 4 items. Be concise."
            f"Resume data:\n{json.dumps(request.resume_data, indent=2)[:4000]}"
        )
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            max_tokens=8000,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.choices[0].message.content.strip()
        print("SKILL GAP RAW:", raw[:200])
        result = parse_json_response(raw)
        return {"success": True, "data": result}
    except json.JSONDecodeError:
        print("SKILL GAP - FAILED RAW:", raw[:300])
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")
    except Exception as e:
        print("SKILL GAP ERROR:", str(e))
        raise HTTPException(status_code=502, detail=f"AI API error: {str(e)}")


@app.post("/compare-resumes")
async def compare_resumes(request: CompareResumesRequest):
    raw = ""
    try:
        prompt = (
            "You are a professional resume evaluator and hiring expert.\n"
            "Compare these two resumes in detail.\n"
            "Return ONLY a raw JSON object. No markdown. No backticks. No explanation. Just JSON.\n\n"
            "Required JSON structure:\n"
            '{"winner":"resume_1",'
            '"verdict":"Candidate A has stronger technical skills and more relevant experience",'
            '"overall_scores":{"resume_1":78,"resume_2":72},'
            '"category_comparison":{'
            '"experience":{"resume_1_score":80,"resume_2_score":70,"resume_1_note":"More years of experience","resume_2_note":"Less experience but good projects","winner":"resume_1"},'
            '"skills":{"resume_1_score":75,"resume_2_score":78,"resume_1_note":"Broad skill set","resume_2_note":"More specialized skills","winner":"resume_2"},'
            '"education":{"resume_1_score":70,"resume_2_score":75,"resume_1_note":"Good degree","resume_2_note":"Better institution","winner":"resume_2"},'
            '"communication":{"resume_1_score":72,"resume_2_score":68,"resume_1_note":"Clear writing","resume_2_note":"Could be clearer","winner":"resume_1"},'
            '"ats_friendliness":{"resume_1_score":78,"resume_2_score":65,"resume_1_note":"Good keywords","resume_2_note":"Needs more keywords","winner":"resume_1"},'
            '"leadership":{"resume_1_score":70,"resume_2_score":60,"resume_1_note":"Some leadership shown","resume_2_note":"Limited leadership","winner":"resume_1"}},'
            '"skills_comparison":{"common_skills":["Python","SQL"],"only_in_resume_1":["Docker","AWS"],"only_in_resume_2":["React","Node.js"]},'
            '"experience_comparison":{"resume_1_years":"4 years","resume_2_years":"2 years","resume_1_highlights":["Led team of 5","Built ML pipeline"],"resume_2_highlights":["Developed React app","Improved performance by 30%"]},'
            '"strengths":{"resume_1":["Strong experience","Good ATS score","Leadership skills"],"resume_2":["Strong technical skills","Good education","Fresh perspective"]},'
            '"weaknesses":{"resume_1":["Less specialized","Older tech stack"],"resume_2":["Less experience","Limited leadership"]},'
            '"hire_recommendation":{"for_technical_role":"resume_2","for_leadership_role":"resume_1","for_entry_level":"resume_2","reasoning":"Candidate A is better for leadership roles due to more experience, while Candidate B has stronger specialized technical skills suitable for individual contributor roles."},'
            '"ats_score_with_job":{"resume_1":75,"resume_2":68}}\n\n'
            "winner must be: resume_1, resume_2, or tie\n\n"
            f"Resume 1:\n{json.dumps(request.resume_1, indent=2)[:3000]}\n\n"
            f"Resume 2:\n{json.dumps(request.resume_2, indent=2)[:3000]}\n\n"
            f"Job Description: {request.job_description or 'Not provided'}"
        )
        response = client.chat.completions.create(
            model="gemini-2.5-flash",
            max_tokens=4000,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.choices[0].message.content.strip()
        print("COMPARE RAW:", raw[:200])
        result = parse_json_response(raw)
        return {"success": True, "data": result}
    except json.JSONDecodeError:
        print("COMPARE - FAILED RAW:", raw[:300])
        raise HTTPException(status_code=500, detail="AI returned invalid JSON.")
    except Exception as e:
        print("COMPARE ERROR:", str(e))
        raise HTTPException(status_code=502, detail=f"AI API error: {str(e)}")