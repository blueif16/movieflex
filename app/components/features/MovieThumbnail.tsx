'use client'

import Image from 'next/image'
import { Play, Plus, Star, ImageIcon } from 'lucide-react'
import { useState } from 'react'
import MovieDetailModal from './MovieDetailModal'
import { Movie } from '@/app/types'

interface MovieThumbnailProps extends Movie {}

export default function MovieThumbnail(props: MovieThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { imageUrl, title, genres, rating, release_year } = props

  return (
    <>
      <div 
        className="relative h-[200px] min-w-[150px] cursor-pointer transition duration-200 ease-out md:h-[300px] md:min-w-[200px] hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative w-full h-full">
          {imageError ? (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded-sm md:rounded">
              <ImageIcon className="w-12 h-12 text-gray-400" />
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="rounded-sm object-cover md:rounded"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 150px, 200px"
              priority={false}
            />
          )}
          
          {/* Hover Overlay */}
          <div 
            className={`absolute inset-0 bg-black/70 rounded-sm md:rounded transition-opacity duration-200
              flex flex-col justify-center items-center space-y-3 z-10
              ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <h3 className="text-white text-lg font-bold text-center px-2">{title}</h3>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <p className="text-yellow-400">{rating.toFixed(1)}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-1 px-2">
              {genres.slice(0, 2).map((genre) => (
                <span key={genre} className="text-gray-300 text-xs bg-gray-800/50 px-2 py-1 rounded">
                  {genre}
                </span>
              ))}
            </div>
            <p className="text-gray-400 text-xs">{release_year}</p>
            <div className="flex space-x-3">
              <button className="flex items-center bg-white text-black rounded-full p-2 hover:bg-gray-200 transition-colors">
                <Play className="w-6 h-6" />
              </button>
              <button className="flex items-center bg-gray-600/70 text-white rounded-full p-2 hover:bg-gray-600 transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <MovieDetailModal 
        movie={props}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
} 