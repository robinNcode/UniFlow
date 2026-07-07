import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Clock, Trophy, CreditCard, Download } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="space-y-16 -mt-2 animate-fade-in">
            {/* Hero Section */}
            <div className="grid md:grid-cols-2 gap-10 items-center pt-6 md:pt-14">
                <div>
                    <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                        Combined Admission Cycle 2026
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
                        One seat. One deadline.<br className="hidden sm:block" /> Zero guesswork.
                    </h1>
                    <p className="text-slate-500 mt-4 text-base lg:text-lg leading-relaxed max-w-lg">
                        Apply, reserve your seat, pay, and track your live merit rank — all in one place,
                        built to stay accurate even when thousands of applicants log in at once.
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <Link to="/register">
                            <Button size="lg" className="px-6 font-semibold">
                                Get Started
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button variant="secondary" size="lg" className="px-6 font-semibold text-slate-700">
                                I already have an account
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6 mt-8 text-xs text-slate-400">
                        <span>
                            <span className="font-bold text-slate-700 text-sm">4,820</span> applicants tracked live
                        </span>
                        <span>
                            <span className="font-bold text-slate-700 text-sm">37</span> partner programs
                        </span>
                    </div>
                </div>

                {/* Live seat grid card */}
                <Card className="p-6 lg:p-8 bg-white border-slate-200 hover:shadow-md transition-shadow">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                        General Quota — CSE, University of Dhaka
                    </p>
                    <div className="grid grid-cols-10 gap-1.5 sm:gap-2 mb-5">
                        {Array.from({ length: 60 }).map((_, i) => (
                            <div
                                key={i}
                                className={`aspect-square rounded-sm ${i < 46 ? 'bg-primary' : 'bg-slate-200'}`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 pt-3 border-t border-slate-100">
                        <span>46 of 60 seats filled</span>
                        <span className="flex items-center gap-1.5 text-success">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                            Live
                        </span>
                    </div>
                </Card>
            </div>

            {/* Feature Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-12">
                {[
                    {
                        Icon: Clock,
                        title: 'Seat Reservation',
                        desc: 'Hold your seat under quota rules with a transparent, time-boxed reservation window.',
                    },
                    {
                        Icon: Trophy,
                        title: 'Live Merit List',
                        desc: 'Track your exact rank as it updates — not a static snapshot from yesterday.',
                    },
                    {
                        Icon: CreditCard,
                        title: 'Verified Payment',
                        desc: 'Pay via bKash, Nagad, or Rocket with confirmation you can actually trust.',
                    },
                    {
                        Icon: Download,
                        title: 'Instant Admit Card',
                        desc: 'Download your admit card the moment it\'s generated — no office visit required.',
                    },
                ].map(({ Icon, title, desc }) => (
                    <Card key={title} className="p-5 md:p-6 hover:shadow-md transition-shadow">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <p className="font-semibold text-sm md:text-base mb-1.5 text-slate-900">{title}</p>
                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{desc}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
