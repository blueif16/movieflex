'use client'

import { Play, Pause, Info, Volume2, VolumeX } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Set up initial video state when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      videoRef.current.muted = true
    }
  }, [])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative h-[90vh] w-full">
      {/* Video Background */}
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        muted
        loop
        playsInline
      >
        <source
          src="/videos/hero-trailer.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent">
        <div className="flex flex-col justify-center h-full max-w-2xl px-8 space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-red-600">
            MovieFlex
          </h1>
          <p className="text-xl text-gray-200 leading-relaxed">
            Your ultimate destination for discovering and exploring movies from around the world. 
            Browse through our extensive collection of films, filter by genres, languages, 
            and countries, and find your next favorite movie.
          </p>
          <div className="flex space-x-4 pt-4">
            <button 
              onClick={handlePlayPause}
              className="flex items-center px-8 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 mr-2" />
              ) : (
                <Play className="w-6 h-6 mr-2" />
              )}
              {isPlaying ? 'Pause' : 'Play'} Trailer
            </button>
            <button className="flex items-center px-8 py-3 bg-gray-500/70 text-white rounded hover:bg-gray-500/90 transition-colors">
              <Info className="w-6 h-6 mr-2" />
              About Us
            </button>
          </div>
        </div>
      </div>

      {/* Mute/Unmute Button */}
      <button
        onClick={handleMuteToggle}
        className="absolute bottom-4 right-4 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white/80" />
        ) : (
          <Volume2 className="w-6 h-6 text-white/80" />
        )}
      </button>
    </div>
  )
} 