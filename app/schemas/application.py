from pydantic import BaseModel
from enum import Enum
from typing import Optional

class StatusEnum(str, Enum):
    applied = "Applied"
    interview = "Interview"
    offered = "Offered"
    rejected = "Rejected"
    
class ApplicationCreate(BaseModel):
    companyName: str
    jobRole: str
    apply_date: str
    salary: int
    status: StatusEnum = StatusEnum.applied  
    notes: Optional[str] = None
    jobDescription: Optional[str] = None
    jobUrl: str
    
    
    