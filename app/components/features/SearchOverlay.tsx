'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { searchMovies, getGenres } from '@/app/lib/api'
import { Movie } from '@/app/types'
import MovieThumbnail from './MovieThumbnail'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [results, setResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const response = await getGenres()
        setGenres(response.genres)
      } catch (error) {
        console.error('Failed to load genres:', error)
      }
    }
    loadGenres()
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query) {
        setIsLoading(true)
        try {
          const response = await searchMovies({
            query,
            genre: selectedGenre || undefined
          })
          setResults(response.results)
        } catch (error) {
          console.error('Search failed:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }, 500) // Debounce search

    return () => clearTimeout(searchTimeout)
  }, [query, selectedGenre])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <div className="text-center text-white">Loading...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {results.map((movie) => (
                <MovieThumbnail key={movie.id} {...movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 