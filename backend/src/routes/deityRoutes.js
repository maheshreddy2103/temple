
import express from 'express'
import {
  getAllDeities,
  createDeity
} from '../controllers/deityController.js'

const router = express.Router()

router.get('/', getAllDeities)
router.post('/', createDeity)

export default router
