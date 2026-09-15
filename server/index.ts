import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import path from 'node:path';
import { initialPosts, type Post } from '../src/data.js';
const app = express();
app.use(express.json({ limit: '5mb' }));
const pool = process.env.DATABASE_URL ? new pg.Pool({ connectionString: process.env.DATABASE_URL }) : null;
const memory = new Map(initialPosts.map(post => [post.id, post]));
if (pool) {
  await pool.query('CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, data JSONB NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())');
  for (const post of initialPosts) await pool.query('INSERT INTO posts (id, data) VALUES ($1, $2) ON CONFLICT DO NOTHING', [post.id, JSON.stringify(post)]);
}
app.get('/api/health', (_req, res) => res.json({status:'ok', storage: pool ? 'postgresql' : 'demo-memory'}));
app.get('/api/posts', async (_req, res, next) => { try { res.json(pool ? (await pool.query('SELECT data FROM posts ORDER BY created_at DESC')).rows.map(r => r.data) : [...memory.values()]); } catch (error) { next(error); } });
app.put('/api/posts/:id', async (req, res, next) => {
  const post = req.body as Post;
  if (post.id !== req.params.id || typeof post.text !== 'string' || !post.text.trim() || post.text.length > 2000 || typeof post.name !== 'string' || !Array.isArray(post.comments) || !Number.isFinite(post.likes)) { res.status(400).json({error:'Invalid post'}); return; }
  try { if (pool) await pool.query('INSERT INTO posts (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data', [post.id, JSON.stringify(post)]); else memory.set(post.id, post); res.json(post); } catch (error) { next(error); }
});
app.use(express.static(path.resolve('dist')));
app.get('*', (_req, res) => res.sendFile(path.resolve('dist/index.html')));
app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => { console.error(error.message); res.status(500).json({error:'Could not save your changes. Please try again.'}); });
app.listen(Number(process.env.PORT) || 3001, '0.0.0.0', () => console.log(`StudentLoop API ready. Storage: ${pool ? 'PostgreSQL' : 'in-memory demo'}.`));
