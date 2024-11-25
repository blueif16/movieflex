
# METFLIX - Movie Discovery Platform

A Netflix-inspired movie discovery platform built with Next.js and Flask, allowing users to browse and search movies by genres, languages, and countries.

---

## Features

- Browse movies by genres, languages, and countries
- Search functionality with multiple filters
- Dynamic movie poster loading
- Video trailer playback in hero section
- Responsive design
- Rating-based movie sorting
- Horizontal scrolling movie rows

---

## Tech Stack

### Frontend
- **Framework:** Next.js (v14)
- **Styling:** Tailwind CSS
- **Icons:** Lucide Icons
- **Language:** TypeScript

### Backend
- **Framework:** Flask
- **Data Handling:** Pandas
- **API Integration:** TMDb API (for movie posters)

---

## Prerequisites

- **Node.js:** Version 18 or higher
- **Python:** Version 3.8 or higher
- **Pip:** Python package manager for backend dependencies

---

## Installation Guide

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd movieflex
\`\`\`

### 2. Install Frontend Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Install Backend Dependencies
\`\`\`bash
cd backend
pip install flask flask-cors pandas requests
\`\`\`

### 4. Set Environment Variables
Create a \`.env.local\` file in the project root and add the following:
\`\`\`bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

### 5. Update TMDb API Key
Open \`backend/crawl.py\` and replace the \`API_KEY\` value with your TMDb API key.

---

## Database and Media Setup

### 1. Create Required Directories
\`\`\`bash
mkdir -p movieflex/backend/posters
mkdir -p movieflex/public/videos
\`\`\`

### 2. Add Your Movie Database File
Copy your movie database file to the backend folder:
\`\`\`bash
cp path/to/your/imdb_movies-1.csv movieflex/backend/
\`\`\`

### 3. Add a Hero Video
Copy your hero trailer video to the public folder:
\`\`\`bash
cp path/to/your/trailer.mp4 movieflex/public/videos/hero-trailer.mp4
\`\`\`

---

## Running the Application

### 1. Start the Flask Backend
\`\`\`bash
cd backend
python app.py
\`\`\`
The backend will run on \`http://localhost:5000\`.

### 2. Start the Next.js Frontend
Open a new terminal:
\`\`\`bash
cd movieflex
npm run dev
\`\`\`
The frontend will run on \`http://localhost:3000\`.

---

## Troubleshooting

### Common Issues and Fixes

1. **API Connection Issues**
   - Verify Flask server is running on port 5000.
   - Check CORS settings in \`backend/app.py\`.
   - Confirm \`NEXT_PUBLIC_API_URL\` is correctly set in the frontend.
   - Test health endpoint: \`http://localhost:5000/api/health\`.

2. **Database Issues**
   - Ensure the database file exists and is readable.
   - Check file permissions.
   - Validate the setup using \`check_environment.py\`.
   - Confirm CSV file format.

3. **Video Playback Issues**
   - Verify the video file exists in \`public/videos\`.
   - Use MP4 format for compatibility.
   - Check browser console for media-related errors.

4. **Poster Loading Issues**
   - Ensure the TMDb API key is valid.
   - Verify network connectivity.
   - Confirm the \`posters\` directory exists and is writable.

---

## API Endpoints

- \`GET /api/health\` - Check API health status
- \`GET /api/search\` - Search movies with filters
- \`GET /api/genres\` - Retrieve all genres
- \`GET /api/languages\` - Retrieve all languages
- \`GET /api/countries\` - Retrieve all countries
- \`GET /api/movies/top-rated\` - Fetch top-rated movies
- \`GET /api/movies/by-genre/<genre>\` - Fetch movies by genre
- \`GET /api/poster/<movie_title>\` - Fetch a movie poster

---

## Additional Notes

### Environment-Specific Setup

#### Mac Users
1. Run the environment check script:
   \`\`\`bash
   chmod +x scripts/check-env.sh
   ./scripts/check-env.sh
   \`\`\`

2. Set proper permissions:
   \`\`\`bash
   chmod -R 755 backend/posters
   \`\`\`

#### Windows Users
- Add Python to the system \`PATH\`.
- Use proper path separators (\`\\`) in configuration files.
- Run Flask with \`python app.py\`.

---
