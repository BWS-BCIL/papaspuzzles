"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function DonatePage() {
    const [formData, setFormData] = useState({
        name: "",
        pieces: "",
        difficulty: "medium",
        theme: "",
        condition: "good",
        email: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("/api/donations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to submit donation");

            setSubmitted(true);
        } catch {
            setError("Something went wrong. Please try again.");
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary mb-2">Thank You!</h2>
                    <p className="text-gray-600 mb-6">
                        Your puzzle donation has been recorded. We&apos;ll contact you when we find a match!
                    </p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-red-400 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-8">
            <Link href="/" className="inline-flex items-center text-gray-500 hover:text-primary mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
            </Link>

            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
                <h1 className="text-3xl font-bold text-primary mb-2">Donate a Puzzle</h1>
                <p className="text-gray-500 mb-8">Share the joy of puzzling with another family.</p>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Puzzle Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Solar System Puzzle"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Pieces</label>
                            <input
                                type="number"
                                name="pieces"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="e.g. 500"
                                value={formData.pieces}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                            <select
                                name="difficulty"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                value={formData.difficulty}
                                onChange={handleChange}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theme (Optional)</label>
                        <input
                            type="text"
                            name="theme"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="e.g. Animals, Space, Landscape"
                            value={formData.theme}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                        <select
                            name="condition"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            value={formData.condition}
                            onChange={handleChange}
                        >
                            <option value="new">Like New</option>
                            <option value="good">Good (All pieces)</option>
                            <option value="fair">Fair (Box worn)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-primary text-white rounded-full font-bold hover:bg-red-400 transition-colors shadow-md hover:shadow-lg"
                    >
                        Submit Donation
                    </button>
                </form>
            </div>
        </div>
    );
}
