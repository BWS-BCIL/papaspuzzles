# Puzzle Swap MVP

A simple marketplace for families to donate and request old puzzles.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm

## Setup Instructions

### 1. Backend Setup
The backend runs on Express and manages the SQLite database.

```bash
cd server
npm install
npm start
```
The server will start on `http://localhost:5000`.
The database file `puzzles.db` will be automatically created in the `server` directory.

### 2. Frontend Setup
The frontend is built with Next.js and Tailwind CSS.

```bash
cd client
npm install
npm run dev
```
The frontend will start on `http://localhost:3000`.

## Features
- **Landing Page**: Overview of the platform.
- **Donate**: Form to submit puzzle donations.
- **Request**: Form to request puzzles.
- **Admin Panel**: View donations and requests.
  - URL: `/admin`
  - Password: `puzzleadmin123`

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express
- **Database**: SQLite
