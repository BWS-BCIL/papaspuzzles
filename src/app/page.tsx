import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="max-w-4xl space-y-10 animate-in fade-in zoom-in duration-500">
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
                        Join our community of puzzlers. Keep your kids challenged, creative, and screen-free
                        by swapping puzzles with other families.
                    </p>

                    <div className="pt-8 flex justify-center gap-4">
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
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
            </main>

            <footer className="py-8 text-center text-sm text-gray-400 bg-white border-t border-gray-100">
                <p>© {new Date().getFullYear()} Papa&apos;s Puzzles. Spreading joy one piece at a time.</p>
            </footer>
        </div>
    );
}
