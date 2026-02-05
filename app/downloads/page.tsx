import { Suspense } from 'react';
import DownloadsClient from './DownloadsClient';
import { getDownloadsData } from '@/lib/data';

export default async function DownloadsPage() {
  const data = await getDownloadsData();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[var(--accent)] animate-pulse">Initializing Secure Connection...</p>
    </div>}>
      <DownloadsClient initialData={data} />
    </Suspense>
  );
}