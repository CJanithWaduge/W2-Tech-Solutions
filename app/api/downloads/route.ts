// app/api/downloads/route.ts
import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const publicDir = path.join(process.cwd(), 'public');
        const dataDir = path.join(process.cwd(), 'data');

        // Read static download page data
        const content = await fs.readFile(path.join(publicDir, 'Download.json'), 'utf8');
        const data = JSON.parse(content);

        // Read projects data (as fallback/source)
        const projectsContent = await fs.readFile(path.join(dataDir, 'projects.json'), 'utf8');
        const projectsSource = JSON.parse(projectsContent);

        // Read real-time stats
        try {
            const statsContent = await fs.readFile(path.join(dataDir, 'stats.json'), 'utf8');
            const stats = JSON.parse(statsContent);

            // Update global stats
            if (data.globalStats) {
                data.globalStats.totalDownloads = stats.totalDownloads;
                data.globalStats.totalProjects = stats.modules;
            }

            // Use projectsSource but override with stats
            data.projects = projectsSource.map((project: any) => {
                const pStats = stats.projectStats?.[project.id];
                return {
                    ...project,
                    downloads: pStats?.downloads || 0,
                    rating: pStats?.rating || 0
                };
            });
        } catch (e) {
            console.warn("Stats file not found, using projects.json as is");
            data.projects = projectsSource;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to load download data" }, { status: 500 });
    }
}
