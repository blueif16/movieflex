async function testAPIConnection() {
  try {
    const response = await fetch('http://localhost:5000/api/health')
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    console.log('API Health Check:', data)
    return true
  } catch (error) {
    console.error('API Connection Error:', error)
    return false
  }
}

// You can run this in your browser console or add it to your app's startup
export async function runAPITests() {
  console.log('Testing API Connection...')
  const isHealthy = await testAPIConnection()
  
  if (!isHealthy) {
    console.error(`
      API Connection Failed! Please check:
      1. Is the Flask server running? (python backend/app.py)
      2. Is it running on port 5000?
      3. Are CORS headers properly set?
      4. Is the database file present and readable?
    `)
  } else {
    console.log('API Connection Successful!')
  }
} 