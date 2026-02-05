import { Download, Monitor, Package, UserCheck, ShieldCheck, Briefcase } from 'lucide-react';

type Props = { data?: any };

const iconMap: Record<string, any> = {
  download: Download,
  monitor: Monitor,
  package: Package,
  'user-check': UserCheck,
  'shield-check': ShieldCheck,
  briefcase: Briefcase
};

export default function TrustBar({ data }: Props) {
  const stats = data?.globalStats ?? [
    { label: 'Total Downloads', value: '—', icon: 'download' },
    { label: 'Modules', value: '—', icon: 'package' },
    { label: 'Support Status', value: '—', icon: 'user-check' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center max-w-5xl mx-auto">
        {stats.map((stat: any, index: number) => {
          const Icon = iconMap[stat.icon] || Download;
          return (
            <div key={index} className="stat-card group hover:border-[var(--accent)]">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-[var(--accent)]" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
