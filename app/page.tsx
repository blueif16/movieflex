import NavigationBar from './components/layout/NavigationBar'
import Hero from './components/layout/Hero'
import ContentRow from './components/features/ContentRow'
import { getTopRatedMovies, getGenres, getMoviesByGenre } from './lib/api'

async function getInitialData() {
  try {
    const [topRatedResponse, genresResponse] = await Promise.all([
      getTopRatedMovies().catch(() => ({ movies: [] })),
      getGenres().catch(() => ({ genres: [] })),
    ])

    const genreMovies = await Promise.allSettled(
      genresResponse.genres.map(genre => 
        getMoviesByGenre(genre)
          .catch(() => ({ movies: [] }))
      )
    )

    return {
      topRated: topRatedResponse.movies,
      genres: genresResponse.genres,
      genreMovies: genreMovies.map((result, index) => ({
        genre: genresResponse.genres[index],
        movies: result.status === 'fulfilled' ? result.value.movies : []
      }))
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
        {data.topRated.length > 0 && (
          <ContentRow 
            title="Top Rated Movies" 
            movies={data.topRated}
          />
        )}
        
        {data.genreMovies.map(({ genre, movies }) => (
          movies.length > 0 && (
            <ContentRow 
              key={genre}
              title={`Top ${genre} Movies`}
              movies={movies}
            />
          )
        ))}

        {data.topRated.length === 0 && data.genreMovies.every(({ movies }) => movies.length === 0) && (
          <div className="text-white text-center py-20">
            <h2 className="text-2xl font-bold">No movies available</h2>
            <p className="text-gray-400 mt-2">Please try again later</p>
          </div>
        )}
      </section>
    </main>
  )
}
