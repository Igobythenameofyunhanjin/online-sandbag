import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../utils/supabaseClient';

export const signup = async (req: Request, res: Response) => {
  const { ip, nickname, password } = req.body;

  if (!ip || !nickname || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const { data: existingUsers, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('ip', ip)
    .eq('nickname', nickname);

  if (fetchError) {
    return res.status(500).json({ message: 'Failed to check user.', error: fetchError });
  }

  if (existingUsers && existingUsers.length > 0) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { data, error } = await supabase.from('users').insert([
    {
      id: uuidv4(),
      ip,
      nickname,
      password: hashedPassword,
    },
  ]);

  if (error) {
    return res.status(500).json({ message: 'Failed to register user.', error });
  }

  return res.status(201).json({ message: 'User registered successfully.' });
};

export const login = async (req: Request, res: Response) => {
  const { ip, nickname, password } = req.body;

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .eq('ip', ip)
    .eq('nickname', nickname)
    .limit(1);

  if (error || !users || users.length === 0) {
    return res.status(400).json({ message: 'User not found.' });
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  return res.status(200).json({ message: 'Login successful.', userId: user.id });
};
