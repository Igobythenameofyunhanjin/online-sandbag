import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
// Simulating DB with simple arrays for now (replace later with real DB)
const users: any[] = [];

export const signup = async (req: Request, res: Response) => {
  const { ip, nickname, password } = req.body;

  if (!ip || !nickname || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const userExists = users.find(u => u.ip === ip && u.nickname === nickname);
  if (userExists) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    ip,
    nickname,
    password: hashedPassword,
    createdAt: new Date(),
  };

  users.push(newUser);

  return res.status(201).json({ message: 'User registered successfully.' });
};

export const login = async (req: Request, res: Response) => {
  const { ip, nickname, password } = req.body;

  const user = users.find(u => u.ip === ip && u.nickname === nickname);
  if (!user) {
    return res.status(400).json({ message: 'User not found.' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials.' });
  }

  return res.status(200).json({ message: 'Login successful.', userId: user.id });
};
