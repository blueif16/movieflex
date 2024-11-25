import NavigationBar from './components/layout/NavigationBar'
import Hero from './components/layout/Hero'
import ContentRow from './components/features/ContentRow'
import { getTopRatedMovies, getGenres, getMoviesByGenre } from './lib/api'

async function getInitialData() {
  try {
    // Get top rated movies first
    const topRatedResponse = await getTopRatedMovies().catch(() => ({ movies: [] }))
    
    // Then get genres and genre movies
    const genresResponse = await getGenres().catch(() => ({ genres: [] }))
    const sortedGenres = [...genresResponse.genres].sort((a, b) => a.localeCompare(b))

    const genreMovies = await Promise.allSettled(
      sortedGenres.map(genre => 
        getMoviesByGenre(genre)
          .catch(() => ({ movies: [] }))
      )
    )

    return {
      topRated: topRatedResponse.movies || [], // Ensure we have an array even if empty
      genres: sortedGenres,
      genreMovies: genreMovies.map((result, index) => ({
        genre: sortedGenres[index],
        movies: result.status === 'fulfilled' ? result.value.movies : []
      })).filter(({ movies }) => movies.length > 0) // Only include genres with movies
    }
  } catch (error) {
    console.error('Failed to fetch initial data:', error)
    return {
      topRated: [],
      genres: [],
      genreMovies: []
    }
  }
}

export default async function Home() {
  const data = await getInitialData()

  return (
    <main className="min-h-screen bg-[#141414]">
      <NavigationBar />
      <Hero />
      
      <section className="relative space-y-16 pb-24 mt-8">
        {/* Top Rated Row - Always First */}
        {data.topRated && data.topRated.length > 0 && (
          <ContentRow 
            title="Top Rated Movies"
            movies={data.topRated.slice(0, 20)} // Limit to top 20 movies
          />
        )}
        
        {/* Genre Rows - Alphabetically sorted with "Top" prefix */}
        {data.genreMovies.map(({ genre, movies }) => (
          <ContentRow 
            key={genre}
            title={`Top ${genre} Movies`}
            movies={movies.slice(0, 20)} // Limit to top 20 movies per genre
          />
        ))}

        {/* Show message if no content available */}
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
