from src.api_client.hn_puller import extract_job_posting_info, get_hiring_threads
from src.parser.llm_extractor import structuring_job_posting_info
import time
import os

def main(thread_id=None):
    # Define the storage folder and file name for storing job listings
    storage_folder = "data"
    file_name = "job_listings.jsonl"
    full_path = os.path.join(storage_folder, file_name)
    
    if not thread_id:
        print("Fetching latest 'Who is Hiring' thread")
        threads = get_hiring_threads()
        if threads:
            thread_id = threads[0]['id']
            print(f"Selected latest thread: {threads[0]['title']} (ID: {thread_id})")
        else:
            thread_id = "48357725"

    print(f"Extracting job postings for thread ID: {thread_id}")
    extracted_listings = extract_job_posting_info(thread_id)

    if not extracted_listings:
        print("No job postings found.")
        return
    
    for listing in extracted_listings:
        try:
            structured_info = structuring_job_posting_info(listing)

            # Check if structured_info is None or if any required fields are missing
            if structured_info.company_name is None or structured_info.role is None:
                print("Failed to extract structured information from the job posting.")
                continue               

            # Ensure 'storage' folder exists
            if not os.path.exists(storage_folder):
                os.makedirs(storage_folder)

            # Append the structured information to the JSONL file
            with open(full_path, 'a', encoding='utf-8') as f:
                f.write(structured_info.model_dump_json() + '\n')

            # Print the structured information to the console
            printing_structured_info(structured_info)

            time.sleep(12)

        except Exception as e:
            # Handle resource exhaustion or other exceptions
            print("Resource exhausted error occurred. Retrying after a short delay...")
            print(f"Error details: {e}")

            time.sleep(60)  # Wait for 60 seconds before retrying

            structured_info = structuring_job_posting_info(listing)
            printing_structured_info(structured_info)
        
# Function for printing structured information to the console
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

    if structured_info.contact_info:
                url = structured_info.contact_info.apply_url
                contact = structured_info.contact_info.apply_contact
                if url and url != "None":
                    print(f"  Apply URL: {url}")
                if contact and contact != "None":
                    print(f"  Contact Info: {contact}")
                
    print("--" * 50)

if __name__ == "__main__":
    main()