import pandas as pd
import os

class Movie(): #creating a movie class
    def __init__(self, title, release_year, genres, vote_average, spoken_languages, production_countries):

        self.title = title
        self.imageUrl = f"/api/poster/{title}"
        self.genres = self.parse_genres(genres)
        self.rating = vote_average
        self.release_year = release_year
        self.language = self.parse_languages(spoken_languages)
        self.country = self.parse_countries(production_countries)

        #self.popularity = popularity
        #self.spoken_languages = spoken_languages
        #self.production_companies = production_companies
    def display(self):
        print(f"{self.title}, released in {self.release_year}, Genre: {self.genres}, Rating: {self.rating}")

    def _to_dict(self):
        return {
            'title': self.title,
            'imageUrl': self.imageUrl,
            'release_year': self.release_year,
            'genres': self.genres,
            'rating': self.rating,
            'language': self.language,
            'country': self.country
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
            movie = Movie( title=row.get('title', 'Unknown Title'),
                        release_date=row.get('release_date', 'Unknown Release Date'),
                        genres=row.get('genres', "[]"),
                        vote_average=row.get('vote_average', 0.0),
                        spoken_languages=row.get('spoken_languages', "[]"),
                        production_countries=row.get('production_countries', "[]"))
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

        return [movie._to_dict() for movie in self.movie_data if title.lower() in movie.title.lower()]

    def recommend_by_genre(self, *genre):
        # print(f"\nMovies with all genres: {', '.join(genre)}")
        movies = []
        for movie in self.movie_data:
        # Check if the movie contains all the genres specified by the user
            if all(g in movie.genres for g in genre):
                movies.append(movie)

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
    
    def sort_by_rating(self, movies, descending: bool = True):
        """
        Sorts the provided list of movies by rating.
        If no list is provided, sorts all movies.
        """
        if movies is None:
            return "No movies found"
        
        movies = [movie for movie in movies if type(movie.rating) == float()]
        # print([movie.rating for movie in movies])

        # return
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
    
    def get_all_year(self):
        year = set()
        for movie in self.movie_data:
            year.update(set(movie.release_year))
        return list(year)
