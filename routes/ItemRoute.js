import express from 'express'
import {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
} from '../controllers/Items.js'
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/items', verifyUser, getItems)
router.get('/items/:id', verifyUser, getItemById)
router.post('/items', verifyUser, createItem)
router.patch('/items/:id', verifyUser, updateItem)
router.delete('/items/:id', verifyUser, deleteItem)

export default router