import NavigationBar from './components/layout/NavigationBar'
import Hero from './components/layout/Hero'
import ContentRow from './components/features/ContentRow'
import { categories } from './lib/mock-data'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-900/10 to-[#010511] lg:h-[140vh]">
      <NavigationBar />
      <Hero />
      
      <section className="relative pl-4 pb-24 md:space-y-24 md:pl-16">
        {categories.map((category) => (
          <ContentRow 
            key={category.title} 
            title={category.title} 
            movies={category.movies} 
          />
        ))}
      </section>
    </main>
  )
}
