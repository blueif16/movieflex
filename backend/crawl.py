import requests
import os
import re

API_KEY = '527f624a0e254fc9a30719aab2aaa08d'  # Replace with your TMDb API key
BASE_URL = 'https://api.themoviedb.org/3'
IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'  # You can change the size


def sanitize_filename(name):
    """
    Sanitize the filename by:
    - Replacing spaces with underscores
    - Removing characters that are not alphanumeric, underscores, hyphens, or dots
    """
    # Replace spaces with underscores
    name = name.replace(' ', '_')
    # Remove any character that is not a word character, hyphen, underscore, or dot
    name = re.sub(r'[^\w\-_\.]', '', name)
    return name

def get_movie_poster(movie_name):
    search_url = f"{BASE_URL}/search/movie"
    params = {
        'api_key': API_KEY,
        'query': movie_name,
    }
    response = requests.get(search_url, params=params)
    if response.status_code != 200:
        print(f"Failed to fetch data from TMDb API. Status Code: {response.status_code}")
        return

    data = response.json()

    if data.get('results'):
        movie = data['results'][0]
        poster_path = movie.get('poster_path')
        if poster_path:
            image_url = f"{IMAGE_BASE_URL}{poster_path}"
            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                # Get the directory of the current script
                current_dir = os.path.dirname(os.path.abspath(__file__))
                poster_dir = os.path.join(current_dir, 'posters')
                
                # Create posters directory if it doesn't exist
                os.makedirs(poster_dir, exist_ok=True)
                
                # Use absolute path for saving
                sanitized_name = sanitize_filename(movie_name)
                file_path = os.path.join(poster_dir, f"{sanitized_name}_{movie['id']}.png")
                
                with open(file_path, 'wb') as f:
                    f.write(image_response.content)
                print(f"Poster saved as {file_path}")
            else:
                print("Failed to download image.")
        else:
            print("No poster available for this movie.")
    else:
        print("Movie not found.")


if __name__ == "__main__":
    movie_name = input("Enter the movie name: ")