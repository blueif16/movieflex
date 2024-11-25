export interface Movie {
  id: string
  title: string
  imageUrl: string
  genre: string
}

export interface SearchResponse {
  results: Movie[]
  total: number
}

export interface GenreResponse {
  genres: string[]
}

export interface SearchParams {
  query: string
  genre?: string
  page?: number
} 