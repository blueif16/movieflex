import { SearchParams, SearchResponse, GenreResponse, LanguageResponse, CountryResponse } from '../types'

const getApiBaseUrl = () => {
  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    // Try environment variable first
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL
    }
    // Fallback to localhost
    return 'http://localhost:5000/api'
  }
  // Production URL (you can change this later)
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()

async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    console.log(`Fetching from: ${url}`) // Debug log
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data as T
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error)
    throw error
  }
}

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