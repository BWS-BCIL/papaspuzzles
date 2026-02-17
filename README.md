# Puzzle Swap MVP

A simple marketplace for families to donate and request old puzzles.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm

## Setup Instructions (Local)

### 1. Frontend + API (Next.js)
The app runs from the Next.js project in [client/](client/).

```bash
cd client
npm install
npm run dev
```
The frontend will start on `http://localhost:3000`.

### 2. Firebase configuration
Create a local environment file at `client/.env.local` using [client/.env.local.example](client/.env.local.example).

Required client variables:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Required admin variables (API routes):
- `FIREBASE_SERVICE_ACCOUNT` (JSON string), **or**
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- `FIREBASE_STORAGE_BUCKET`

### 3. Mock mode (optional)
For UI testing without Firebase, set:

```
NEXT_PUBLIC_USE_MOCK_DATA=true
```

## Features
- **Landing Page**: Overview of the platform.
- **Explore**: Browse listings and request a swap.
- **Donate**: Form to submit puzzle donations.
- **Request**: Form to request puzzles.
- **Admin Panel**: View donations and requests, add inventory.
  - URL: `/admin`
  - Password: `puzzleadmin123`

## Production Checklist (Vercel)
- [ ] Set all Firebase env vars in Vercel (both public and admin variables).
- [ ] Disable mock mode (`NEXT_PUBLIC_USE_MOCK_DATA=false`).
- [ ] Verify Firestore + Storage rules (lock down access).
- [ ] Confirm file upload size limits and formats.
- [ ] Add basic privacy policy (emails collected).
- [ ] Smoke test key flows: Explore → Trade, Admin add, Donation submit.

## Handoff to Student
1. In GitHub, add the student as a collaborator **or** have them fork the repo.
2. Student clones their repo locally.
3. In Vercel, import the repo and set environment variables (Firebase public + admin).
4. Deploy and verify core flows:
  - Explore shows listings
  - Admin can add inventory
  - Trade flow completes and updates inventory

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore + Storage
