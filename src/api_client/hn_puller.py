import requests
from bs4 import BeautifulSoup

headers = {'User-Agent': 'Mozilla/5.0'}

def extract_job_posting_info(URL):
    response = requests.get(URL, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch data from {URL}. Status code: {response.status_code}")
        return None

    job_posting_data = response.json()
    all_listings = job_posting_data.get('kids')

    extracted_listings = []
    for listing in all_listings[:3]:  # Limit to first 5 listings for demonstration
        response = requests.get(f'https://hacker-news.firebaseio.com/v0/item/{listing}.json', headers=headers)
        comment_data = response.json()
        comment_text = comment_data.get('text')
        if comment_text:
            soup = BeautifulSoup(comment_text, 'html.parser')
            clean_listing = soup.get_text(separator=' ')
            extracted_listings.append(clean_listing)

    return extracted_listings