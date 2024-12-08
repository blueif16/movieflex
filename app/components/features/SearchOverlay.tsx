'use client'

import { Search, X, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { searchMovies, getGenres, getLanguages, getCountries } from '@/app/lib/api'
import { Movie } from '@/app/types'
import MovieThumbnail from './MovieThumbnail'
import Image from 'next/image'
import MovieDetailModal from './MovieDetailModal'

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [genres, setGenres] = useState<string[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [results, setResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  useEffect(() => {
    const loadFilters = async () => {
      if (!isOpen) return

      setError(null)
      try {
        const [genresRes, languagesRes, countriesRes] = await Promise.all([
          getGenres(),
          getLanguages(),
          getCountries()
        ])

        // Sort arrays alphabetically
        const sortedGenres = [...genresRes.genres].sort((a, b) => 
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
        const sortedLanguages = [...languagesRes.languages].sort((a, b) => 
          a.toLowerCase().localeCompare(b.toLowerCase())
        )
        const sortedCountries = [...countriesRes.countries].sort((a, b) => 
          a.toLowerCase().localeCompare(b.toLowerCase())
        )

        setGenres(sortedGenres)
        setLanguages(sortedLanguages)
        setCountries(sortedCountries)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load filters'
        setError(errorMessage)
        console.error('Failed to load filters:', err)
      }
    }

    loadFilters()
  }, [isOpen])

  const handleSearch = async () => {
    if (!query && selectedGenres.length === 0 && !selectedLanguage && !selectedCountry) return

    setIsLoading(true)
    setError(null)
    try {
      const response = await searchMovies({
        query,
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        language: selectedLanguage || undefined,
        country: selectedCountry || undefined
      })
      setResults(response.results)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed'
      setError(errorMessage)
      console.error('Search failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Search Movies</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Input and Button */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search movies..."
                className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Search
            </button>
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Language Dropdown */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Any Language</option>
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Dropdown */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Any Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Genre Tags */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedGenres.includes(genre)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Results Section */}
          {isLoading ? (
            <div className="text-center text-white py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white/20 mx-auto"></div>
              <p className="mt-4 text-white/70">Searching...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              {results.map((movie) => (
                <div 
                  key={movie.title}
                  onClick={() => {
                    setSelectedMovie(movie)
                    setIsDetailModalOpen(true)
                  }}
                  className="group relative flex items-center gap-6 bg-white/5 backdrop-blur-sm 
                    p-6 rounded-2xl border border-white/10 hover:bg-white/10 
                    transition-all duration-300 cursor-pointer"
                >
                  {/* Movie Poster */}
                  <div className="relative h-24 w-20 md:h-32 md:w-24 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={movie.imageUrl}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 80px, 96px"
                    />
                  </div>

                  {/* Movie Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-x-4">
                      <h3 className="text-lg md:text-xl font-semibold text-white/90 truncate">
                        {movie.title}
                      </h3>
                      <span className="text-white/60 text-sm whitespace-nowrap">
                        {movie.release_year}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-white/10 px-2.5 py-1 rounded-full">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 ml-1.5 font-medium">
                          {movie.rating.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-white/40">•</span>
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.slice(0, 3).map(genre => (
                          <span 
                            key={genre} 
                            className="bg-white/5 text-white/70 px-3 py-1 rounded-full text-sm"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 text-sm text-white/50">
                      <span>{movie.language[0]}</span>
                      <span>•</span>
                      <span>{movie.country[0]}</span>
                    </div>
                  </div>

                  {/* Hover Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                    rounded-2xl pointer-events-none" 
                  />
                </div>
              ))}
            </div>
          ) : query || selectedGenres.length > 0 || selectedLanguage || selectedCountry ? (
            <div className="text-center text-white/60 py-12 bg-white/5 rounded-2xl backdrop-blur-sm">
              <p className="text-lg">No movies found matching your search criteria</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false)
            setSelectedMovie(null)
          }}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="text-red-500 text-center py-4">
          {error}
        </div>
      )}
    </div>
  )
} 