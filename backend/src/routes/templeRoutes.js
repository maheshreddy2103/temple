import express from 'express'
import {
  getAllTemples,
  getTempleById,
  createTemple
} from '../controllers/templeController.js'

import upload from '../config/upload.js'

const router = express.Router()

// Get all temples
router.get('/', getAllTemples)

// Get temple by ID
router.get('/:id', getTempleById)

// Add new temple with image
router.post(
  '/',
  upload.single('image'),
  createTemple
)

export default router
