'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import MovieThumbnail from './MovieThumbnail'
import { Movie } from '@/app/types'

interface ContentRowProps {
  title: string
  movies: Movie[]
}

export default function ContentRow({ title, movies }: ContentRowProps) {
  console.log(`Rendering ContentRow for ${title} with ${movies.length} movies`)
  
  const rowRef = useRef<HTMLDivElement>(null)
  const [isMoved, setIsMoved] = useState(false)

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true)

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth
        : scrollLeft + clientWidth

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <div className="space-y-2 md:space-y-4">
      <h2 className="cursor-pointer text-xl font-bold text-white transition duration-200 hover:text-gray-300 md:text-2xl pl-4">
        {title} ({movies.length})
      </h2>

      <div className="group relative md:-ml-2">
        <ChevronLeft 
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 
            cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 
            text-white bg-black/30 rounded-full p-2 hover:bg-black/60 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />

        <div 
          ref={rowRef}
          className="flex items-center space-x-2.5 overflow-x-scroll scrollbar-hide md:p-2"
        >
          {movies.map((movie) => (
            <MovieThumbnail key={movie.title} {...movie} />
          ))}
        </div>

        <ChevronRight 
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 
            cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100
            text-white bg-black/30 rounded-full p-2 hover:bg-black/60"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  )
} 