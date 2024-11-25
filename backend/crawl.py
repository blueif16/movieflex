import requests
import os
import re

API_KEY = '527f624a0e254fc9a30719aab2aaa08d'
BASE_URL = 'https://api.themoviedb.org/3'
IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

def sanitize_filename(name):
    """Sanitize filename for cross-platform compatibility"""
    # Replace spaces and special characters
    name = re.sub(r'[^\w\-_\. ]', '', name)
    name = name.replace(' ', '_')
    return name

def get_movie_poster(movie_name):
    try:
        # Get the directory of the current script
        current_dir = os.path.dirname(os.path.abspath(__file__))
        poster_dir = os.path.join(current_dir, 'posters')
        
        # Create posters directory if it doesn't exist
        os.makedirs(poster_dir, exist_ok=True)
        
        print(f"Fetching poster for: {movie_name}")  # Debug log
        
        search_url = f"{BASE_URL}/search/movie"
        params = {
            'api_key': API_KEY,
            'query': movie_name,
        }
        
        response = requests.get(search_url, params=params)
        if response.status_code != 200:
            print(f"TMDB API error: {response.status_code}")  # Debug log
            return None

        data = response.json()
        if not data.get('results'):
            print(f"No results found for: {movie_name}")  # Debug log
            return None

        movie = data['results'][0]
        poster_path = movie.get('poster_path')
        
        if not poster_path:
            print(f"No poster available for: {movie_name}")  # Debug log
            return None

        image_url = f"{IMAGE_BASE_URL}{poster_path}"
        image_response = requests.get(image_url)
        
        if image_response.status_code != 200:
            print(f"Failed to download image: {image_response.status_code}")  # Debug log
            return None

        sanitized_name = sanitize_filename(movie_name)
        file_path = os.path.join(poster_dir, f"{sanitized_name}_{movie['id']}.png")
        
        with open(file_path, 'wb') as f:
            f.write(image_response.content)
        
        print(f"Poster saved as: {file_path}")  # Debug log
        return file_path
        
    except Exception as e:
        print(f"Error in get_movie_poster: {str(e)}")  # Debug log
        return None

if __name__ == "__main__":
    movie_name = input("Enter the movie name: ")
    get_movie_poster(movie_name)