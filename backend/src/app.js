
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import deityRoutes from './routes/deityRoutes.js'
import pool from './config/db.js'
import templeRoutes from './routes/templeRoutes.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 5001

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}))

app.use(express.json())

// Home API
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Temple Explorer API is running'
  })
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is healthy'
  })
})

// MySQL connection test
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS connected')

    res.json({
      success: true,
      message: 'MySQL connected successfully',
      result: rows[0]
    })
  } catch (error) {
    console.error('DATABASE ERROR:', error.code, error.message)

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      errorCode: error.code || 'UNKNOWN'
    })
  }
})

// Get all deities
app.get('/api/deities', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, image FROM deities ORDER BY id'
    )

    res.json({
      success: true,
      count: rows.length,
      deities: rows
    })
  } catch (error) {
    console.error('DEITIES ERROR:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to load deities'
    })
  }
})

// Temple routes
app.use('/api/temples', templeRoutes)

// 404 - keep after all API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedPath: req.originalUrl
  })
})

// Server error handler
app.use((error, req, res, next) => {
  console.error('SERVER ERROR:', error)

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
})

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`Temple Explorer API running at http://localhost:${PORT}`)
})

server.on('error', (error) => {
  console.error('SERVER STARTUP ERROR:', error.message)
})
app.use('/uploads', express.static('uploads'))
app.use('/api/deities', deityRoutes)