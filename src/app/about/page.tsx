import Navbar from "@/components/Navbar";
import { Heart, Smile, Zap, Puzzle } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-4xl mx-auto p-8 space-y-16">
                {/* Header */}
                <section className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-primary">About Us</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Inspiring connection, creativity, and fun — one piece at a time!
                    </p>
                </section>

                {/* Mission */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-secondary-dark mb-4 text-gray-800">Mission Statement</h2>
                    <p className="text-gray-600 leading-relaxed">
                        At Papa’s Puzzles, we strive to develop a joyful trading system where one can trade in used puzzles and receive exciting new ones!
                        Papa’s Puzzles is developing a trading marketplace, where used puzzles can be traded to new puzzlers, while also providing various
                        charities the opportunity to expand their supply – hopefully bringing a smile to someone else’s face. Not only are puzzles amazing to do,
                        they help build problem-solving skills, stress management, and can bring people together.
                    </p>
                </section>

                {/* Values */}
                <section>
                    <h2 className="text-3xl font-bold text-center mb-10 text-primary">Our Values</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
                            <div className="flex items-center gap-2 mb-3">
                                <Smile className="w-6 h-6 text-primary" />
                                <h3 className="text-xl font-bold text-gray-800">JOY</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                WE BELIEVE THAT EVERYTHING IN LIFE SHOULD HAVE JOY IN IT. WHETHER IT IS HANGING OUT WITH A FRIEND OR CLICKING SUBMIT ON THE PUZZLE FORM,
                                WE HOPE THAT EXCHANGING AT PAPA’S PUZZLES WILL BRING A SMILE TO YOUR FACE.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-secondary">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="w-6 h-6 text-secondary" />
                                <h3 className="text-xl font-bold text-gray-800">EXCITEMENT</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                WITH EVERY NEW TRADE YOU EXPERIENCE A CERTAIN THRILL OF RECEIVING A NEW CHALLENGE. OUR OBJECTIVE IS TO HAVE A SURPRISE EVERY TIME YOU OPEN A PAPA’S PUZZLES BOX.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
                            <div className="flex items-center gap-2 mb-3">
                                <Heart className="w-6 h-6 text-accent" />
                                <h3 className="text-xl font-bold text-gray-800">UPLIFT</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                WE VALUE THE POWER OF GIVING TO EVERYBODY. EVERY PUZZLE DONATION WILL BE REPURPOSED TO A CHARITY THAT STRIVES TO HELP PEOPLE. WE HOPE TO INCLUDE EVERYBODY WHO SHARES THE SAME JOYS.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-200">
                            <div className="flex items-center gap-2 mb-3">
                                <Puzzle className="w-6 h-6 text-yellow-400" />
                                <h3 className="text-xl font-bold text-gray-800">INNOVATIVE</h3>
                            </div>
                            <p className="text-gray-600 text-sm">
                                WE REIMAGINED THE PUZZLE LIFECYCLE THROUGH OUR TRADING SYSTEM. WE HOPE TO PROMOTE A FUN AND ACCESSIBLE ACTIVITY TO ALL.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Story */}
                <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold text-secondary-dark mb-6 text-gray-800">Our Story</h2>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-primary mb-2">MEMORIES</h3>
                            <p className="text-gray-600 leading-relaxed">
                                BERKELEY KATZ, OUR FOUNDER, HAS ALWAYS ENJOYED DOING PUZZLES. SHE GOES TO OREGON EVERY YEAR WHERE SHE ENJOYS BEAUTIFUL VIEWS AND EARLY MORNINGS WORKING ON PUZZLES WITH HER GRANDPA, WHO ALSO SHARES THIS PASSION. SINCE THEN, SHE HAS BEEN ORDERING PUZZLES AND HAD THE PROBLEM OF NOT KNOWING WHAT TO DO ONCE SHE HAS COMPLETED THEM. SHE COULD EITHER LET THEM SIT AROUND OR RECYCLE THEM FOR A BETTER CAUSE.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-primary mb-2">HOW IT ALL STARTED</h3>
                            <p className="text-gray-600 leading-relaxed">
                                BERKELEY BEGAN TO HAVE WHAT ALMOST SEEMED LIKE AN OBSESSION WITH PUZZLES. EVERY SPARE MINUTE WOULD BE HER ENJOYING ONE. SHE REALIZED THAT ONCE SHE FINISHED ONE IT WOULD JUST LAY AROUND, SO SHE WANTED TO BE ABLE TO UPCYCLE WHILE STILL BEING ABLE TO RECEIVE NEW PUZZLES! ONCE SHE INITIATED THE IDEA, THERE WAS NOTHING HOLDING HER BACK. EVER SINCE THEN, SHE HAS BEEN SO EXCITED FOR NEW PEOPLE TO EXPERIENCE THE JOY AND EXCITEMENT PAPA&apos;S PUZZLES BRING.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
