import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                <h1 className="text-8xl font-extrabold text-primary">404</h1>
                <h2 className="text-2xl font-bold text-gray-700">Page Not Found</h2>
                <p className="text-gray-500 max-w-sm">
                    That puzzle piece doesn&apos;t fit here. Let&apos;s get you back to the box.
                </p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-red-400 transition-colors shadow-md"
                >
                    Back to Home
                </Link>
            </main>
        </div>
    );
}
