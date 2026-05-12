"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Upload, Plus, X } from "lucide-react";

interface PuzzleForm {
    name: string;
    pieces: string;
    type: string;
    condition: string;
    image: string;
}

export default function DonateProgramPage() {
    const [step, setStep] = useState(1);
    const [userInfo, setUserInfo] = useState({ name: "", email: "" });
    const [puzzles, setPuzzles] = useState<PuzzleForm[]>([
        { name: "", pieces: "", type: "Animals", condition: "good", image: "" }
    ]);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const addPuzzle = () => {
        setPuzzles([...puzzles, { name: "", pieces: "", type: "Animals", condition: "good", image: "" }]);
    };

    const removePuzzle = (index: number) => {
        if (puzzles.length > 1) {
            setPuzzles(puzzles.filter((_, i) => i !== index));
        }
    };

    const updatePuzzle = (index: number, field: keyof PuzzleForm, value: string) => {
        const updated = [...puzzles];
        updated[index] = { ...updated[index], [field]: value };
        setPuzzles(updated);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (!e.target.files?.[0]) return;
        const formData = new FormData();
        formData.append("puzzlePhoto", e.target.files[0]);
        try {
            setUploading(true);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (data.imageUrl) updatePuzzle(index, "image", data.imageUrl);
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setUploading(false);
        }
    };

    const allPuzzlesValid = puzzles.every(p => p.name && p.pieces && p.image);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInfo.name || !userInfo.email) {
            setError("Please fill in your name and email");
            return;
        }
        if (!allPuzzlesValid) {
            setError("Please fill in all puzzle information and upload images");
            return;
        }

        setError("");
        setLoading(true);
        try {
            const res = await fetch("/api/bulk-donation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: userInfo.name,
                    userEmail: userInfo.email,
                    puzzles: puzzles.map(p => ({
                        name: p.name,
                        pieces: p.pieces,
                        type: p.type,
                        condition: p.condition,
                        image_url: p.image,
                    })),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit donation");
            setSubmitted(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
                    <CheckCircle className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-primary mb-2">Thank You!</h2>
                    <p className="text-gray-600 mb-6">
                        Your donation has been received and is pending admin review. We&apos;ll email you when your puzzles are approved and you&apos;ve earned your credits!
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

            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-10">
                {step === 1 ? (
                    <>
                        <h1 className="text-3xl font-bold text-primary mb-2">Donate Your Puzzles</h1>
                        <p className="text-gray-500 mb-8">Help us build our community puzzle library. Share your completed puzzles!</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="John Doe"
                                    value={userInfo.name}
                                    onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                    placeholder="john@example.com"
                                    value={userInfo.email}
                                    onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                />
                            </div>
                            <button
                                onClick={() => setStep(2)}
                                disabled={!userInfo.name || !userInfo.email}
                                className="w-full py-3 bg-primary text-white rounded-full font-bold hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Add Puzzles
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-3xl font-bold text-primary">Add Your Puzzles</h1>
                                <p className="text-sm text-gray-500">You have {puzzles.length} puzzle{puzzles.length !== 1 ? "s" : ""}</p>
                            </div>
                            <p className="text-gray-500">Add as many puzzles as you want! Click "+Add Puzzle" to add more.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6 mb-8">
                            {puzzles.map((puzzle, index) => (
                                <div key={index} className="border border-gray-100 rounded-xl p-6 space-y-4 relative">
                                    {puzzles.length > 1 && (
                                        <button
                                            onClick={() => removePuzzle(index)}
                                            className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                                            title="Remove puzzle"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                    
                                    <h3 className="font-semibold text-gray-700">Puzzle {index + 1}</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Puzzle Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="e.g. Golden Gate Bridge"
                                            value={puzzle.name}
                                            onChange={(e) => updatePuzzle(index, "name", e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                            <select
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                                                value={puzzle.type}
                                                onChange={(e) => updatePuzzle(index, "type", e.target.value)}
                                            >
                                                <option value="Animals">Animals</option>
                                                <option value="Landscape">Landscape</option>
                                                <option value="Art">Art</option>
                                                <option value="Food">Food</option>
                                                <option value="Cityscape">Cityscape</option>
                                                <option value="Movies">Movies</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Pieces</label>
                                            <select
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                                                value={puzzle.pieces}
                                                onChange={(e) => updatePuzzle(index, "pieces", e.target.value)}
                                            >
                                                <option value="">Select...</option>
                                                <option value="100">100</option>
                                                <option value="300">300</option>
                                                <option value="500">500</option>
                                                <option value="1000">1000</option>
                                                <option value="2000+">2000+</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                                        <select
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                                            value={puzzle.condition}
                                            onChange={(e) => updatePuzzle(index, "condition", e.target.value)}
                                        >
                                            <option value="new">New / Like New</option>
                                            <option value="good">Good (All pieces)</option>
                                            <option value="fair">Fair (Box worn)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, index)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            {uploading ? (
                                                <span className="text-gray-500">Uploading...</span>
                                            ) : puzzle.image ? (
                                                <div className="relative h-32 w-full">
                                                    <img src={puzzle.image} alt="Preview" className="h-full w-full object-contain" />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center text-gray-500">
                                                    <Upload className="w-8 h-8 mb-2" />
                                                    <span>Click to upload photo</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addPuzzle}
                            className="w-full py-3 border-2 border-dashed border-secondary text-secondary rounded-full font-bold hover:bg-secondary/10 transition-colors mb-6 flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Puzzle
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!allPuzzlesValid || loading}
                                className="flex-1 py-3 bg-secondary text-gray-800 rounded-full font-bold hover:bg-green-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Submitting..." : "Submit Donation"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
