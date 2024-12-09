'use client'

import { X, Star, Send } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Movie } from '@/app/types'
import { cn } from '@/lib/utils'
import { sendMovieQuestion, initializeMovieChat } from '@/app/lib/api'

interface MovieDetailModalProps {
  movie: Movie
  isOpen: boolean
  onClose: () => void
}

const DEMO_QUESTIONS = [
  "What are the common opinions on this movie?",
  "How to rate the performance of the actors?",
  "Is this movie worth watching?"
] as const

export default function MovieDetailModal({ movie, isOpen, onClose }: MovieDetailModalProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatInitialized, setIsChatInitialized] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [query, setQuery] = useState('')
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    try {
      setIsLoading(true)
      setError(null)
      
      // Add user message immediately
      setChatMessages(prev => [...prev, { role: 'user', content: query }])
      
      // Send to API and get response
      const response = await sendMovieQuestion(movie.id, query)
      
      // Add assistant response
      setChatMessages(prev => [...prev, response])
      
      // Clear input
      setQuery('')
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoQuestion = async (question: string) => {
    if (isLoading) return

    try {
      setIsLoading(true)
      setError(null)
      
      // Add user message immediately
      setChatMessages(prev => [...prev, { role: 'user', content: question }])
      
      // Send to API and get response
      const response = await sendMovieQuestion(movie.id, query)
      
      // Add assistant response
      setChatMessages(prev => [...prev, response])
      
      // Clear input
      setQuery('')
    } catch (err) {
      setError('Failed to get response. Please try again.')
      console.error('Chat error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize chat when rating button is clicked
  const handleChatToggle = async () => {
    if (!isChatOpen && !isChatInitialized) {
      try {
        setIsInitializing(true)
        setError(null)
        await initializeMovieChat({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          rating: movie.rating,
          genres: movie.genres,
          release_year: movie.release_year,
          language: movie.language,
          country: movie.country
        })
        setIsChatInitialized(true)
      } catch (err) {
        setError('Failed to initialize chat. Please try again.')
        console.error('Chat initialization error:', err)
        return
      } finally {
        setIsInitializing(false)
      }
    }
    setIsChatOpen(prev => !prev)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="flex">
          {/* Movie Details Section */}
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            isChatOpen ? "w-1/2" : "w-full"
          )}>
            <div className="max-w-5xl mx-auto rounded-lg overflow-hidden">
              {/* Existing content... */}
              <div className="relative h-[500px] md:h-[700px] w-full">
                <Image
                  src={movie.imageUrl}
                  alt={movie.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </div>

              <div className="p-8 md:p-12 max-w-4xl mx-auto">
                {/* Title and Rating Button Row */}
                <div className="flex items-start justify-between mb-6">
                  <h1 className="text-4xl md:text-5xl font-bold text-white font-sans tracking-tight">
                    {movie.title}
                  </h1>
                  <button 
                    onClick={handleChatToggle}
                    disabled={isInitializing}
                    className="flex items-center px-4 py-2 rounded hover:bg-gray-800/50 transition-colors
                      disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 ml-2 font-semibold text-2xl">
                      {movie.rating.toFixed(1)}
                    </span>
                    {isInitializing && (
                      <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400" />
                    )}
                  </button>
                </div>

                {/* Meta Row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 text-base">
                  <span className="text-gray-300 font-medium">{movie.release_year}</span>
                  <span className="text-gray-400">•</span>
                  <div className="flex flex-wrap gap-3">
                    {movie.genres.map(genre => (
                      <span key={genre} className="text-gray-300 font-medium">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Overview Section */}
                <div className="mb-12">
                  <h3 className="text-white font-semibold mb-4 text-2xl">Overview</h3>
                  <p className="text-gray-300 leading-relaxed text-lg font-light">
                    {movie.overview || 'No overview available.'}
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-xl">Languages</h3>
                    <div className="flex flex-wrap gap-3">
                      {movie.language.map(lang => (
                        <span key={lang} className="text-gray-300 text-base font-light">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-xl">Countries</h3>
                    <div className="flex flex-wrap gap-3">
                      {movie.country.map(country => (
                        <span key={country} className="text-gray-300 text-base font-light">
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          {isChatOpen && (
            <div className="w-1/2 pl-8">
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl h-full p-6 border border-white/10">
                <div className="flex flex-col h-[calc(100vh-8rem)]">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto mb-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent pr-4">
                    {chatMessages.map((message, index) => (
                      <div 
                        key={index}
                        className={cn(
                          "p-5 rounded-2xl max-w-[80%] backdrop-blur-sm",
                          message.role === 'user' 
                            ? "bg-white/10 ml-auto border border-white/10" 
                            : "bg-black/30 border border-white/5"
                        )}
                      >
                        <p className="text-gray-300 text-base leading-loose font-light
                          tracking-wide whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-center py-4">
                        <div className="animate-pulse flex space-x-2">
                          <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                          <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                          <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                        </div>
                      </div>
                    )}
                    {error && (
                      <div className="text-red-400 text-center text-sm py-2">
                        {error}
                      </div>
                    )}
                  </div>

                  {/* Search/Input Area */}
                  <form onSubmit={handleChatSubmit} className="relative">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-medium text-white/90 text-center">
                        Ask me anything about <span className="text-white font-semibold">{movie.title}</span>
                      </h2>
                      {/* Demo Questions */}
                      <div className="flex flex-col gap-2 mb-6">
                        {DEMO_QUESTIONS.map((question, index) => (
                          <button
                            key={index}
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleDemoQuestion(question)}
                            className="text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 
                              transition-all border border-white/10 text-white/80
                              text-sm font-light backdrop-blur-sm disabled:opacity-50
                              disabled:cursor-not-allowed"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          disabled={isLoading}
                          placeholder="Type your question..."
                          className="flex-1 bg-white/5 text-white/90 rounded-2xl px-6 py-4 
                            focus:outline-none focus:ring-2 focus:ring-white/20 
                            placeholder:text-white/40 font-light text-[15px]
                            border border-white/10 backdrop-blur-sm transition-all
                            hover:bg-white/10 disabled:opacity-50
                            disabled:cursor-not-allowed"
                        />
                        <button
                          type="submit"
                          disabled={isLoading || !query.trim()}
                          className="bg-white/5 text-white/90 rounded-full p-4
                            hover:bg-white/10 transition-all border border-white/10
                            focus:outline-none focus:ring-2 focus:ring-white/20
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 