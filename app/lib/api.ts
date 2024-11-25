import { SearchParams, SearchResponse, GenreResponse, LanguageResponse, CountryResponse } from '../types'

const API_BASE_URL = 'http://localhost:5000/api'

export async function searchMovies(params: SearchParams): Promise<SearchResponse> {
  const queryParams = new URLSearchParams({
    query: params.query,
    ...(params.genres && { genres: params.genres.join(',') }),
    ...(params.language && { language: params.language }),
    ...(params.country && { country: params.country }),
    ...(params.page && { page: params.page.toString() })
  })

  const response = await fetch(`${API_BASE_URL}/search?${queryParams}`)
  if (!response.ok) {
    throw new Error('Failed to fetch movies')
  }
  return response.json()
}

export async function getGenres(): Promise<GenreResponse> {
  const response = await fetch(`${API_BASE_URL}/genres`)
  if (!response.ok) {
    throw new Error('Failed to fetch genres')
  }
  return response.json()
}

export async function getLanguages(): Promise<LanguageResponse> {
  const response = await fetch(`${API_BASE_URL}/languages`)
  if (!response.ok) {
    throw new Error('Failed to fetch languages')
  }
  return response.json()
}

export async function getCountries(): Promise<CountryResponse> {
  const response = await fetch(`${API_BASE_URL}/countries`)
  if (!response.ok) {
    throw new Error('Failed to fetch countries')
  }
  return response.json()
}

export async function getTopRatedMovies(): Promise<{ movies: Movie[] }> {
  const response = await fetch(`${API_BASE_URL}/movies/top-rated`)
  if (!response.ok) {
    throw new Error('Failed to fetch top rated movies')
  }
  return response.json()
}

export async function getMoviesByGenre(genre: string): Promise<{ movies: Movie[] }> {
  const response = await fetch(`${API_BASE_URL}/movies/by-genre/${genre}`)
  if (!response.ok) {
    throw new Error('Failed to fetch genre movies')
  }
  return response.json()
} 