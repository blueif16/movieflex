'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef, useState } from 'react'
import MovieThumbnail from './MovieThumbnail'

interface ContentRowProps {
  title: string
  movies: {
    id: string
    title: string
    imageUrl: string
    genre: string
  }[]
}

export default function ContentRow({ title, movies }: ContentRowProps) {
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
    <div className="space-y-0.5 md:space-y-2">
      <h2 className="w-56 cursor-pointer text-sm font-semibold text-white transition duration-200 hover:text-gray-300 md:text-2xl">
        {title}
      </h2>

      <div className="group relative md:-ml-2">
        <ChevronLeft 
          className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${
            !isMoved && 'hidden'
          }`}
          onClick={() => handleClick('left')}
        />

        <div 
          ref={rowRef}
          className="flex items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-2.5 md:p-2"
        >
          {movies.map((movie) => (
            <MovieThumbnail key={movie.id} {...movie} />
          ))}
        </div>

        <ChevronRight 
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  )
} 