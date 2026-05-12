import Link from "next/link";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { ArrowRight, Gift } from "lucide-react";

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

                    <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/donate-program"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-secondary text-gray-800 rounded-full text-lg font-bold hover:bg-green-300 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                        >
                            <Gift className="w-6 h-6" />
                            Donate Now
                        </Link>
                        <Link
                            href="/trade"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-primary text-white rounded-full text-lg font-bold hover:bg-red-400 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
                        >
                            Start a Trade <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-left">
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">1. Donate</h3>
                            <p className="text-gray-600">List one or more puzzles you&apos;ve completed and earn credits for your account.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">2. Earn</h3>
                            <p className="text-gray-600">First-timers: 2 puzzles = 1 credit. Returning donors: 1 puzzle = 1 credit.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">3. Redeem</h3>
                            <p className="text-gray-600">Use your credits to pick puzzles from our inventory anytime!</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-secondary/20 to-primary/20 p-8 rounded-2xl border-2 border-secondary/50">
                        <h3 className="text-2xl font-bold text-primary mb-4">✨ How Credits Work</h3>
                        <div className="grid grid-cols-2 gap-8 text-left max-w-xl mx-auto">
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-2">FIRST-TIME DONOR</p>
                                <p className="text-lg font-bold text-primary">2 puzzles → 1 credit</p>
                                <p className="text-xs text-gray-500 mt-1">Helps us build our library!</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-600 mb-2">RETURNING DONOR</p>
                                <p className="text-lg font-bold text-primary">1 puzzle → 1 credit</p>
                                <p className="text-xs text-gray-500 mt-1">We appreciate your loyalty!</p>
                            </div>
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
