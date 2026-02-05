'use client';

import { useState } from 'react';
import { Download, ChevronDown, Shield, CheckCircle, Star, Monitor, Apple, Cpu, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/types/project';

interface ProjectDetailClientProps {
	project: Project;
}

export default function ProjectDetailClient({ project }: ProjectDetailClientProps) {
	const [expandedVersion, setExpandedVersion] = useState<number | null>(null);
	const [currentDownloads, setCurrentDownloads] = useState(project.downloads);
	const [currentRating, setCurrentRating] = useState(project.rating);
	const [userRated, setUserRated] = useState(false);

	const availableOS = Object.keys(project.downloadLinks) as Array<'windows' | 'macos' | 'linux'>;

	const getOSIcon = (os: string) => {
		switch (os) {
			case 'windows':
				return Monitor;
			case 'macos':
				return Apple;
			case 'linux':
				return Cpu;
			default:
				return Monitor;
		}
	};

	const getOSLabel = (os: string) => {
		switch (os) {
			case 'windows':
				return 'Windows';
			case 'macos':
				return 'macOS';
			case 'linux':
				return 'Linux';
			default:
				return os;
		}
	};

	const handleDownload = async (url: string) => {
		try {
			await fetch('/api/stats', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ type: 'download', projectId: project.id }),
			});
			setCurrentDownloads(prev => prev + 1);
		} catch (error) {
			console.error('Failed to track download:', error);
		}
		window.location.href = url;
	};

	const handleRate = async (rating: number) => {
		if (userRated) return;
		try {
			const res = await fetch('/api/stats', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ type: 'rate', projectId: project.id, rating }),
			});
			const data = await res.json();
			setCurrentRating(data.projectStats[project.id].rating);
			setUserRated(true);
		} catch (error) {
			console.error('Failed to submit rating:', error);
		}
	};

	const isReleased = (p: Project) => {
		return Object.keys(p.downloadLinks || {}).length > 0 && (p.versions?.length ?? 0) > 0;
	};

	return (
		<div className="min-h-screen">
			<div className="container mx-auto px-4 py-6">
				<Link href="/downloads" className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-teal-300 transition-colors font-medium">
					<ArrowLeft size={20} />
					Back to Downloads
				</Link>
			</div>

			<div className="relative overflow-hidden py-12 md:py-20">
				<div className="absolute inset-0 bg-gradient-to-b from-[#0a192f] via-[#0a192f] to-[#112240]">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,170,0.1),transparent_70%)]" />
				</div>

				<div className="container mx-auto px-4 relative z-10">
					<div className="flex flex-col lg:flex-row items-start gap-12">
						<div className="flex-1">
							<div className="inline-flex items-center gap-2 mb-6">
								<span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-lg font-medium">v{project.version}</span>
								<div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
									<span className="text-sm font-medium text-green-400">{isReleased(project) ? 'Ready to Download' : 'Currently in Testing'}</span>
								</div>
								{project.security?.verified && (
									<div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
										<Shield className="w-4 h-4" /> <span>Verified</span>
									</div>
								)}
							</div>

							<h1 className="text-5xl md:text-6xl font-bold mb-4">{project.name}</h1>

							<div className="flex items-center gap-6 mb-8">
								<div className="flex items-center gap-2">
									<Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
									<span className="text-2xl font-bold">{currentRating}</span>
									<span className="text-[var(--text-secondary)]">({currentDownloads.toLocaleString()} downloads)</span>
								</div>
								{!userRated && (
									<div className="flex items-center gap-2 border-l border-gray-800 pl-6">
										<span className="text-sm text-gray-400 mr-2">Rate:</span>
										{[1, 2, 3, 4, 5].map(star => (
											<button
												key={star}
												onClick={() => handleRate(star)}
												className="text-gray-600 hover:text-yellow-400 transition-colors"
											>
												<Star className="w-5 h-5" />
											</button>
										))}
									</div>
								)}
								{userRated && <span className="text-sm text-green-400 ml-4 italic">Thanks for rating!</span>}
							</div>

							<p className="text-xl text-[var(--text-secondary)] mb-8 max-w-3xl leading-relaxed">{project.longDescription || project.description}</p>

							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
								<div className="card p-4">
									<div className="text-sm text-[var(--text-secondary)] mb-2">File Size</div>
									<div className="text-2xl font-bold">{project.size}</div>
								</div>
								<div className="card p-4">
									<div className="text-sm text-[var(--text-secondary)] mb-2">Last Updated</div>
									<div className="text-lg font-bold">{new Date(project.lastUpdated).toLocaleDateString()}</div>
								</div>
								<div className="card p-4">
									<div className="text-sm text-[var(--text-secondary)] mb-2">Category</div>
									<div className="text-lg font-bold capitalize">{project.category}</div>
								</div>
								<div className="card p-4">
									<div className="text-sm text-[var(--text-secondary)] mb-2">Compatibility</div>
									<div className="text-lg font-bold">{project.compatibility.join(', ')}</div>
								</div>
							</div>

							<section className="mb-8">
								<h2 className="text-2xl font-bold mb-4">What's Inside</h2>
								<ul className="list-disc pl-5 text-[var(--text-secondary)] space-y-2">
									{project.features.map((f, i) => (
										<li key={i}>{f}</li>
									))}
								</ul>
							</section>

							<section className="mb-8">
								<h2 className="text-2xl font-bold mb-4">What you need</h2>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[var(--text-secondary)]">
									<div>
										<div className="text-sm mb-1">RAM</div>
										<div className="font-medium">{project.requirements.ram}</div>
									</div>
									<div>
										<div className="text-sm mb-1">Storage</div>
										<div className="font-medium">{project.requirements.storage}</div>
									</div>
									<div>
										<div className="text-sm mb-1">OS Specific</div>
										<div className="font-medium">
											{project.requirements.windows && <div>Windows: {project.requirements.windows}</div>}
											{project.requirements.macos && <div>macOS: {project.requirements.macos}</div>}
											{project.requirements.linux && <div>Linux: {project.requirements.linux}</div>}
										</div>
									</div>
								</div>
							</section>

							<div className="flex items-center gap-4">
								<Link href={project.tags?.includes('docs') ? project.tags.find(t => t === 'docs') || '#' : '#'} className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline">
									<ExternalLink className="w-4 h-4" /> See how it works
								</Link>
							</div>
						</div>

						<aside className="w-full lg:w-96">
							<div className="p-6 bg-[var(--card-bg)] rounded-xl shadow-sm sticky top-6">
								<h3 className="text-lg font-bold mb-4">Get this tool</h3>

								<div className="flex flex-col gap-3 mb-4">
									{availableOS.map(os => {
										const Icon = getOSIcon(os);
										const link = project.downloadLinks[os as 'windows' | 'macos' | 'linux']?.url;
										return (
											<button key={os} onClick={() => link && handleDownload(link)} className="flex items-center justify-between w-full px-4 py-3 bg-[var(--btn-bg)] rounded-lg hover:opacity-95 text-white">
												<div className="flex items-center gap-3">
													<Icon className="w-5 h-5 text-[var(--accent)]" />
													<div className="text-left">
														<div className="text-sm font-bold">{getOSLabel(os)}</div>
														<div className="text-xs text-[var(--text-secondary)]">{project.downloadLinks[os as 'windows' | 'macos' | 'linux']?.format} · {project.downloadLinks[os as 'windows' | 'macos' | 'linux']?.size}</div>
													</div>
												</div>
												<div className="text-sm font-medium">Get</div>
											</button>
										);
									})}
								</div>

								<div>
									<h4 className="text-sm font-semibold mb-1">What's New</h4>
									<p className="text-[10px] text-[var(--text-secondary)] mb-4 leading-relaxed">
										Looking for an older version? Click on any release below to see changes and download.
									</p>
									<div className="space-y-2">
										{project.versions.map((v, idx) => (
											<div key={v.version} className="border border-[var(--border)] rounded-lg p-3">
												<div className="flex items-center justify-between">
													<div>
														<div className="font-medium">v{v.version}</div>
														<div className="text-xs text-[var(--text-secondary)]">{new Date(v.date).toLocaleDateString()}</div>
													</div>
													<div className="flex items-center gap-2">
														<button onClick={() => handleDownload(v.downloadUrl)} className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[var(--accent)] to-teal-400 text-[var(--primary)] rounded-lg text-sm font-semibold">
															<Download className="w-4 h-4" /> Get
														</button>
														<button onClick={() => setExpandedVersion(expandedVersion === idx ? null : idx)} className="p-2">
															<ChevronDown className={`w-4 h-4 transition-transform ${expandedVersion === idx ? 'rotate-180' : ''}`} />
														</button>
													</div>
												</div>
												{expandedVersion === idx && (
													<div className="mt-3 text-[var(--text-secondary)] text-sm">
														<div className="mb-2 font-semibold">Changes</div>
														<ul className="list-disc pl-5 space-y-1">
															{v.changes.map((c, i) => <li key={i}>{c}</li>)}
														</ul>
													</div>
												)}
											</div>
										))}
									</div>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</div>
	);
}
