"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Search, Upload } from "lucide-react";

export default function ExplorePage() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto p-8">
                <div className="text-center mb-12 space-y-4">
                    <h1 className="text-4xl font-bold text-primary">Explore Puzzles</h1>
                    <p className="text-xl text-gray-600">Discover your next challenge from our community collection.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">Loading puzzles...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {inventory.map((puzzle) => (
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
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                                                // We can render the fallback icon by manipulating the parent or simple hide logic 
                                                // but for React usually we'd want state. 
                                                // For simplicity in this list, we'll just hide the broken image and let the container background show,
                                                // or better yet, we can use a small inline component or state if we wanted to be perfect.
                                                // Given the constraint of 'keep it simple', let's rely on the conditional above primarily,
                                                // and for runtime errors just hide the bad image.
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Upload className="w-10 h-10" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-bold shadow-sm text-gray-700">
                                        {puzzle.pieces} pcs
                                    </div>
                                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold shadow-sm text-white ${puzzle.difficulty === 'easy' ? 'bg-green-400' :
                                        puzzle.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                                        }`}>
                                        {puzzle.difficulty.toUpperCase()}
                                    </div>
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
                                            Request Trade
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {inventory.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <p className="text-gray-500 text-lg">No puzzles available right now.</p>
                                <p className="text-gray-400">Be the first to donate one!</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
