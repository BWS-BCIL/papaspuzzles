# Server (Legacy Backend)

This directory contains the original Express + SQLite backend from the early prototype.

**This server is NOT deployed on Vercel.** Vercel is a serverless platform with a read-only filesystem, which is incompatible with SQLite and local file storage.

The application has been migrated to use Firebase (Firestore + Firebase Storage) via Next.js API routes in `src/app/api/`.

If you want to run this server locally or deploy it separately, it requires its own host such as Railway, Render, or Fly.io.

## Local Development
```bash
npm install
npm start
```
