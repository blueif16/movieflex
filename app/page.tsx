import { Suspense } from 'react'
import NavigationBar from './components/layout/NavigationBar'
import Hero from './components/layout/Hero'
import ContentRow from './components/features/ContentRow'
import { getTopRatedMovies, getGenres, getMoviesByGenre } from './lib/api'

async function getInitialData() {
  const [topRated, genresResponse] = await Promise.all([
    getTopRatedMovies(),
    getGenres(),
  ])

  const genreMovies = await Promise.all(
    genresResponse.genres.map(genre => getMoviesByGenre(genre))
  )

  return {
    topRated: topRated.movies,
    genres: genresResponse.genres,
    genreMovies: genreMovies.map((response, index) => ({
      genre: genresResponse.genres[index],
      movies: response.movies
    }))
  }
}

export default async function Home() {
  const data = await getInitialData()

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-900/10 to-[#010511] lg:h-[140vh]">
      <NavigationBar />
      <Hero />
      
      <section className="relative pl-4 pb-24 md:space-y-24 md:pl-16">
        <ContentRow 
          title="Top Rated Movies" 
          movies={data.topRated}
        />
        
        {data.genreMovies.map(({ genre, movies }) => (
          <ContentRow 
            key={genre}
            title={`Top Rated ${genre} Movies`}
            movies={movies}
          />
        ))}
      </section>
    </main>
  )
}
