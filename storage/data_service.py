import json
from src.parser.schemas import JobPosting
import os
import re

# Function to read the JSON Job listings from the JSONL file and turn them into objects
def read_jobs_from_jsonl(file_path):
    results = []

    # Check if the file exists before attempting to read
    if not os.path.exists(file_path):
        return results
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line: continue
            try:
                job = JobPosting.model_validate_json(line)
                results.append(job)
            except Exception as e:
                print(f"Error parsing line: {line}. Error: {e}")
    
    return results

# Returns all jobs that contain the searched skill
def filter_by_skill(jobs, skill_name):
    for job in jobs:

        if not job.tech_stack:
            print(f"{job.company_name}' has no tech stack information.")
            continue

        for tech in job.tech_stack:
            if tech.skill_name.lower() == skill_name.lower():
                yield job
                break  # No need to check further tech requirements for this job

# Returns all jobs that match the user's remote preference
def filter_by_remote(jobs, is_remote):
    for job in jobs:
        if job.location and job.location.is_remote:
            if job.location.is_remote.value == is_remote:
                yield job
                
# Returns all jobs that match, or go beyond the user's minimum salary requirement
def filter_by_min_salary(jobs, salary):
    for job in jobs:
        if not job.salary_range:
            continue

        # Using re package to turn Strings into numbers
        try:
            numbers = re.findall(r'\d+', job.salary_range.replace(',', ''))
        
            if numbers:
                low_end = int(numbers[0])

                # If the AI wrote 20000 as 20k, fixes that issue
                if 'k' in job.salary_range.lower() and low_end < 1000:
                    low_end *= 1000

                if low_end >= salary:
                    yield job

        except Exception as e:
            print(f"Could not parse salary for {job.company_name}")
            continue