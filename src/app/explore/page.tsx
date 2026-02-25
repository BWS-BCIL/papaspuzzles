"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Search, Upload } from "lucide-react";

const PIECE_OPTIONS = ["All", "100", "300", "500", "1000", "2000+"];
const THEME_OPTIONS = ["All", "Animals", "Landscape", "Art", "Food", "Cityscape", "Movies", "Other"];
const DIFFICULTY_OPTIONS = ["All", "easy", "medium", "hard"];

export default function ExplorePage() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterPieces, setFilterPieces] = useState("All");
    const [filterTheme, setFilterTheme] = useState("All");
    const [filterDifficulty, setFilterDifficulty] = useState("All");

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await fetch("/api/inventory", { cache: "no-store" });
            const data = await res.json();
            setInventory(data.data || []);
        } catch (err) {
            console.error("Failed to load inventory", err);
        } finally {
            setLoading(false);
        }
    };

    const filtered = inventory.filter(puzzle => {
        if (filterPieces !== "All" && String(puzzle.pieces) !== filterPieces) return false;
        if (filterTheme !== "All" && (puzzle.theme || "").toLowerCase() !== filterTheme.toLowerCase()) return false;
        if (filterDifficulty !== "All" && puzzle.difficulty !== filterDifficulty) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto p-8">
                <div className="text-center mb-8 space-y-4">
                    <h1 className="text-4xl font-bold text-primary">Explore Puzzles</h1>
                    <p className="text-xl text-gray-600">Discover your next challenge from our community collection.</p>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-600">Filter:</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-500">Pieces:</label>
                        <select
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                            value={filterPieces}
                            onChange={(e) => setFilterPieces(e.target.value)}
                        >
                            {PIECE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-500">Theme:</label>
                        <select
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                            value={filterTheme}
                            onChange={(e) => setFilterTheme(e.target.value)}
                        >
                            {THEME_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-500">Difficulty:</label>
                        <select
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-primary outline-none bg-white"
                            value={filterDifficulty}
                            onChange={(e) => setFilterDifficulty(e.target.value)}
                        >
                            {DIFFICULTY_OPTIONS.map(o => <option key={o} value={o}>{o === "All" ? "All" : o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                        </select>
                    </div>
                    {(filterPieces !== "All" || filterTheme !== "All" || filterDifficulty !== "All") && (
                        <button
                            onClick={() => { setFilterPieces("All"); setFilterTheme("All"); setFilterDifficulty("All"); }}
                            className="text-sm text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading puzzles...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filtered.map((puzzle) => (
                            <div
                                key={puzzle.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group flex flex-col"
                            >
                                <div className="h-48 bg-gray-100 relative overflow-hidden shrink-0">
                                    {puzzle.image_url && (puzzle.image_url.startsWith('http') || puzzle.image_url.startsWith('/')) ? (
                                        <img
                                            src={puzzle.image_url}
                                            alt={puzzle.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Upload className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-bold shadow-sm text-gray-700">
                                        {puzzle.pieces} pcs
                                    </div>
                                    {puzzle.difficulty && (
                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold shadow-sm text-white ${puzzle.difficulty === 'easy' ? 'bg-green-400' :
                                            puzzle.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                                            }`}>
                                            {puzzle.difficulty.toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-gray-800 truncate text-lg mb-1">{puzzle.name}</h3>
                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <span>{puzzle.theme}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${puzzle.condition === 'new' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {puzzle.condition}
                                        </span>
                                    </div>

                                    <div className="mt-auto">
                                        <a
                                            href={`/trade?wanted=${puzzle.id}`}
                                            className="block w-full text-center py-2.5 bg-secondary text-gray-900 font-bold rounded-lg hover:bg-green-300 transition-colors"
                                        >
                                            Start a Trade
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {filtered.length === 0 && !loading && (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <div className="text-4xl mb-4">🧩</div>
                                {inventory.length === 0 ? (
                                    <>
                                        <p className="text-gray-500 text-lg font-medium">No puzzles available yet</p>
                                        <p className="text-gray-400 mt-1">Be the first to donate one and start the swap!</p>
                                        <a href="/trade" className="inline-block mt-4 px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-red-400 transition-colors">
                                            Donate a Puzzle
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-500 text-lg font-medium">No puzzles match your filters</p>
                                        <p className="text-gray-400 mt-1">Try adjusting or clearing your filters.</p>
                                        <button
                                            onClick={() => { setFilterPieces("All"); setFilterTheme("All"); setFilterDifficulty("All"); }}
                                            className="inline-block mt-4 px-6 py-2.5 bg-primary text-white rounded-full font-bold hover:bg-red-400 transition-colors"
                                        >
                                            Clear Filters
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
