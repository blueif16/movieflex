from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Mock data - replace with your database
MOVIES = [
    {"id": "1", "title": "The Adventure Begins", "imageUrl": "https://picsum.photos/seed/movie1/400/600", "genre": "Adventure"},
    # ... more movies
]

GENRES = ["Action", "Adventure", "Comedy", "Drama", "Horror", "Sci-Fi"]

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

if __name__ == '__main__':
    app.run(debug=True) 