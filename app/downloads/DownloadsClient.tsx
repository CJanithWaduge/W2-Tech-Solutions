'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Shield, CheckCircle, Server, Code } from 'lucide-react';
import ProjectCard from '@/components/downloads/ProjectCard';
import FilterSidebar from '@/components/downloads/FilterSidebar';
import { Project, DownloadPageData } from '@/types/project';
import { getAssetPath } from '@/lib/utils';

export default function DownloadsClient({ initialData }: { initialData: DownloadPageData | null }) {
    const searchParams = useSearchParams();
    const projectIdParam = searchParams.get('project');

    const [data, setData] = useState<DownloadPageData | null>(initialData);
    const [projects, setProjects] = useState<Project[]>(initialData?.projects || []);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialData?.projects || []);
    const [isLoading, setIsLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        category: 'All Projects',
        os: 'All OS',
        tags: [] as string[],
        search: '',
        sortBy: 'latest'
    });

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Apply filters
    useEffect(() => {
        if (!data) return;

        let result = [...projects];

        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.description.toLowerCase().includes(q) ||
                p.tags.some(t => t.toLowerCase().includes(q))
            );
        }

        if (filters.category !== 'All Projects') {
            result = result.filter(p => p.category === filters.category);
        }

        if (filters.os !== 'All OS') {
            result = result.filter(p => p.compatibility.some(os => os === filters.os));
        }

        if (filters.tags.length > 0) {
            result = result.filter(p =>
                filters.tags.every(t => p.tags.includes(t))
            );
        }

        setFilteredProjects(result);
    }, [filters, projects, data]);

    // Scroll to project if param exists
    useEffect(() => {
        if (projectIdParam && !isLoading && filteredProjects.length > 0) {
            setTimeout(() => {
                const el = document.getElementById(`project-${projectIdParam}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }, [projectIdParam, isLoading, filteredProjects]);

    if (!data) return <div className="min-h-screen flex items-center justify-center text-red-500">Failed to load content.</div>;

    return (
        <div className="min-h-screen bg-[#0a192f] text-gray-300 selection:bg-[var(--accent)] selection:text-[var(--primary)]">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-[#112240] to-transparent opacity-60" />
                <div className="absolute inset-0 bg-repeat opacity-[0.03]" style={{ backgroundImage: `url(${getAssetPath('/grid.svg')})` }} />
            </div>

            {/* Hero Section */}
            <div className="relative z-10 pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs mb-6 font-mono">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                                </span>
                                Authentication Servers Online
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                Software <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-cyan-400">Distribution</span>
                                <br />Hub
                            </h1>
                            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-xl mx-auto md:mx-0">
                                {data.pageConfig.trustNote}
                            </p>

                            <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-8">
                                <div>
                                    <div className="text-2xl font-bold text-white">{data.globalStats.totalProjects}</div>
                                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Modules</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-green-400">{data.globalStats.verifiedPercent}%</div>
                                    <div className="text-xs text-[var(--text-secondary)] uppercase tracking-wider">Secure</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-md">
                            <div className="bg-[#112240]/80 backdrop-blur-xl border border-gray-800 p-6 rounded-2xl shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Server size={100} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Search Repository</h3>
                                <div className="relative mb-6">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        value={filters.search}
                                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                        placeholder={data.pageConfig.searchPlaceholder}
                                        className="w-full bg-[#0a192f] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                        <Shield className="w-4 h-4 text-green-400" />
                                        <span>Code Signing: {data.pageConfig.security.isCodeSigned ? 'Active' : 'Missing'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                                        <CheckCircle className="w-4 h-4 text-blue-400" />
                                        <span>Integrity Check: {data.pageConfig.security.checksumVerified ? 'Enforced' : 'Optional'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-24 relative z-10">
                <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                    <div className="lg:hidden mb-4">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-[#112240] rounded-lg border border-gray-800 text-white font-medium"
                        >
                            <Filter size={18} />
                            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>

                    <div className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24">
                            <FilterSidebar
                                filters={filters}
                                onFilterChange={setFilters}
                                projects={projects}
                                availableFilters={data.filters}
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <div className="mb-6 flex justify-between items-end border-b border-gray-800 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">Available Modules</h2>
                                <p className="text-sm text-[var(--text-secondary)]">Showing {filteredProjects.length} of {projects.length} artifacts</p>
                            </div>
                        </div>

                        {filteredProjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredProjects.map(project => (
                                    <div key={project.id} id={`project-${project.id}`}>
                                        <ProjectCard
                                            project={project}
                                            autoOpen={project.id === projectIdParam}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-[#112240]/50 border border-gray-800 rounded-2xl p-12 text-center">
                                <div className="inline-block p-4 bg-gray-800/50 rounded-full mb-4">
                                    <Code size={32} className="text-gray-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">No modules found</h3>
                                <p className="text-[var(--text-secondary)] max-w-md mx-auto mb-6">
                                    No projects match your current security clearance or filter parameters.
                                </p>
                                <button
                                    onClick={() => setFilters({
                                        category: 'All Projects',
                                        os: 'All OS',
                                        tags: [],
                                        search: '',
                                        sortBy: 'latest'
                                    })}
                                    className="bg-[var(--accent)] text-[var(--primary)] px-6 py-2 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
                                >
                                    Clear Parameters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 border-t border-gray-800/50">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why You Can Trust These Tools</h2>
                    <p className="text-[var(--text-secondary)]">
                        Every module in this repository undergoes rigorous security checks and cryptographic signing before distribution.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    <div className="card p-6 bg-[#112240]/40">
                        <Shield className="w-10 h-10 text-[var(--accent)] mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Cryptographic Signing</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            All binaries and scripts are signed using high-entropy certificates, ensuring they haven't been tampered with since release.
                        </p>
                    </div>
                    <div className="card p-6 bg-[#112240]/40">
                        <CheckCircle className="w-10 h-10 text-blue-400 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Integrity Verification</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            We provide SHA-256 checksums for every artifact. Our distribution hub automatically verifies integrity before every install.
                        </p>
                    </div>
                    <div className="card p-6 bg-[#112240]/40">
                        <Server className="w-10 h-10 text-green-400 mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">Production Ready</h3>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            Tested in enterprise environments. These tools are optimized for performance, security, and immediate deployment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
