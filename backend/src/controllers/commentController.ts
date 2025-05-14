import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../utils/supabaseClient';

export const createComment = async (req: Request, res: Response) => {
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ message: 'userId and content are required.' });
  }

  const { data, error } = await supabase.from('comments').insert([
    {
      id: uuidv4(),
      user_id: userId,
      content,
    },
  ]);

  if (error) {
    return res.status(500).json({ message: 'Failed to create comment', error });
  }

  res.status(201).json({ message: 'Comment created.', comment: data?.[0] });
};

export const getOwnComments = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ message: "userId is required." });
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ message: "Failed to fetch comments", error });
  }

  // Format dates before sending to the client
  const formattedData = data?.map((comment) => ({
    ...comment,
    created_at: new Date(comment.created_at).toISOString(),
  }));

  res.status(200).json(formattedData);
};

export const updateOwnComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, content } = req.body;

  const { data: existing, error: fetchError } = await supabase
    .from('comments')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (fetchError || !existing) {
    return res.status(404).json({ message: 'Comment not found or unauthorized.' });
  }

  const { data, error } = await supabase
    .from('comments')
    .update({ content })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ message: 'Failed to update comment', error });
  }

  res.status(200).json({ message: 'Comment updated.', comment: data?.[0] });
};

export const deleteOwnComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    return res.status(500).json({ message: 'Failed to delete comment', error });
  }

  res.status(200).json({ message: 'Comment deleted.' });
};

