from src.api_client.hn_puller import extract_job_posting_info
from src.parser.llm_extractor import structuring_job_posting_info
import time

def main():

    URL = "https://hacker-news.firebaseio.com/v0/item/48357725.json"  # Example URL for a Hacker News job posting

    extracted_listings = extract_job_posting_info(URL)

    if not extracted_listings:
        print("No job postings found.")
        return
    
    for listing in extracted_listings:
        try:
            structured_info = structuring_job_posting_info(listing)

            if structured_info.company_name is None or structured_info.role is None:
                print("Failed to extract structured information from the job posting.")
                continue
   
            printing_structured_info(structured_info)

        except Exception as e:
            print("Resource exhausted error occurred. Retrying after a short delay...")
            print(f"Error details: {e}")
            time.sleep(60)  # Wait for 60 seconds before retrying

            structured_info = structuring_job_posting_info(listing)

            printing_structured_info(structured_info)
        

def printing_structured_info(structured_info):
    print(f"Company name: {structured_info.company_name}")
    print(f"Role: {structured_info.role}")
    print(f"Summary: {structured_info.summary}")

    location = structured_info.location
    city_state = f"{location.city or ''}, {location.state or ''}".strip(', ')
    print(f"Country: {location.country or 'Not Specified'} | City/State: {city_state or 'Not Specified'} | Remote: {location.is_remote.value.capitalize()}")
    
    print(f"Salary Range: {structured_info.salary_range or 'Not Specified'}")

    if structured_info.tech_stack:
        print("Tech Stack:")
        for tech in structured_info.tech_stack:
            print(f"  - Skill: {tech.skill_name}, Requirement Type: {tech.requirement_type.value.capitalize()}")
    else: 
        print("Tech Stack: Not Specified")

    print("--" * 50)

if __name__ == "__main__":
    main()