'use client'

import Image from 'next/image'
import { Play, Plus, Star } from 'lucide-react'
import { useState } from 'react'

interface MovieThumbnailProps {
  imageUrl: string
  title: string
  genre: string
  id: string
  rating: number
}

export default function MovieThumbnail({ imageUrl, title, genre, id, rating }: MovieThumbnailProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative h-[200px] min-w-[150px] cursor-pointer transition duration-200 ease-out md:h-[300px] md:min-w-[200px] hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={imageUrl}
        alt={title}
        fill
        className="rounded-sm object-cover md:rounded"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-black/70 rounded-sm md:rounded">
          <div className="flex flex-col justify-center items-center h-full space-y-3">
            <h3 className="text-white text-lg font-bold text-center px-2">{title}</h3>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <p className="text-yellow-400">{rating.toFixed(1)}</p>
            </div>
            <p className="text-gray-300 text-sm">{genre}</p>
            <div className="flex space-x-3">
              <button className="flex items-center bg-white text-black rounded-full p-2 hover:bg-gray-200">
                <Play className="w-6 h-6" />
              </button>
              <button className="flex items-center bg-gray-600/70 text-white rounded-full p-2 hover:bg-gray-600">
                <Plus className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 