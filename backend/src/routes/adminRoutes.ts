import express from 'express';
import { adminLogin, getAllComments, markCommentAsRead } from '../controllers/adminController';

const router = express.Router();

// Admin login
router.post('/login', adminLogin);

// Admin gets all insults
router.get('/comments', getAllComments);

// Admin marks comment as read
router.put('/comments/:id/read', markCommentAsRead);

export default router;