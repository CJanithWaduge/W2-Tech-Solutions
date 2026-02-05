'use client';

import { useEffect, useState, Suspense } from 'react';
import { FileText, Calendar, CheckCircle, Shield, Lock } from 'lucide-react';

function PrivacyContent() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/Privacy.json')
            .then((res) => res.json())
            .then((json) => {
                setData(json);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load privacy policy:', err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a192f]">
                <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return <div className="p-10 text-center text-red-500">Failed to load privacy policy.</div>;

    return (
        <div className="min-h-screen bg-[#0a192f] text-gray-300 selection:bg-[var(--accent)]/30 selection:text-[var(--accent)]">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/5 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[20%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10 max-w-4xl">
                {/* Header */}
                <div className="mb-16 text-center space-y-6">
                    <div className="inline-flex items-center justify-center p-3 bg-[var(--accent)]/10 rounded-2xl mb-4 text-[var(--accent)]">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                        {data.title}
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-mono bg-[#112240]/50 inline-block px-4 py-2 rounded-full border border-gray-800 mx-auto">
                        <Calendar size={14} className="text-[var(--accent)]" />
                        Effective Date: <span className="text-gray-300">{new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {data.intro}
                    </p>
                </div>

                {/* Content Cards */}
                <div className="space-y-8">
                    {data.sections.map((section: any, index: number) => (
                        <div
                            key={index}
                            className="p-8 rounded-3xl bg-[#112240]/30 border border-gray-800/50 hover:border-[var(--accent)]/30 transition-all duration-300 group"
                        >
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-[var(--accent)] text-sm font-black border border-gray-700 group-hover:bg-[var(--accent)] group-hover:text-[var(--primary)] transition-colors">
                                    {index + 1}
                                </span>
                                {section.title.replace(/^\d+\.\s*/, '')}
                            </h2>
                            <div className="text-gray-400 leading-relaxed whitespace-pre-wrap pl-11">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center p-8 rounded-3xl bg-gradient-to-br from-[#112240] to-transparent border border-gray-800/50">
                    <Shield size={32} className="text-[var(--accent)] mx-auto mb-4" />
                    <h3 className="text-white font-bold mb-2">Your Privacy Matters</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        We are committed to protecting your data. If you have any concerns, please reach out to us.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function PrivacyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a192f]"></div>}>
            <PrivacyContent />
        </Suspense>
    );
}
