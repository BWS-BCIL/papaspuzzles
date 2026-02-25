"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Search, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const { user, loading, signInWithGoogle, signOut } = useAuth();

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                                <Image
                                    src="/logo.png"
                                    alt="Papa's Puzzles Logo"
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                            <span className="text-xl font-bold text-primary">Papa's Puzzles</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/explore" className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center gap-1">
                            <Search className="w-4 h-4" />
                            Explore
                        </Link>
                        <Link href="/about" className="text-gray-600 hover:text-primary font-medium transition-colors">
                            About Us
                        </Link>
                        <Link href="/my-trades" className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center gap-1">
                            <User className="w-4 h-4" />
                            My Trades
                        </Link>
                        <Link
                            href="/trade"
                            className="bg-primary text-white px-4 py-2 rounded-full font-bold hover:bg-red-400 transition-colors shadow-sm"
                        >
                            Start a Trade
                        </Link>

                        {!loading && (
                            user ? (
                                <div className="flex items-center gap-2">
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={user.displayName || "User"}
                                            className="w-8 h-8 rounded-full border-2 border-primary"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                                            {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <button
                                        onClick={signOut}
                                        className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center gap-1"
                                        title="Sign Out"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">Sign Out</span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={signInWithGoogle}
                                    className="text-gray-600 hover:text-primary font-medium transition-colors flex items-center gap-1"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span className="hidden sm:inline">Sign In</span>
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
