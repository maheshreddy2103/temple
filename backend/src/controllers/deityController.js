
import pool from '../config/db.js'

// Get all deities
export async function getAllDeities(req, res) {
  try {
    const [deities] = await pool.query(
      'SELECT id, name FROM deities ORDER BY name ASC'
    )

    return res.status(200).json({
      success: true,
      count: deities.length,
      deities
    })
  } catch (error) {
    console.error('GET DEITIES ERROR:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch deities'
    })
  }
}

// Create a new deity
export async function createDeity(req, res) {
  try {
    const name = req.body.name?.trim()

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Deity name is required'
      })
    }

    const [existing] = await pool.query(
      'SELECT id, name FROM deities WHERE LOWER(name) = LOWER(?) LIMIT 1',
      [name]
    )

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'This deity already exists',
        deity: existing[0]
      })
    }

    const [result] = await pool.query(
      'INSERT INTO deities (name) VALUES (?)',
      [name]
    )

    return res.status(201).json({
      success: true,
      message: 'Deity added successfully',
      deity: {
        id: result.insertId,
        name
      }
    })
  } catch (error) {
    console.error('CREATE DEITY ERROR:', error)

    return res.status(500).json({
      success: false,
      message: 'Unable to add deity'
    })
  }
}

