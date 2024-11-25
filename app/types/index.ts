export interface Movie {
  title: string
  imageUrl: string
  release_date: string
  genres: string[]
  rating: number
  language: string[]
  country: string[]
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
  genres?: string[]
  page?: number
} 