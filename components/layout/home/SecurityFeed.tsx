'use client';

import { CheckCircle, AlertTriangle, Shield, BarChart, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import React from 'react'; // Import React for React.ElementType

interface UpdateItem {
  id: number;
  type: string;
  icon: React.ElementType;
  title: string;
  time: string;
  color: string;
  bgColor: string;
}

type Props = { data?: any };

const initialUpdatesDefault: UpdateItem[] = [
  {
    id: 1,
    type: 'security',
    icon: Shield,
    title: 'No events yet',
    time: 'Now',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
  },
];

const projectMap: { [key: string]: string } = {
  'Agency Pro': 'agency-pro',
  'CLI Suite': 'cli-suite',
  'DB Guard': 'db-guard',
};

export default function SecurityFeed({ data }: Props) {
  const fromData: UpdateItem[] = (data?.securityFeed ?? []).map((u: any, i: number) => ({
    id: i + 1,
    type: u.status ?? 'info',
    icon: Shield,
    title: u.event ?? u.title,
    time: u.timestamp ?? u.time,
    color: 'text-teal-400',
    bgColor: 'bg-teal-400/10',
  }));

  const [updates, setUpdates] = useState<UpdateItem[]>(fromData.length ? fromData : initialUpdatesDefault);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // Update current time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);

    // Simulate live updates
    let idCounter = initialUpdatesDefault.length + 1;
    const updateInterval = setInterval(() => {
      const newUpdate: UpdateItem = {
        id: idCounter++,
        type: 'monitoring',
        icon: Shield,
        title: 'System health check completed - All systems optimal',
        time: 'Just now',
        color: 'text-teal-400',
        bgColor: 'bg-teal-400/10',
      };
      
      setUpdates((prevUpdates: UpdateItem[]) => [newUpdate, ...prevUpdates.slice(0, 3)]);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearInterval(updateInterval);
    };
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Live Security Feed</h2>
                <p className="text-[var(--text-secondary)]">
                  Real-time monitoring and updates from our security infrastructure
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--accent)]/20 to-transparent border border-[var(--accent)]/30">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{currentTime}</span>
              </div>
            </div>

            <div className="space-y-4">
              {updates.map((update) => {
                const Icon = update.icon;
                const projectName = Object.keys(projectMap).find(name => update.title.includes(name));
                const link = projectName ? `/downloads/${projectMap[projectName]}` : undefined;

                const content = (
                  <div
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-800/30 transition-colors group hover:cursor-pointer active:scale-95"
                  >
                    <div className={`p-3 rounded-lg ${update.bgColor} ${update.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{update.title}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[var(--text-secondary)]">{update.time}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-800/50">
                          {update.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                  </div>
                );

                if (link) {
                  return <Link key={update.id} href={link}>{content}</Link>;
                }
                return <div key={update.id}>{content}</div>;
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-[var(--accent)]">99.9%</div>
                  <div className="text-sm text-[var(--text-secondary)]">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--accent)]">0</div>
                  <div className="text-sm text-[var(--text-secondary)]">Security Incidents</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--accent)]">24/7</div>
                  <div className="text-sm text-[var(--text-secondary)]">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}