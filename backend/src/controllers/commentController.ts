import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

// Mock in-memory comments (replace with real DB later)
export const comments: any[] = [];


export const createComment = (req: Request, res: Response) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ message: 'userId and content are required.' });
  }

  const newComment = {
    id: uuidv4(),
    userId,
    content,
    isReadByAdmin: false,
    createdAt: new Date(),
  };

  comments.push(newComment);

  res.status(201).json({ message: 'Comment created.', comment: newComment });
};

export const getOwnComments = (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'userId is required.' });
  }

  const userComments = comments.filter(c => c.userId === userId);
  res.status(200).json(userComments);
};

export const updateOwnComment = (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, content } = req.body;

  const comment = comments.find(c => c.id === id && c.userId === userId);
  if (!comment) {
    return res.status(404).json({ message: 'Comment not found or unauthorized.' });
  }

  comment.content = content;
  res.status(200).json({ message: 'Comment updated.', comment });
};

export const deleteOwnComment = (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  const index = comments.findIndex(c => c.id === id && c.userId === userId);
  if (index === -1) {
    return res.status(404).json({ message: 'Comment not found or unauthorized.' });
  }

  comments.splice(index, 1);
  res.status(200).json({ message: 'Comment deleted.' });
};
