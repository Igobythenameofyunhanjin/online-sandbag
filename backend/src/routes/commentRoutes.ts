import express from 'express';
import { createComment, getOwnComments, updateOwnComment, deleteOwnComment } from '../controllers/commentController';

const router = express.Router();

// Write new insult
router.post('/', createComment);

// Get user's own insults
router.get('/', getOwnComments);

// Update own insult
router.put('/:id', updateOwnComment);

// Delete own insult
router.delete('/:id', deleteOwnComment);

export default router;
