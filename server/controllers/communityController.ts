import { Response } from 'express';
import { getDb } from '../db/database.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../types/index.js';

export function getPosts(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const { search, category } = req.query;
  let query = 'SELECT * FROM community_posts WHERE 1=1';
  const params: any[] = [];

  if (search) { query += ' AND (title LIKE ? OR content LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  if (category) { query += ' AND category = ?'; params.push(category); }
  query += ' ORDER BY created_at DESC';

  const posts = db.prepare(query).all(...params).map((p: any) => ({ ...p, tags: JSON.parse(p.tags) }));
  sendSuccess(res, posts);
}

export function getPost(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const post = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(req.params.id) as any;
  if (!post) { sendError(res, 'Post not found', 404); return; }
  const replies = db.prepare('SELECT * FROM community_replies WHERE post_id = ? ORDER BY created_at ASC').all(req.params.id);
  sendSuccess(res, { ...post, tags: JSON.parse(post.tags), replies });
}

export function createPost(req: AuthenticatedRequest, res: Response): void {
  const { title, content, category, tags } = req.body;
  if (!title || !content) { sendError(res, 'title and content are required'); return; }

  const db = getDb();
  const user = req.user!;
  const result = db.prepare(`
    INSERT INTO community_posts (user_id, author_name, author_role, author_initials, title, content, category, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(user.id, user.name, (user as any).business_type || 'Entrepreneur', user.avatar_initials || 'U',
    title, content, category || 'General', JSON.stringify(tags || [])) as any;

  const post = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(result.lastInsertRowid) as any;
  sendSuccess(res, { ...post, tags: JSON.parse(post.tags) }, 201);
}

export function likePost(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const post = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(req.params.id) as any;
  if (!post) { sendError(res, 'Post not found', 404); return; }

  const existing = db.prepare('SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?').get(req.userId!, req.params.id);
  if (existing) {
    db.prepare('DELETE FROM post_likes WHERE user_id = ? AND post_id = ?').run(req.userId!, req.params.id);
    db.prepare('UPDATE community_posts SET likes = likes - 1 WHERE id = ?').run(req.params.id);
    sendSuccess(res, { liked: false, likes: post.likes - 1 });
  } else {
    db.prepare('INSERT INTO post_likes (user_id, post_id) VALUES (?, ?)').run(req.userId!, req.params.id);
    db.prepare('UPDATE community_posts SET likes = likes + 1 WHERE id = ?').run(req.params.id);
    sendSuccess(res, { liked: true, likes: post.likes + 1 });
  }
}

export function addReply(req: AuthenticatedRequest, res: Response): void {
  const { content } = req.body;
  if (!content) { sendError(res, 'content is required'); return; }

  const db = getDb();
  const post = db.prepare('SELECT * FROM community_posts WHERE id = ?').get(req.params.id);
  if (!post) { sendError(res, 'Post not found', 404); return; }

  const result = db.prepare(`
    INSERT INTO community_replies (post_id, user_id, author_name, content)
    VALUES (?, ?, ?, ?)
  `).run(req.params.id, req.userId!, req.user!.name, content) as any;

  db.prepare('UPDATE community_posts SET reply_count = reply_count + 1 WHERE id = ?').run(req.params.id);
  sendSuccess(res, db.prepare('SELECT * FROM community_replies WHERE id = ?').get(result.lastInsertRowid), 201);
}

export function deletePost(req: AuthenticatedRequest, res: Response): void {
  const db = getDb();
  const post = db.prepare('SELECT * FROM community_posts WHERE id = ? AND user_id = ?').get(req.params.id, req.userId!);
  if (!post) { sendError(res, 'Post not found or not authorized', 404); return; }
  db.prepare('DELETE FROM community_posts WHERE id = ?').run(req.params.id);
  sendSuccess(res, { message: 'Post deleted' });
}
