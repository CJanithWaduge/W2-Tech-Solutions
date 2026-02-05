'use client';

import { useState, useEffect } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function TermsNotification() {
    const [isVisible, setIsVisible] = useState(false);
    const [termsVersion, setTermsVersion] = useState<string | null>(null);

    useEffect(() => {
        const checkTerms = async () => {
            try {
                const res = await fetch('/terms.json');
                if (!res.ok) return;

                const data = await res.json();
                const serverVersion = data.lastUpdated;
                const localVersion = localStorage.getItem('terms_accepted_version');

                if (serverVersion && serverVersion !== localVersion) {
                    setTermsVersion(serverVersion);
                    // Small delay to not be jarring on load
                    setTimeout(() => setIsVisible(true), 1500);
                }
            } catch (error) {
                console.error('Failed to check terms version:', error);
            }
        };

        checkTerms();
    }, []);

    const handleDismiss = () => {
        if (termsVersion) {
            localStorage.setItem('terms_accepted_version', termsVersion);
            setIsVisible(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-[#112240] border border-[var(--accent)]/30 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md">
                <div className="p-1 bg-gradient-to-r from-[var(--accent)] to-blue-500 opacity-20"></div>
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-[var(--accent)]/10 rounded-lg shrink-0">
                            <ShieldAlert size={24} className="text-[var(--accent)]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-sm mb-1">Terms Updated</h3>
                            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                                We've updated our Terms of Service to be more transparent. Please review the changes.
                            </p>
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/terms"
                                    onClick={handleDismiss}
                                    className="text-xs font-bold text-[var(--primary)] bg-[var(--accent)] px-3 py-1.5 rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
                                >
                                    Review Terms
                                </Link>
                                <button
                                    onClick={handleDismiss}
                                    className="text-xs font-medium text-gray-500 hover:text-white transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
