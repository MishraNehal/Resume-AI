import axios from 'axios'

// ✅ FIX: Read from env variable so you don't have to edit code when ngrok URL changes
// Create frontend/.env with: VITE_API_BASE=https://your-ngrok-url.ngrok-free.dev
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  'https://workmanlike-calculably-garrison.ngrok-free.dev'

const headers = {
  'ngrok-skip-browser-warning': 'true',
}

// ✅ FIX: Centralized error extractor so every function gives clean error messages
function extractError(err) {
  return err.response?.data?.detail || err.message || 'Something went wrong. Please try again.'
}

// ── Parse resume file ──────────────────────────────────────────────────────────
export async function parseResume(file) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await axios.post(`${API_BASE}/parse`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...headers,
      },
    })
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}

// ── ATS score analysis ─────────────────────────────────────────────────────────
export async function analyzeATS(resumeText, jobDescription) {
  try {
    const response = await axios.post(
      `${API_BASE}/ats-score`,
      { resume_text: resumeText, job_description: jobDescription },
      { headers }
    )
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}

// ── Chat with resume ───────────────────────────────────────────────────────────
export async function chatWithResume(message, resumeData, chatHistory = []) {
  try {
    const response = await axios.post(
      `${API_BASE}/chat`,
      {
        message,
        resume_data: resumeData,
        // ✅ FIX: Only send last 10 messages to avoid token overflow
        chat_history: chatHistory.slice(-10),
      },
      { headers }
    )
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}

// ── Cover letter generator ─────────────────────────────────────────────────────
export async function generateCoverLetter(resumeData, jobDescription, tone = 'professional') {
  try {
    const response = await axios.post(
      `${API_BASE}/cover-letter`,
      { resume_data: resumeData, job_description: jobDescription, tone },
      { headers }
    )
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}

// ── Resume score ───────────────────────────────────────────────────────────────
export async function getResumeScore(resumeData) {
  try {
    const response = await axios.post(
      `${API_BASE}/resume-score`,
      { resume_data: resumeData },
      { headers }
    )
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}

// ── Skill gap analyzer ─────────────────────────────────────────────────────────
export async function analyzeSkillGap(resumeData, targetRole) {
  try {
    const response = await axios.post(
      `${API_BASE}/skill-gap`,
      { resume_data: resumeData, target_role: targetRole },
      { headers }
    )
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}

// ✅ NEW: Compare two resumes
export async function compareResumes(resume1, resume2, jobDescription = '') {
  try {
    const response = await axios.post(
      `${API_BASE}/compare-resumes`,
      {
        resume_1: resume1,
        resume_2: resume2,
        job_description: jobDescription,
      },
      { headers }
    )
    return response.data
  } catch (err) {
    throw new Error(extractError(err))
  }
}
