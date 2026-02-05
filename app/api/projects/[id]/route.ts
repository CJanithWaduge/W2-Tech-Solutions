import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const dataDir = path.join(process.cwd(), 'data');
        const projectsContent = await fs.readFile(path.join(dataDir, 'projects.json'), 'utf8');
        const projects = JSON.parse(projectsContent);
        const project = projects.find((p: any) => p.id === id);

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Merge with stats
        try {
            const statsContent = await fs.readFile(path.join(dataDir, 'stats.json'), 'utf8');
            const stats = JSON.parse(statsContent);
            const pStats = stats.projectStats?.[id];

            project.downloads = pStats?.downloads || 0;
            project.rating = pStats?.rating || 0;
        } catch (e) {
            project.downloads = 0;
            project.rating = 0;
        }

        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
