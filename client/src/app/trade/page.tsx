"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { CheckCircle, Upload, ArrowRight, ArrowLeft } from "lucide-react";

export default function TradePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <TradeForm />
        </Suspense>
    );
}

function TradeForm() {
    const searchParams = useSearchParams();
    const wantedId = searchParams.get("wanted");

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [inventory, setInventory] = useState<any[]>([]);

    // Form State
    const [userInfo, setUserInfo] = useState({ name: "", email: "" });
    const [donationInfo, setDonationInfo] = useState({
        name: "", pieces: "", type: "Animals", condition: "good", image: ""
    });
    const [selectedPuzzleId, setSelectedPuzzleId] = useState<string | null>(wantedId || null);

    // Fetch inventory when reaching step 3
    useEffect(() => {
        if (step === 3) {
            fetchInventory();
        }
    }, [step]);

    const fetchInventory = async () => {
        try {
            const res = await fetch("/api/inventory", { cache: "no-store" });
            const data = await res.json();
            setInventory(data.data || []);
        } catch (err) {
            console.error("Failed to load inventory", err);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const formData = new FormData();
        formData.append("puzzlePhoto", e.target.files[0]);

        try {
            setLoading(true);
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.imageUrl) {
                setDonationInfo({ ...donationInfo, image: data.imageUrl });
            }
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitTrade = async () => {
        if (!selectedPuzzleId) return;

        setLoading(true);
        try {
            const res = await fetch("/api/trade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: userInfo.name,
                    userEmail: userInfo.email,
                    donationName: donationInfo.name,
                    donationPieces: donationInfo.pieces,
                    donationType: donationInfo.type,
                    donationCondition: donationInfo.condition,
                    donationImage: donationInfo.image,
                    wantedPuzzleId: selectedPuzzleId
                }),
            });

            if (res.ok) {
                setStep(4); // Success Step
            }
        } catch (err) {
            console.error("Trade failed", err);
        } finally {
            setLoading(false);
        }
    };

    // Render Steps
    const renderStep1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-800">Step 1: About You</h2>
            <div className="space-y-4">
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
            </div>
            <button
                onClick={() => setStep(2)}
                disabled={!userInfo.name || !userInfo.email}
                className="w-full py-3 bg-primary text-white rounded-full font-bold hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                Next Step <ArrowRight className="w-4 h-4" />
            </button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-800">Step 2: Your Donation</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Puzzle Name</label>
                    <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                        placeholder="e.g. Golden Gate Bridge"
                        value={donationInfo.name}
                        onChange={(e) => setDonationInfo({ ...donationInfo, name: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                            value={donationInfo.type}
                            onChange={(e) => setDonationInfo({ ...donationInfo, type: e.target.value })}
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
                            value={donationInfo.pieces}
                            onChange={(e) => setDonationInfo({ ...donationInfo, pieces: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Photo</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {loading ? (
                            <span className="text-gray-500">Uploading...</span>
                        ) : donationInfo.image ? (
                            <div className="relative h-32 w-full">
                                <img src={donationInfo.image} alt="Preview" className="h-full w-full object-contain" />
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

            <div className="flex gap-3">
                <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={() => setStep(3)}
                    disabled={!donationInfo.name || !donationInfo.pieces || !donationInfo.image}
                    className="flex-[2] py-3 bg-primary text-white rounded-full font-bold hover:bg-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    Next Step <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-800">Step 3: Choose a Puzzle</h2>
            <p className="text-gray-500">Select a puzzle from our inventory to complete your trade.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {inventory.map((puzzle) => (
                    <div
                        key={puzzle.id}
                        onClick={() => setSelectedPuzzleId(puzzle.id)}
                        className={`cursor-pointer border-2 rounded-xl overflow-hidden transition-all hover:shadow-md ${selectedPuzzleId === puzzle.id ? 'border-primary ring-2 ring-primary ring-opacity-50' : 'border-gray-100'
                            }`}
                    >
                        <div className="h-40 bg-gray-100 relative">
                            {puzzle.image_url ? (
                                <img src={puzzle.image_url} alt={puzzle.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Upload className="w-8 h-8" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                {puzzle.pieces} pcs
                            </div>
                        </div>
                        <div className="p-3">
                            <h3 className="font-bold text-gray-800 truncate">{puzzle.name}</h3>
                            <p className="text-sm text-gray-500">{puzzle.theme} • {puzzle.difficulty}</p>
                        </div>
                    </div>
                ))}
                {inventory.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400 bg-gray-50 rounded-xl">
                        No puzzles available right now. Check back later!
                    </div>
                )}
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmitTrade}
                    disabled={!selectedPuzzleId || loading}
                    className="flex-[2] py-3 bg-secondary text-gray-800 rounded-full font-bold hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                    {loading ? "Processing..." : "Confirm Trade"}
                </button>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center space-y-6 py-12 animate-in zoom-in duration-300">
            <div className="flex justify-center">
                <CheckCircle className="w-24 h-24 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-primary">Trade Submitted!</h2>
            <p className="text-gray-600 max-w-md mx-auto">
                Thank you for trading with Papa's Puzzles! We have received your request.
                Please check your email for shipping instructions for your donation.
            </p>
            <div className="pt-6">
                <a
                    href="/my-trades"
                    className="inline-block px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-red-400 transition-colors shadow-lg"
                >
                    View My Trades
                </a>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-3xl mx-auto p-4 sm:p-8">
                <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 min-h-[600px]">
                    {/* Progress Bar */}
                    {step < 4 && (
                        <div className="flex justify-between mb-8 relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 rounded-full" />
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    {s}
                                </div>
                            ))}
                        </div>
                    )}

                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderSuccess()}
                </div>
            </main>
        </div>
    );
}
