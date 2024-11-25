export interface Movie {
  id: string
  title: string
  imageUrl: string
  genre: string
  rating: number
}

export interface SearchResponse {
  results: Movie[]
  total: number
}

export interface GenreResponse {
  genres: string[]
}

export interface MoviesResponse {
  movies: Movie[]
}

export interface SearchParams {
  query: string
  genre?: string
  page?: number
} 