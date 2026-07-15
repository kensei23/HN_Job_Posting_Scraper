import json
import os
import google.generativeai as genai
from src.parser.schemas import JobPosting
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))  # Use the API key from the environment variable

def structuring_job_posting_info(unstructured_job_info):
    info_structure = json.dumps(JobPosting.model_json_schema())

    model = genai.GenerativeModel(
        # model_name="gemini-3.5-flash",
        model_name="gemini-2.5-flash",
        generation_config={
            "response_mime_type": "application/json",
        }
    )

    prompt = (f"Extract the job posting information from the following text but be concise: {unstructured_job_info}", 
              "Please extract the information into the following JSON format: " + info_structure)

    response = model.generate_content(prompt)

    # print("RAW RESPONSE:")
    # print(response.text)  # Print the raw response for debugging
    # print("---" * 50)
    return JobPosting.model_validate_json(response.text)

