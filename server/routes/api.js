const express = require('express');
const router = express.Router();
const db = require('../database');

// Submit a donation
router.post('/donations', (req, res) => {
    const { name, pieces, difficulty, theme, condition, email } = req.body;
    const sql = `INSERT INTO donations (name, pieces, difficulty, theme, condition, email) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [name, pieces, difficulty, theme, condition, email];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: req.body,
            id: this.lastID
        });
    });
});

// Submit a request
router.post('/requests', (req, res) => {
    const { type, pieces, difficulty, email } = req.body;
    const sql = `INSERT INTO requests (type, pieces, difficulty, email) VALUES (?, ?, ?, ?)`;
    const params = [type, pieces, difficulty, email];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: req.body,
            id: this.lastID
        });
    });
});

// Admin: Get all donations
router.get('/admin/donations', (req, res) => {
    const sql = "SELECT * FROM donations ORDER BY created_at DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Admin: Get all requests
router.get('/admin/requests', (req, res) => {
    const sql = "SELECT * FROM requests ORDER BY created_at DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Admin: Update request status
router.patch('/admin/requests/:id', (req, res) => {
    const { status } = req.body;
    const sql = `UPDATE requests SET status = ? WHERE id = ?`;
    const params = [status, req.params.id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            changes: this.changes
        });
    });
});

// Admin: Login (Simple check)
router.post('/admin/login', (req, res) => {
    const { password } = req.body;
    // NOTE: This is the legacy/unused server. The active app uses Next.js API routes
    // with environment variable-based auth (ADMIN_PASSWORD). Do not rely on this.
    if (password === 'puzzleadmin123') {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

// --- New Papa's Puzzles Routes ---

const multer = require('multer');
const path = require('path');

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // e.g. 123456789.jpg
    }
});
const upload = multer.single('puzzlePhoto');

// Upload Image
router.post('/upload', (req, res) => {
    console.log('Upload request received');
    upload(req, res, function (err) {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ error: err.message });
        }
        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }
        console.log('File uploaded:', req.file.filename);
        // Return the URL to access the file
        const imageUrl = `http://localhost:5001/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    });
});

// Get Available Inventory (for Trade Step 3)
router.get('/inventory', (req, res) => {
    // Get all donations that are 'available'
    const sql = "SELECT * FROM donations WHERE status = 'available' ORDER BY created_at DESC";
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Submit a Trade
router.post('/trade', (req, res) => {
    const {
        userName, userEmail,
        donationName, donationPieces, donationType, donationCondition, donationImage,
        wantedPuzzleId
    } = req.body;

    // Transaction-like approach (SQLite doesn't support nested transactions easily in this driver, so we chain)

    // 1. Insert the new donation (what the user is giving)
    const insertDonationSql = `INSERT INTO donations (name, pieces, difficulty, theme, condition, email, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'available')`;
    // Mapping 'donationType' to 'theme' and defaulting difficulty to 'medium' for now as it wasn't in the wizard spec explicitly but is in DB
    const donationParams = [donationName, donationPieces, 'medium', donationType, donationCondition || 'good', userEmail, donationImage];

    db.run(insertDonationSql, donationParams, function (err) {
        if (err) {
            return res.status(400).json({ error: 'Failed to save donation: ' + err.message });
        }
        const newDonationId = this.lastID;

        // 2. Create the Trade record
        const insertTradeSql = `INSERT INTO trades (user_name, user_email, given_donation_id, received_donation_id) VALUES (?, ?, ?, ?)`;
        const tradeParams = [userName, userEmail, newDonationId, wantedPuzzleId];

        db.run(insertTradeSql, tradeParams, function (err) {
            if (err) {
                return res.status(400).json({ error: 'Failed to save trade: ' + err.message });
            }

            // 3. Mark the requested puzzle as 'reserved' or 'traded' so others don't pick it
            // For MVP, let's mark it 'traded' immediately or 'pending_fulfillment'
            const updateStatusSql = `UPDATE donations SET status = 'traded' WHERE id = ?`;
            db.run(updateStatusSql, [wantedPuzzleId], function (err) {
                if (err) {
                    // Non-fatal, but good to log
                    console.error("Failed to update status of requested puzzle", err);
                }

                res.json({
                    message: 'success',
                    tradeId: this.lastID
                });
            });
        });
    });
});

// Get My Trades
router.get('/my-trades', (req, res) => {
    const { email } = req.query;
    console.log('Fetching trades for email:', email);
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    const sql = `
    SELECT 
      t.*, 
      d_given.name as given_name, 
      d_received.name as received_name, d_received.image_url as received_image
    FROM trades t
    LEFT JOIN donations d_given ON t.given_donation_id = d_given.id
    LEFT JOIN donations d_received ON t.received_donation_id = d_received.id
    WHERE t.user_email = ?
    ORDER BY t.created_at DESC
  `;

    db.all(sql, [email], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

module.exports = router;
