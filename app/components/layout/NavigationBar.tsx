'use client'

import { Search, Bell, User } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import SearchOverlay from '../features/SearchOverlay'

export default function NavigationBar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Add scroll listener
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 0)
    })
  }

  return (
    <>
      <nav className={`fixed w-full z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/70 to-transparent'
      }`}>
        <div className="px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-red-600 text-2xl font-bold">METFLIX</h1>
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="text-white hover:text-gray-300">Home</Link>
              <Link href="/series" className="text-white hover:text-gray-300">TV Series</Link>
              <Link href="/movies" className="text-white hover:text-gray-300">Movies</Link>
              <Link href="/new" className="text-white hover:text-gray-300">New & Popular</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-gray-300"
            >
              <Search className="w-6 h-6" />
            </button>
            <Bell className="w-6 h-6 text-white cursor-pointer hover:text-gray-300" />
            <User className="w-6 h-6 text-white cursor-pointer hover:text-gray-300" />
          </div>
        </div>
      </nav>

      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  )
} 