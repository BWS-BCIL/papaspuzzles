"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Search, Package, ArrowRight } from "lucide-react";

export default function MyTradesPage() {
    const [email, setEmail] = useState("");
    const [trades, setTrades] = useState<any[]>([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/my-trades?email=${encodeURIComponent(email)}`);
            const data = await res.json();
            setTrades(data.data || []);
            setSearched(true);
        } catch (err) {
            console.error("Failed to fetch trades", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-4xl mx-auto p-8">
                <h1 className="text-3xl font-bold text-primary mb-8">My Trades</h1>

                {/* Search Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enter your email to find your trades</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="self-end px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-red-400 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Searching..." : "Find Trades"}
                        </button>
                    </form>
                </div>

                {/* Results Section */}
                {searched && (
                    <div className="space-y-6">
                        {trades.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">No trades found for this email.</p>
                            </div>
                        ) : (
                            trades.map((trade) => (
                                <div key={trade.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex flex-col md:flex-row items-center gap-6">
                                        {/* Given */}
                                        <div className="flex-1 text-center md:text-left">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">You Gave</span>
                                            <h3 className="text-lg font-bold text-gray-800 mt-1">{trade.given_name}</h3>
                                            <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-2">
                                                Donated
                                            </span>
                                        </div>

                                        <ArrowRight className="w-6 h-6 text-gray-300 rotate-90 md:rotate-0" />

                                        {/* Received */}
                                        <div className="flex-1 text-center md:text-right">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">You Received</span>
                                            <div className="flex flex-col items-center md:items-end mt-1">
                                                <h3 className="text-lg font-bold text-gray-800">{trade.received_name}</h3>
                                                {trade.received_image && (
                                                    <img
                                                        src={trade.received_image}
                                                        alt={trade.received_name}
                                                        className="w-20 h-20 object-cover rounded-lg mt-2 border border-gray-200"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                                        <span className="text-gray-500">
                                            Trade ID: #{trade.id}
                                        </span>
                                        <span className={`font-medium ${trade.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                            Status: {trade.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
