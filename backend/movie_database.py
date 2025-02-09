import pandas as pd
import os
from rapidfuzz import fuzz
from rapidfuzz import process

class Movie(): #creating a movie class
    def __init__(self, id, title, release_year, genres, vote_average, spoken_languages, production_countries, overview, popularity):
        
        self.id = id
        self.title = title
        self.imageUrl = f"/api/poster/{title}"
        self.genres = self.parse_genres(genres)
        self.rating = vote_average
        self.release_year = release_year
        self.language = self.parse_languages(spoken_languages)
        self.country = self.parse_countries(production_countries)
        self.overview = overview
        self.popularity = popularity

        #self.popularity = popularity
        #self.spoken_languages = spoken_languages
        #self.production_companies = production_companies
    def display(self):
        print(f"{self.title}, released in {self.release_year}, Genre: {self.genres}, Rating: {self.vote_average}")

    def _to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'imageUrl': self.imageUrl,
            'release_year': self.release_year,
            'genres': self.genres,
            'rating': self.rating,
            'language': self.language,
            'country': self.country,
            'overview': self.overview,
            'popularity': self.popularity
        }


    def parse_genres(self, genres):
    
        return genres[2:-2].split("', '")

    def parse_languages(self, languages):

        return languages[2:-2].split("', '")

    def parse_countries(self, countries):
        return countries[2:-2].split("', '")


class MovieDatabase():
    def __init__(self, path):
        if not os.path.exists(path):
            raise FileNotFoundError(f"Database file not found: {path}")
            
        try:
            df = pd.read_csv(path)
            self.movie_data = self.get_movie_data(df)
        except Exception as e:
            raise Exception(f"Error loading database: {str(e)}")

    def __len__(self):
        return len(self.movie_data)

    def get_movie_data(self, df):
        movie_data = []
        for index, row in df.iterrows():
            movie = Movie(
                id=row.get('id', 'Unknown ID'),
                title=row.get('title', 'Unknown Title'),
                release_year=row.get('release_year', 'Unknown Release Date'),
                genres=row.get('genres', "[]"),
                vote_average=row.get('vote_average', 0.0),
                spoken_languages=row.get('spoken_languages', "[]"),
                production_countries=row.get('production_countries', "[]"),
                overview=row.get('overview', ''),
                popularity=round(row.get('popularity', 0.0), 2)
            )
            movie_data.append(movie)
        return movie_data
    
    def get_list(self):
        return [movie._to_dict() for movie in self.movie_data]

    def recommend_by_rating(self, min_rating):
        # print(f"\nMovie with ratings above {min_rating}: ")
        movies = []
        for movie in self.movie_data:
            if movie.rating >= min_rating:
                movies.append(movie)
        
        return self.sort_by_rating(movies)

    def search_by_title(self, title):
        matches = []
        for movie in self.movie_data:
            similarity_score = fuzz.partial_ratio(title.lower(), movie.title.lower())
            if similarity_score >= 90:  # Threshold for similarity (e.g., 70%)
                matches.append((movie._to_dict(), similarity_score))
        
        # Sort matches by similarity score
        matches = sorted(matches, key=lambda x: x[1], reverse=True)
        return [row[0] for row in matches]

    def recommend_by_genre(self, *genres):
        """
        Returns movies that contain all specified genres.
        Returns the movies as dictionaries.
        """
        if not genres:
            return self.get_list()  # Return all movies if no genres specified
        
        movies = []
        for movie in self.movie_data:
            # Check if the movie contains all the genres specified by the user
            if all(g in movie.genres for g in genres):
                movies.append(movie)

        # Return the sorted movies as dictionaries
        return self.sort_by_rating(movies)
    
    def recommend_by_language(self, language):
        movies = []
        for movie in self.movie_data:
            if language in movie.language:
                movies.append(movie)
        return self.sort_by_rating(movies)

    def recommend_by_country(self, country):
        movies = []
        for movie in self.movie_data:
            if country in movie.country:
                movies.append(movie)
        return self.sort_by_rating(movies)
    
    def recommend_by_year(self, year):
        movies = []
        for movie in self.movie_data:
            if year in movie.year:
                movies.append(movie)
        return self.sort_by_rating(movies)
    
    def get_all_year(self):
        year = set()
        for movie in self.movie_data:
            year.update(set(movie.release_year))
        return list(year)
    
    
    
    def sort_by_rating(self, movies: list[Movie], descending: bool = True) -> list[dict]:
        """
        Sorts the provided list of movies by rating.
        If no list is provided, sorts all movies.
        """
        if movies is None:
            return "No movies found"
        sorted_movies = sorted(movies, key= lambda x: x.rating, reverse=descending)

        return [movie._to_dict() for movie in sorted_movies]
    

    def get_all_genres(self):
        genres = set()
        for movie in self.movie_data:
            genres.update(set(movie.genres))
        return list(genres)

    def get_all_languages(self):
        languages = set()
        for movie in self.movie_data:
            languages.update(set(movie.language))
        return list(languages)

    def get_all_countries(self):
        countries = set()
        for movie in self.movie_data:
            countries.update(set(movie.country))
        return list(countries)
