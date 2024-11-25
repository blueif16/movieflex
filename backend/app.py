from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import List, Dict
import operator

app = Flask(__name__)
CORS(app)

# Enhanced mock data with ratings
MOVIES = [
    {"id": "1", "title": "The Adventure Begins", "imageUrl": "https://picsum.photos/seed/movie1/400/600", "genre": "Adventure", "rating": 4.8},
    {"id": "2", "title": "City Lights", "imageUrl": "https://picsum.photos/seed/movie2/400/600", "genre": "Drama", "rating": 4.9},
    {"id": "3", "title": "Space Warriors", "imageUrl": "https://picsum.photos/seed/movie3/400/600", "genre": "Sci-Fi", "rating": 4.5},
    {"id": "4", "title": "Lost in Time", "imageUrl": "https://picsum.photos/seed/movie4/400/600", "genre": "Sci-Fi", "rating": 4.7},
    {"id": "5", "title": "The Last Stand", "imageUrl": "https://picsum.photos/seed/movie5/400/600", "genre": "Action", "rating": 4.6},
    {"id": "6", "title": "Midnight Mystery", "imageUrl": "https://picsum.photos/seed/movie6/400/600", "genre": "Horror", "rating": 4.3},
    {"id": "7", "title": "Comedy Club", "imageUrl": "https://picsum.photos/seed/movie7/400/600", "genre": "Comedy", "rating": 4.4},
    {"id": "8", "title": "Epic Journey", "imageUrl": "https://picsum.photos/seed/movie8/400/600", "genre": "Adventure", "rating": 4.9},
    {"id": "9", "title": "Future World", "imageUrl": "https://picsum.photos/seed/movie9/400/600", "genre": "Sci-Fi", "rating": 4.8},
    {"id": "10", "title": "Laugh Out Loud", "imageUrl": "https://picsum.photos/seed/movie10/400/600", "genre": "Comedy", "rating": 4.2},
]

GENRES = ["Action", "Adventure", "Comedy", "Drama", "Horror", "Sci-Fi"]

def get_sorted_movies(movies: List[Dict], by_rating: bool = True) -> List[Dict]:
    return sorted(movies, key=operator.itemgetter('rating'), reverse=True)

@app.route('/api/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '').lower()
    genre = request.args.get('genre')
    page = int(request.args.get('page', 1))
    
    # Filter movies based on search query and genre
    results = [
        movie for movie in MOVIES
        if query in movie['title'].lower()
        and (not genre or movie['genre'] == genre)
    ]
    
    # Sort by rating
    results = get_sorted_movies(results)
    
    # Implement pagination
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

@app.route('/api/movies/top-rated', methods=['GET'])
def get_top_rated():
    sorted_movies = get_sorted_movies(MOVIES)
    return jsonify({'movies': sorted_movies})

@app.route('/api/movies/by-genre/<genre>', methods=['GET'])
def get_movies_by_genre(genre):
    genre_movies = [movie for movie in MOVIES if movie['genre'] == genre]
    sorted_movies = get_sorted_movies(genre_movies)
    return jsonify({'movies': sorted_movies})

if __name__ == '__main__':
    app.run(debug=True) 