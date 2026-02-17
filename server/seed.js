const db = require('./database');

const puzzles = [
    { name: "Eiffel Tower at Night", pieces: 1000, difficulty: "hard", theme: "Landscape", condition: "good" },
    { name: "Cute Kittens Basket", pieces: 500, difficulty: "medium", theme: "Animals", condition: "new" },
    { name: "Starry Night (Van Gogh)", pieces: 1000, difficulty: "hard", theme: "Art", condition: "good" },
    { name: "Marvel Avengers", pieces: 300, difficulty: "easy", theme: "Movies", condition: "good" },
    { name: "Tropical Rainforest", pieces: 1000, difficulty: "medium", theme: "Landscape", condition: "good" },
    { name: "Space Exploration", pieces: 500, difficulty: "medium", theme: "Other", condition: "new" },
    { name: "Underwater Coral Reef", pieces: 1000, difficulty: "hard", theme: "Animals", condition: "good" },
    { name: "Vintage World Map", pieces: 2000, difficulty: "hard", theme: "Other", condition: "fair" },
    { name: "Disney Castle", pieces: 500, difficulty: "medium", theme: "Movies", condition: "good" },
    { name: "Mountain Lake Sunset", pieces: 1000, difficulty: "medium", theme: "Landscape", condition: "new" }
];

console.log("Seeding database...");

db.serialize(() => {
    const stmt = db.prepare("INSERT INTO donations (name, pieces, difficulty, theme, condition, email, status, created_at) VALUES (?, ?, ?, ?, ?, 'seed@example.com', 'available', CURRENT_TIMESTAMP)");

    puzzles.forEach(puzzle => {
        stmt.run(puzzle.name, puzzle.pieces, puzzle.difficulty, puzzle.theme, puzzle.condition);
    });

    stmt.finalize(() => {
        console.log("Added 10 fake puzzles to inventory.");
        db.close();
    });
});
