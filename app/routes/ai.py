from fastapi import APIRouter, Depends,UploadFile, File
from app.routes.auth import get_current_user
from groq import Groq
from dotenv import load_dotenv
import os
import PyPDF2
import io

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@router.post("/cover-letter")
def generate_cover_letter(data: dict, current_user: dict = Depends(get_current_user)):
    job_description = data.get("jobDescription", "")
    job_role = data.get("jobRole", "")
    company_name = data.get("companyName", "")
    resume_summary = data.get("resumeSummary", "")

    prompt = f"""
    Generate a professional cover letter for the following:
    
    Company: {company_name}
    Job Role: {job_role}
    Job Description: {job_description}
    Candidate Resume Summary: {resume_summary}
    
    Write a compelling, professional cover letter in 3 paragraphs.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"cover_letter": response.choices[0].message.content}

@router.post("/resume-optimizer")
def optimize_resume(data: dict, current_user: dict = Depends(get_current_user)):
    resume = data.get("resume", "")
    job_description = data.get("jobDescription", "")

    prompt = f"""
    Analyze this resume against the job description and provide:
    
    1. Match percentage (0-100%)
    2. Missing keywords from JD
    3. Suggestions to improve resume
    4. What to add
    5. What to remove
    
    Resume:
    {resume}
    
    Job Description:
    {job_description}
    
    Give a structured, actionable response.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"analysis": response.choices[0].message.content}

@router.post("/extract-resume")
async def extract_resume(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    content = await file.read()
    
    # PDF handle karo
    if file.filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return {"text": text}
    
    else:
        return {"error": "Only PDF supported!"}    
    
@router.post("/rewrite-resume")
def rewrite_resume(data: dict, current_user: dict = Depends(get_current_user)):
    resume = data.get("resume", "")
    job_description = data.get("jobDescription", "")

    prompt = f"""
    Rewrite and improve this resume to better match the job description.
    Keep all real information — just improve wording, add missing keywords,
    and make it more ATS friendly.
    
    Resume:
    {resume}
    
    Job Description:
    {job_description}
    
    Return only the improved resume text.
    """

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"improved_resume": response.choices[0].message.content}    