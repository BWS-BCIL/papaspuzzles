"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Package, Search, Check, X, Trash2, Edit } from "lucide-react";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("donations");

    const [donations, setDonations] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Edit Mode State
    const [editingId, setEditingId] = useState<number | null>(null);

    const [newPuzzle, setNewPuzzle] = useState({
        name: "",
        pieces: "",
        difficulty: "medium",
        theme: "landscape",
        condition: "good",
        email: "admin@papaspuzzles.co", // Default admin email
    });
    const [uploading, setUploading] = useState(false);
    const [puzzlePhoto, setPuzzlePhoto] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null); // For editing w/o new photo

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (data.success) {
                setIsAuthenticated(true);
                fetchData();
            } else {
                setError("Invalid password");
            }
        } catch (err) {
            setError("Login failed");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [donationsRes, requestsRes] = await Promise.all([
                fetch("/api/admin/donations", { cache: "no-store" }),
                fetch("/api/admin/requests", { cache: "no-store" })
            ]);

            const donationsData = await donationsRes.json();
            const requestsData = await requestsRes.json();

            setDonations(donationsData.data || []);
            setRequests(requestsData.data || []);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const markFulfilled = async (id: number) => {
        try {
            await fetch(`/api/admin/requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "confirmed" }),
            });
            // Refresh data
            fetchData();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this puzzle? This action cannot be undone.")) return;

        try {
            const res = await fetch(`/api/admin/donations/${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setDonations(prev => prev.filter(d => d.id !== id));
            } else {
                alert("Failed to delete puzzle");
            }
        } catch (err) {
            console.error("Failed to delete", err);
            alert("Error deleting puzzle");
        }
    };

    const handleEdit = (puzzle: any) => {
        setEditingId(puzzle.id);
        setNewPuzzle({
            name: puzzle.name,
            pieces: puzzle.pieces,
            difficulty: puzzle.difficulty || "medium",
            theme: puzzle.theme || "landscape",
            condition: puzzle.condition || "good",
            email: puzzle.email || "admin@papaspuzzles.co",
        });
        setCurrentImageUrl(puzzle.image_url);
        setPuzzlePhoto(null); // Reset new photo input
        setActiveTab("add-inventory");
    };

    const resetForm = () => {
        setNewPuzzle({
            name: "",
            pieces: "",
            difficulty: "medium",
            theme: "landscape",
            condition: "good",
            email: "admin@papaspuzzles.co",
        });
        setPuzzlePhoto(null);
        setCurrentImageUrl(null);
        setEditingId(null);
    };

    const handleSaveInventory = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation: New items need a photo. Edits can use existing one.
        if (!editingId && !puzzlePhoto) return alert("Please select an image");

        setUploading(true);
        try {
            let imageUrl = currentImageUrl;

            // 1. Upload Image (if new one selected)
            if (puzzlePhoto) {
                const formData = new FormData();
                formData.append('puzzlePhoto', puzzlePhoto);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });
                const uploadData = await uploadRes.json();

                if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');
                imageUrl = uploadData.imageUrl;
            }

            // 2. Submit Data (Create or Update)
            const payload = {
                ...newPuzzle,
                image_url: imageUrl
            };

            let res;
            if (editingId) {
                // UPDATE
                res = await fetch(`/api/admin/donations/${editingId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } else {
                // CREATE
                res = await fetch('/api/admin/inventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) throw new Error(editingId ? 'Failed to update' : 'Failed to add');

            alert(editingId ? "Puzzle updated successfully!" : "Inventory added successfully!");

            resetForm();
            setActiveTab("donations");
            fetchData();

        } catch (err: any) {
            console.error(err);
            alert("Error: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 p-4 rounded-full">
                            <Lock className="w-8 h-8 text-gray-500" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center mb-6">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-2 bg-gray-800 text-white rounded-lg font-bold hover:bg-gray-700 transition-colors"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link href="/" className="text-sm text-gray-500 hover:underline">Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    const pendingRequestsCount = requests.filter(r => r.status !== 'confirmed').length;

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Puzzle Swap Admin</h1>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-sm text-red-500 hover:underline"
                >
                    Logout
                </button>
            </nav>

            <main className="max-w-6xl mx-auto p-6">
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => { setActiveTab("donations"); resetForm(); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === "donations"
                            ? "bg-primary text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Package className="w-5 h-5" />
                        Donations ({donations.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab("requests"); resetForm(); }}
                        className={`relative flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === "requests"
                            ? "bg-secondary text-gray-800 shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Search className="w-5 h-5" />
                        Requests ({requests.length})
                        {pendingRequestsCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm animate-pulse">
                                {pendingRequestsCount} new
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => { setActiveTab("add-inventory"); resetForm(); }}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${activeTab === "add-inventory"
                            ? "bg-green-600 text-white shadow-md"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        <Package className="w-5 h-5" />
                        {editingId ? "Edit Inventory" : "Add Inventory"}
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading data...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        {activeTab === "donations" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Pieces</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Condition</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Contact</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {donations.map((d) => (
                                            <tr key={d.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{d.name}</td>
                                                <td className="px-6 py-4 text-gray-500">{d.pieces}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.condition === 'new' ? 'bg-green-100 text-green-700' :
                                                        d.condition === 'good' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {d.condition}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{d.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${d.status === 'available' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {d.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-400 text-sm flex items-center gap-2">
                                                    {new Date(d.created_at).toLocaleDateString()}
                                                    <button
                                                        onClick={() => handleEdit(d)}
                                                        className="text-blue-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-50 rounded"
                                                        title="Edit Puzzle"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(d.id)}
                                                        className="text-red-400 hover:text-red-600 transition-colors p-1 hover:bg-red-50 rounded"
                                                        title="Delete Puzzle"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {donations.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                                    No donations yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "requests" && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Type/Theme</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Pieces</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Difficulty</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Contact</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {requests.map((r) => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{r.type}</td>
                                                <td className="px-6 py-4 text-gray-500">{r.pieces}</td>
                                                <td className="px-6 py-4 text-gray-500 capitalize">{r.difficulty}</td>
                                                <td className="px-6 py-4 text-gray-500">{r.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {r.status || 'pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {r.status !== 'confirmed' && (
                                                        <button
                                                            onClick={() => markFulfilled(r.id)}
                                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium flex items-center gap-1 shadow-sm transition-colors"
                                                        >
                                                            <Check className="w-3 h-3" /> Accept Request
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {requests.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                                                    No requests yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === "add-inventory" && (
                            <div className="p-8 max-w-2xl mx-auto">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">
                                    {editingId ? "Edit Puzzle" : "Add New Inventory"}
                                </h2>
                                <form onSubmit={handleSaveInventory} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Puzzle Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                            value={newPuzzle.name}
                                            onChange={(e) => setNewPuzzle({ ...newPuzzle, name: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pieces</label>
                                            <input
                                                required
                                                type="number"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                                value={newPuzzle.pieces}
                                                onChange={(e) => setNewPuzzle({ ...newPuzzle, pieces: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                                            <select
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                                value={newPuzzle.theme}
                                                onChange={(e) => setNewPuzzle({ ...newPuzzle, theme: e.target.value })}
                                            >
                                                <option value="landscape">Landscape</option>
                                                <option value="art">Art</option>
                                                <option value="animals">Animals</option>
                                                <option value="food">Food</option>
                                                <option value="cityscape">Cityscape</option>
                                                <option value="gradient">Gradient</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="puzzle-photo"
                                                onChange={(e) => setPuzzlePhoto(e.target.files?.[0] || null)}
                                            />
                                            <label htmlFor="puzzle-photo" className="cursor-pointer">
                                                {puzzlePhoto ? (
                                                    <div className="relative h-48 w-full">
                                                        <img
                                                            src={URL.createObjectURL(puzzlePhoto)}
                                                            alt="Preview"
                                                            className="h-full w-full object-contain mx-auto"
                                                        />
                                                        <div className="text-center mt-2 text-primary font-medium">{puzzlePhoto.name}</div>
                                                    </div>
                                                ) : currentImageUrl ? (
                                                    <div className="relative h-48 w-full group">
                                                        <img
                                                            src={currentImageUrl}
                                                            alt="Current"
                                                            className="h-full w-full object-contain mx-auto opacity-80 group-hover:opacity-100 transition-opacity"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                                            <span className="text-white font-medium">Click to change</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500 py-8">
                                                        <span className="text-primary font-medium">Click to upload</span> or drag and drop
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        {editingId && (
                                            <button
                                                type="button"
                                                onClick={() => { resetForm(); setActiveTab("donations"); }}
                                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="flex-1 py-3 bg-primary text-white rounded-lg font-bold hover:bg-red-400 transition-colors disabled:opacity-50"
                                        >
                                            {uploading ? "Saving..." : editingId ? "Save Changes" : "Add to Inventory"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
