'use client'

import { useEffect, useState } from 'react'
import NavigationBar from './components/layout/NavigationBar'
import Hero from './components/layout/Hero'
import ContentRow from './components/features/ContentRow'
import { getTopRatedMovies, getGenres, getMoviesByGenre } from './lib/api'

export default function Home() {
  const [data, setData] = useState({
    topRated: [],
    genres: [],
    genreMovies: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log('Starting initial data fetch')
        
        // Get top rated movies first
        const topRatedResponse = await getTopRatedMovies()
        console.log('Top rated movies fetched:', topRatedResponse.movies.length)
        
        // Then get genres and genre movies
        const genresResponse = await getGenres()
        const sortedGenres = [...genresResponse.genres].sort((a, b) => a.localeCompare(b))
        console.log('Genres fetched:', sortedGenres)

        const genreMovies = await Promise.allSettled(
          sortedGenres.map(genre => 
            getMoviesByGenre(genre)
              .catch(() => ({ movies: [] }))
          )
        )

        setData({
          topRated: topRatedResponse.movies || [],
          genres: sortedGenres,
          genreMovies: genreMovies.map((result, index) => ({
            genre: sortedGenres[index],
            movies: result.status === 'fulfilled' ? result.value.movies : []
          })).filter(({ movies }) => movies.length > 0)
        })
      } catch (error) {
        console.error('Failed to fetch initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <main className="min-h-screen bg-[#141414]">
      <NavigationBar />
      <Hero />
      
      <section className="relative space-y-16 pb-24 mt-8">
        {data.topRated && data.topRated.length > 0 && (
          <ContentRow 
            title="Top Rated Movies"
            movies={data.topRated.slice(0, 20)}
          />
        )}
        
        {data.genreMovies.map(({ genre, movies }) => (
          <ContentRow 
            key={genre}
            title={`Top ${genre} Movies`}
            movies={movies.slice(0, 20)}
          />
        ))}

        {(!data.topRated || data.topRated.length === 0) && data.genreMovies.length === 0 && (
          <div className="text-white text-center py-20">
            <h2 className="text-2xl font-bold">No movies available</h2>
            <p className="text-gray-400 mt-2">Please try again later</p>
          </div>
        )}
      </section>
    </main>
  )
}
