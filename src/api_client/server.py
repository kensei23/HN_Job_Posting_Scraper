from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.storage.data_service import *
from src.api_client.hn_puller import get_hiring_threads
from dotenv import load_dotenv
import os

load_dotenv()
data_path = os.environ.get("DATA_PATH")

app = FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*'],
)

@app.get('/threads')
def get_threads():
    return get_hiring_threads()

@app.get('/jobs')
def get_all_jobs(thread_id: str = None, skill: str = None, min_salary: int = None, location: str = None, is_remote: str = None):
    try:
        jobs = read_jobs_from_jsonl(data_path)
        if thread_id:
            jobs = list(filter_by_thread(jobs, thread_id))
        if skill:
            jobs = list(filter_by_skill(jobs, skill))
        if min_salary:
            jobs = list(filter_by_min_salary(jobs, min_salary))
        if location:
            jobs = list(filter_by_location(jobs, location))
        if is_remote:
            jobs = list(filter_by_remote(jobs, is_remote))
        return jobs
    except Exception as e:
        print(f'Error loading jobs: {e}, ensure that JSON is populated with Job listings')
        return []
