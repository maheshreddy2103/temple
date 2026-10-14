
import pool from '../config/db.js'

// Get all temples
export async function getAllTemples(req, res) {
  try {
    const { search, state, deity } = req.query

    let sql = `
      SELECT
        t.id,
        t.name,
        t.city,
        t.state,
        t.description,
        t.history,
        t.significance,
        t.timings,
        t.festivals,
        t.how_to_reach AS howToReach,
        t.image,
        t.official_website AS officialWebsite,
        d.name AS deity
      FROM temples t
      LEFT JOIN deities d
        ON t.deity_id = d.id
      WHERE 1 = 1
    `

    const params = []

    if (search) {
      sql += `
        AND (
          t.name LIKE ?
          OR t.city LIKE ?
          OR t.state LIKE ?
          OR d.name LIKE ?
        )
      `

      const value = `%${search}%`
      params.push(value, value, value, value)
    }

    if (state && state !== 'all') {
      sql += ' AND t.state = ?'
      params.push(state)
    }

    if (deity && deity !== 'all') {
      sql += ' AND d.name = ?'
      params.push(deity)
    }

    sql += ' ORDER BY t.name ASC'

    const [rows] = await pool.query(sql, params)

    res.json({
      success: true,
      count: rows.length,
      temples: rows
    })
  } catch (error) {
    console.error('GET TEMPLES ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to load temples'
    })
  }
}

// Get temple by ID
export async function getTempleById(req, res) {
  try {
    const { id } = req.params

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid temple ID'
      })
    }

    const [rows] = await pool.query(
      `
      SELECT
        t.id,
        t.name,
        t.city,
        t.state,
        t.description,
        t.history,
        t.significance,
        t.timings,
        t.festivals,
        t.how_to_reach AS howToReach,
        t.image,
        t.official_website AS officialWebsite,
        d.name AS deity
      FROM temples t
      LEFT JOIN deities d
        ON t.deity_id = d.id
      WHERE t.id = ?
      `,
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Temple not found'
      })
    }

    res.json({
      success: true,
      temple: rows[0]
    })
  } catch (error) {
    console.error('GET TEMPLE ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to load temple details'
    })
  }
}
// Add new temple
export async function createTemple(req, res) {
  try {
    const {
      name,
      city,
      state,
      deity,
      description,
      history,
      significance,
      timings,
      festivals,
      howToReach,
      officialWebsite
    } = req.body

    if (!name || !state || !deity) {
      return res.status(400).json({
        success: false,
        message: 'Temple name, state and deity are required'
      })
    }

    // Find deity ID
    const [deityRows] = await pool.query(
      'SELECT id FROM deities WHERE name = ? LIMIT 1',
      [deity]
    )

    if (deityRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Selected deity was not found'
      })
    }

    const deityId = deityRows[0].id

    // Uploaded image
    const image = req.file
      ? `/uploads/temples/${req.file.filename}`
      : null

    const [result] = await pool.query(
      `
      INSERT INTO temples (
        name,
        city,
        state,
        deity_id,
        description,
        history,
        significance,
        timings,
        festivals,
        how_to_reach,
        image,
        official_website
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        city || null,
        state,
        deityId,
        description || null,
        history || null,
        significance || null,
        timings || null,
        festivals || null,
        howToReach || null,
        image,
        officialWebsite || null
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Temple added successfully',
      templeId: result.insertId,
      image
    })
  } catch (error) {
    console.error('CREATE TEMPLE ERROR:', error)

    res.status(500).json({
      success: false,
      message: 'Unable to add temple'
    })
  }
}