from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import glob
from crawl import get_movie_poster, sanitize_filename
from movie_database import MovieDatabase

app = Flask(__name__)
CORS(app)

db = MovieDatabase("imdb_movies-1.csv")
MOVIES = db.get_list()
GENRES = db.get_all_genres()

def find_poster(movie_title: str) -> str:
    """Find poster file path for a given movie title"""
    sanitized_title = sanitize_filename(movie_title)
    poster_pattern = os.path.join('posters', f"{sanitized_title}_*.png")
    matching_files = glob.glob(poster_pattern)
    
    if matching_files:
        return matching_files[0]
    return None

@app.route('/api/poster/<path:movie_title>')
def get_movie_poster_image(movie_title):
    # Try to find existing poster
    poster_path = find_poster(movie_title)
    
    # If poster doesn't exist, fetch it
    if not poster_path:
        get_movie_poster(movie_title)
        poster_path = find_poster(movie_title)
    
    # If we still don't have a poster, return a default image or 404
    if not poster_path:
        return jsonify({'error': 'Poster not found'}), 404
    
    return send_file(poster_path, mimetype='image/png')

@app.route('/api/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '').lower()
    genres = request.args.getlist('genres')  # Changed to getlist for multiple genres
    page = int(request.args.get('page', 1))
    
    # Combine search results
    results = []
    if query:
        results.extend(db.search_by_title(query))
    if genres:
        results.extend(db.recommend_by_genre(*genres))
    
    # Remove duplicates while preserving order
    seen = set()
    unique_results = []
    for movie in results:
        if movie['title'] not in seen:
            seen.add(movie['title'])
            unique_results.append(movie)
    
    # Implement pagination
    per_page = 20
    start_idx = (page - 1) * per_page
    end_idx = start_idx + per_page
    
    return jsonify({
        'results': unique_results[start_idx:end_idx],
        'total': len(unique_results)
    })

@app.route('/api/genres', methods=['GET'])
def get_genres():
    return jsonify({'genres': GENRES})

@app.route('/api/movies/top-rated', methods=['GET'])
def get_top_rated():
    sorted_movies = db.sort_by_rating(MOVIES)
    return jsonify({'movies': sorted_movies})

@app.route('/api/movies/by-genre/<genre>', methods=['GET'])
def get_movies_by_genre(genre):
    movies = db.recommend_by_genre(genre)
    return jsonify({'movies': movies})

if __name__ == '__main__':
    app.run(debug=True) 