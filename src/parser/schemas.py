from pydantic import BaseModel, Field
from typing import List, Optional
import enum

class RequirementType(str, enum.Enum):
    REQUIRED = "required"
    PREFERRED = "preferred"

class RemoteStatus(str, enum.Enum):
    REMOTE = "remote"
    ONSITE = "onsite"
    HYBRID = "hybrid"

class TechRequirement(BaseModel):
    skill_name: str
    requirement_type: RequirementType

class locationDetails(BaseModel):
    city: Optional[str] = "None"
    state: Optional[str] = "None"
    country: Optional[str] = "None"
    is_remote: RemoteStatus

class JobPosting(BaseModel):
    company_name: str = Field(description="Name of the company hiring")
    role: List[str] = Field(description="Job role or title")
    summary: Optional[str] = Field(description="Brief summary of the job posting")
    location: locationDetails = Field(description="Location details of the job")
    salary_range: Optional[str] = Field(description="Salary range for the position, if available")
    tech_stack: List[TechRequirement] = Field(description="List of technologies/programming languages required for the job and state if they are preferred or required")