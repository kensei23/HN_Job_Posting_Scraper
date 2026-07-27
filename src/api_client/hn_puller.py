import requests
from bs4 import BeautifulSoup

headers = {'User-Agent': 'Mozilla/5.0'}

def get_hiring_threads():
    url = "https://hn.algolia.com/api/v1/search_by_date?tags=story,author_whoishiring&query=Ask%20HN:%20Who%20is%20hiring"
    try:
        res = requests.get(url, headers=headers)
        if res.status_code == 200:
            hits = res.json().get('hits', [])
            threads = []
            for hit in hits:
                title = hit.get('title', '')
                if "Who is hiring?" in title and "Who wants to be hired?" not in title:
                    threads.append({
                        "id": hit.get('objectID'),
                        "title": title,
                        "created_at": hit.get('created_at')
                    })
            return threads
    except Exception as e:
        print(f"Error fetching HN threads: {e}")
    return []

def extract_job_posting_info(thread_id_or_url):
    thread_id = thread_id_or_url.split('/')[-1].replace('.json', '') if 'http' in str(thread_id_or_url) else thread_id_or_url
    URL = f"https://hacker-news.firebaseio.com/v0/item/{thread_id}.json"

    response = requests.get(URL, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch data from {URL}. Status code: {response.status_code}")
        return None

    job_posting_data = response.json()
    all_listings = job_posting_data.get('kids')

    extracted_listings = []

    for listing in all_listings[:10]:  # Limit to first 3 listings for demonstration
        response = requests.get(f'https://hacker-news.firebaseio.com/v0/item/{listing}.json', headers=headers)
        comment_data = response.json()
        comment_text = comment_data.get('text')
        if comment_text:
            soup = BeautifulSoup(comment_text, 'html.parser')
            clean_listing = soup.get_text(separator=' ')
            extracted_listings.append(clean_listing)

    return extracted_listings