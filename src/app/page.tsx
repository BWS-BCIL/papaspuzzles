import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col items-center p-8 text-center">
                <div className="max-w-4xl w-full space-y-10 animate-in fade-in zoom-in duration-500 pt-12">
                    <div className="flex justify-center mb-6">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                            <Image
                                src="/logo.png"
                                alt="Papa's Puzzles Logo"
                                fill
                                className="object-cover object-center scale-[1.6]"
                                priority
                            />
                        </div>
                    </div>

                    <h1 className="text-6xl font-extrabold tracking-tight text-primary drop-shadow-sm">
                        Papa&apos;s Puzzles
                    </h1>

                    <h2 className="text-3xl font-semibold text-secondary-dark max-w-2xl mx-auto leading-relaxed">
                        Trade your old puzzles for exciting new ones!
                    </h2>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Join our community of puzzlers. Swap completed puzzles for fresh challenges — and help us
                        bring joy to charities along the way. Puzzles build problem-solving skills, ease stress,
                        and bring people together.
                    </p>

                    <div className="pt-4 flex flex-wrap justify-center gap-4">
                        <Link
                            href="/trade"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-full text-2xl font-bold hover:bg-red-400 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                        >
                            Start a Trade <ArrowRight className="w-8 h-8" />
                        </Link>
                        <Link
                            href="/explore"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-primary border-2 border-primary rounded-full text-2xl font-bold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Explore Puzzles
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 text-left">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">1. Donate</h3>
                            <p className="text-gray-600">List a puzzle you&apos;ve completed and are ready to pass on.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">2. Choose</h3>
                            <p className="text-gray-600">Browse our inventory and pick a new challenge for yourself.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">3. Swap</h3>
                            <p className="text-gray-600">We&apos;ll coordinate the exchange so everyone gets a new puzzle!</p>
                        </div>
                    </div>
                </div>

                {/* Our Mission */}
                <div className="max-w-4xl w-full mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            At Papa&apos;s Puzzles, we strive to develop a joyful trading system where one can
                            trade in used puzzles and receive exciting new ones! We&apos;re building a trading
                            marketplace where used puzzles reach new puzzlers, while also giving various charities
                            the opportunity to expand their supply — hopefully bringing a smile to someone else&apos;s face.
                        </p>
                    </div>

                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-primary mb-4">Memories</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Berkeley Katz, our founder, has always enjoyed doing puzzles. She goes to Oregon every
                            year where she enjoys beautiful views and early mornings working on puzzles with her
                            grandpa, who also shares this passion. Since then, she&apos;s been ordering puzzles and had
                            the problem of not knowing what to do once she finished them.
                        </p>
                    </div>

                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-primary mb-4">How It Started</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Berkeley began to have what almost seemed like an obsession with puzzles — every spare
                            minute would be her enjoying one. She realized that once she finished one it would just
                            lay around, so she wanted to upcycle while still being able to receive new puzzles!
                            Once she initiated the idea, there was nothing holding her back.
                        </p>
                        <Link href="/about" className="inline-flex items-center gap-1 mt-4 text-primary font-semibold hover:underline">
                            Read more <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="mt-20 py-8 text-center text-sm text-gray-400 bg-white border-t border-gray-100">
                <p>© {new Date().getFullYear()} Papa&apos;s Puzzles. Spreading joy one piece at a time.</p>
            </footer>
        </div>
    );
}
