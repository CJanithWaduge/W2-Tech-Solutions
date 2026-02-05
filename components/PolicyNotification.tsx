'use client';

import { useState, useEffect } from 'react';
import { X, ShieldAlert, Info } from 'lucide-react';
import Link from 'next/link';

interface PolicyNotificationProps {
    endpoint: string;
    storageKey: string;
    title: string;
    message: string;
    linkHref: string;
    linkText: string;
}

export default function PolicyNotification({
    endpoint,
    storageKey,
    title,
    message,
    linkHref,
    linkText
}: PolicyNotificationProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [remoteVersion, setRemoteVersion] = useState<string | null>(null);

    useEffect(() => {
        const checkVersion = async () => {
            try {
                const res = await fetch(endpoint);
                if (!res.ok) return;

                const data = await res.json();
                const serverVersion = data.lastUpdated;
                const localVersion = localStorage.getItem(storageKey);

                if (serverVersion && serverVersion !== localVersion) {
                    setRemoteVersion(serverVersion);
                    // Small delay to not be jarring on load
                    setTimeout(() => setIsVisible(true), 1500);
                }
            } catch (error) {
                console.error(`Failed to check version for ${endpoint}:`, error);
            }
        };

        checkVersion();
    }, [endpoint, storageKey]);

    const handleDismiss = () => {
        if (remoteVersion) {
            localStorage.setItem(storageKey, remoteVersion);
            setIsVisible(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 fade-in duration-500 mb-2">
            <div className="bg-[#112240] border border-[var(--accent)]/30 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-md">
                <div className="p-1 bg-gradient-to-r from-[var(--accent)] to-blue-500 opacity-20"></div>
                <div className="p-5">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-[var(--accent)]/10 rounded-lg shrink-0">
                            <ShieldAlert size={24} className="text-[var(--accent)]" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
                            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                                {message}
                            </p>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={linkHref}
                                    onClick={handleDismiss}
                                    className="text-xs font-bold text-[var(--primary)] bg-[var(--accent)] px-3 py-1.5 rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
                                >
                                    {linkText}
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
