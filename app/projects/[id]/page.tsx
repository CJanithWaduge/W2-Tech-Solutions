'use client';

import { useEffect, useState } from 'react';
import { Project } from '@/types/project';
import ProjectDetailClient from './ProjectDetailClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ProjectPage() {
	const params = useParams();
	const [project, setProject] = useState<Project | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!params.id) return;

		fetch(`/api/projects/${params.id}`)
			.then(res => res.json())
			.then(data => {
				if (!data.error) setProject(data);
				setLoading(false);
			})
			.catch(err => {
				console.error("Error fetching project:", err);
				setLoading(false);
			});
	}, [params.id]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-12 h-12 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!project) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
					<p className="text-[var(--text-secondary)] mb-6">The project you're looking for doesn't exist.</p>
					<Link href="/downloads" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--accent)] to-teal-400 text-[var(--primary)] rounded-lg font-bold hover:shadow-[0_0_20px_rgba(0,212,170,0.3)] transition-all">
						<ArrowLeft size={20} />
						Back to Downloads
					</Link>
				</div>
			</div>
		);
	}

	return <ProjectDetailClient project={project} />;
}