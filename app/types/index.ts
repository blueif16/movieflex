export interface Movie {
  id: string
  title: string
  imageUrl: string
  release_year: string
  genres: string[]
  rating: number
  language: string[]
  country: string[]
  overview: string
}

export interface SearchParams {
  query: string
  genres?: string[]
  language?: string
  country?: string
  page?: number
}

export interface SearchResponse {
  results: Movie[]
  total: number
}

export interface GenreResponse {
  genres: string[]
}

export interface LanguageResponse {
  languages: string[]
}

export interface CountryResponse {
  countries: string[]
}

export interface MoviesResponse {
  movies: Movie[]
} 