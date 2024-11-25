export const mockMovies = [
  {
    id: '1',
    title: 'The Adventure Begins',
    imageUrl: 'https://picsum.photos/seed/movie1/400/600',
    genre: 'Adventure'
  },
  {
    id: '2',
    title: 'City Lights',
    imageUrl: 'https://picsum.photos/seed/movie2/400/600',
    genre: 'Drama'
  },
  {
    id: '3',
    title: 'Space Warriors',
    imageUrl: 'https://picsum.photos/seed/movie3/400/600',
    genre: 'Sci-Fi'
  },
  {
    id: '4',
    title: 'Lost in Time',
    imageUrl: 'https://picsum.photos/seed/movie4/400/600',
    genre: 'Mystery'
  },
  {
    id: '5',
    title: 'The Last Stand',
    imageUrl: 'https://picsum.photos/seed/movie5/400/600',
    genre: 'Action'
  },
  // Add more mock movies as needed
]

export const categories = [
  {
    title: 'Trending Now',
    movies: mockMovies
  },
  {
    title: 'Top Rated',
    movies: [...mockMovies].reverse()
  },
  {
    title: 'Action Thrillers',
    movies: mockMovies
  }
] 