from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import glob
from crawl import get_movie_poster, sanitize_filename
from movie_database import MovieDatabase

app = Flask(__name__)

# CORS settings
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Get absolute paths using os.path for cross-platform compatibility
current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, "imdb_movies-1.csv")
posters_dir = os.path.join(current_dir, "posters")

# Create posters directory if it doesn't exist
os.makedirs(posters_dir, exist_ok=True)

# Initialize database
db = MovieDatabase(db_path)
MOVIES = db.get_list()
GENRES = db.get_all_genres()

# Add health check endpoint
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'database_loaded': bool(MOVIES),
        'genres_loaded': bool(GENRES)
    })

def find_poster(movie_title: str) -> str:
    """Find poster file path for a given movie title"""
    try:
        sanitized_title = sanitize_filename(movie_title)
        poster_pattern = os.path.join(posters_dir, f"{sanitized_title}_*.png")
        matching_files = glob.glob(poster_pattern)
        
        print(f"Searching for poster: {poster_pattern}")  # Debug log
        print(f"Found files: {matching_files}")  # Debug log
        
        if matching_files:
            return matching_files[0]
        return None
    except Exception as e:
        print(f"Error finding poster: {str(e)}")  # Debug log
        return None

@app.route('/api/poster/<path:movie_title>')
def get_movie_poster_image(movie_title):
    try:
        print(f"Requesting poster for: {movie_title}")  # Debug log
        
        poster_path = find_poster(movie_title)
        if not poster_path:
            print(f"Poster not found, fetching from TMDB...")  # Debug log
            get_movie_poster(movie_title)
            poster_path = find_poster(movie_title)
        
        if not poster_path:
            print(f"Failed to get poster for: {movie_title}")  # Debug log
            return jsonify({'error': 'Poster not found'}), 404
        
        print(f"Serving poster from: {poster_path}")  # Debug log
        return send_file(poster_path, mimetype='image/png')
    except Exception as e:
        print(f"Error serving poster: {str(e)}")  # Debug log
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '').lower()
    genres = request.args.getlist('genres')
    language = request.args.get('language')
    country = request.args.get('country')
    page = int(request.args.get('page', 1))
    
    # Start with title search or all movies
    results = db.search_by_title(query) if query else MOVIES

    # Apply filters
    if genres:
        genre_results = db.recommend_by_genre(*genres)
        genre_titles = {movie['title'] for movie in genre_results}
        results = [movie for movie in results if movie['title'] in genre_titles]

    if language:
        language_results = db.recommend_by_language(language)
        language_titles = {movie['title'] for movie in language_results}
        results = [movie for movie in results if movie['title'] in language_titles]

    if country:
        country_results = db.recommend_by_country(country)
        country_titles = {movie['title'] for movie in country_results}
        results = [movie for movie in results if movie['title'] in country_titles]

    # Sort final results by rating
    results = sorted(results, key=lambda x: x['rating'], reverse=True)
    
    # Pagination
    per_page = 20
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    
    return jsonify({
        'results': results[start_idx:end_idx],
        'total': len(results)
    })

@app.route('/api/genres', methods=['GET'])
def get_genres():
    return jsonify({'genres': GENRES})

@app.route('/api/languages', methods=['GET'])
def get_languages():
    return jsonify({'languages': db.get_all_languages()})

@app.route('/api/countries', methods=['GET'])
def get_countries():
    return jsonify({'countries': db.get_all_countries()})

@app.route('/api/movies/top-rated', methods=['GET'])
def get_top_rated():
    sorted_movies = db.sort_by_rating(MOVIES)
    return jsonify({'movies': sorted_movies})

@app.route('/api/movies/by-genre/<genre>', methods=['GET'])
def get_movies_by_genre(genre):
    movies = db.recommend_by_genre(genre)
    return jsonify({'movies': movies})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == '__main__':
    print(f"Database path: {db_path}")  # Debug log
    print(f"Posters directory: {posters_dir}")  # Debug log
    app.run(host='0.0.0.0', port=3500, debug=True) 