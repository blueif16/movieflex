import { SearchParams, SearchResponse, GenreResponse } from '../types'

const API_BASE_URL = 'http://localhost:5000/api'

export async function searchMovies(params: SearchParams): Promise<SearchResponse> {
  const queryParams = new URLSearchParams({
    query: params.query,
    ...(params.genre && { genre: params.genre }),
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