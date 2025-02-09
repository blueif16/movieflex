import { API_CONFIG } from '../config'
import { SearchParams, SearchResponse, GenreResponse, LanguageResponse, CountryResponse, MoviesResponse, Movie } from '../types'

// Use relative paths since we're proxying through Next.js
const API_BASE_URL = '/api'
const CHAT_API_URL = '/llm'

async function fetchWithErrorHandling<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    // Don't try to use window.location in server components
    const response = await fetch(url, {
      ...options,
      // Add these headers for server-side fetching
      headers: {
        ...options?.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data as T
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch from ${url}: ${error.message}`)
    }
    throw new Error(`Failed to fetch from ${url}`)
  }
}

export async function getGenres(): Promise<GenreResponse> {
  try {
    const data = await fetchWithErrorHandling<GenreResponse>(`${API_BASE_URL}/genres`)
    return {
      genres: data.genres.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    }
  } catch (error) {
    console.error('Failed to fetch genres:', error)
    return { genres: [] }
  }
}

export async function getLanguages(): Promise<LanguageResponse> {
  try {
    const data = await fetchWithErrorHandling<LanguageResponse>(`${API_BASE_URL}/languages`)
    return {
      languages: data.languages.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    }
  } catch (error) {
    console.error('Failed to fetch languages:', error)
    return { languages: [] }
  }
}

export async function getCountries(): Promise<CountryResponse> {
  try {
    const data = await fetchWithErrorHandling<CountryResponse>(`${API_BASE_URL}/countries`)
    return {
      countries: data.countries.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    }
  } catch (error) {
    console.error('Failed to fetch countries:', error)
    return { countries: [] }
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

  try {
    return await fetchWithErrorHandling<SearchResponse>(`${API_BASE_URL}/search?${queryParams}`)
  } catch (error) {
    console.error('Search failed:', error)
    return { results: [], total: 0 }
  }
}

export async function getTopRatedMovies(): Promise<MoviesResponse> {
  try {
    console.log('Fetching top rated movies from:', `${API_BASE_URL}/movies/top-rated`)
    const data = await fetchWithErrorHandling<MoviesResponse>(`${API_BASE_URL}/movies/top-rated`)
    console.log('Top rated movies response:', data)
    return data
  } catch (error) {
    console.error('Failed to fetch top rated movies:', error)
    return { movies: [] }
  }
}

export async function getMoviesByGenre(genre: string): Promise<MoviesResponse> {
  try {
    console.log('Fetching movies for genre:', genre)
    const data = await fetchWithErrorHandling<MoviesResponse>(`${API_BASE_URL}/movies/by-genre/${genre}`)
    console.log('Genre movies response:', data)
    return data
  } catch (error) {
    console.error('Failed to fetch genre movies:', error)
    return { movies: [] }
  }
}

export async function initializeMovieChat(movie: Movie) {
  const response = await fetch(`${CHAT_API_URL}/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      movie: {
        ...movie,
        imageUrl: undefined
      }
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to initialize chat')
  }

  return response.json()
}

export async function sendMovieQuestion(movieId: string, question: string) {
  const response = await fetch(`${CHAT_API_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      movieId,
      question,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to send message')
  }

  return response.json()
} 