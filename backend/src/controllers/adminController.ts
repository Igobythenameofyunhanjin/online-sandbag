import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../utils/supabaseClient';

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { data: admins, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email)
    .limit(1);

  if (error || !admins || admins.length === 0) {
    return res.status(401).json({ message: 'Unauthorized - Admin not found' });
  }

  const admin = admins[0];
  const isMatch = await bcrypt.compare(password, admin.password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Unauthorized - Invalid password' });
  }

  return res.status(200).json({ message: 'Admin login successful.' });
};

export const getAllComments = async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ message: 'Failed to fetch comments.', error });
  }

  return res.status(200).json(data);
};

export const markCommentAsRead = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error: updateError } = await supabase
    .from('comments')
    .update({ is_read: true })
    .eq('id', id);

  if (updateError) {
    return res.status(500).json({ message: 'Failed to mark as read.', error: updateError });
  }

  return res.status(200).json({ message: 'Comment marked as read.' });
};
