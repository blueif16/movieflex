'use client'

import { Play, Info } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="relative h-[90vh] w-full">
      <Image
        src="https://picsum.photos/1920/1080"
        alt="Featured movie"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent">
        <div className="flex flex-col justify-center h-full max-w-2xl px-8 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">Featured Title</h1>
          <p className="text-lg text-gray-200">
            A compelling description of the featured content that draws viewers in and makes
            them want to watch immediately.
          </p>
          <div className="flex space-x-4 pt-4">
            <button className="flex items-center px-6 py-2 bg-white text-black rounded hover:bg-gray-200">
              <Play className="w-6 h-6 mr-2" />
              Play
            </button>
            <button className="flex items-center px-6 py-2 bg-gray-500/70 text-white rounded hover:bg-gray-500/90">
              <Info className="w-6 h-6 mr-2" />
              More Info Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 