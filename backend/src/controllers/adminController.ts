import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// Mock Admin Info (for now, later move to DB)
const ADMIN_EMAIL = 'test';
const ADMIN_PASSWORD = '1111'; 

// Shared comments array
import { comments } from './commentController';

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD);
  if (!isMatch) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  return res.status(200).json({ message: 'Admin login successful.' });
};

export const getAllComments = (req: Request, res: Response) => {
  res.status(200).json(comments);
};

export const markCommentAsRead = (req: Request, res: Response) => {
  const { id } = req.params;

  const comment = comments.find(c => c.id === id);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found.' });
  }

  comment.isReadByAdmin = true;

  res.status(200).json({ message: 'Comment marked as read.', comment });
};
