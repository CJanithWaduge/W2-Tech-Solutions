import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const dataDir = path.join(process.cwd(), 'data');

    // Read static home page data
    const homeContent = await fs.readFile(path.join(publicDir, 'HomePage.json'), 'utf8');
    const data = JSON.parse(homeContent);

    // Read real-time stats & projects to get accurate module count
    try {
      const statsContent = await fs.readFile(path.join(dataDir, 'stats.json'), 'utf8');
      const stats = JSON.parse(statsContent);

      const projectsContent = await fs.readFile(path.join(dataDir, 'projects.json'), 'utf8');
      const projects = JSON.parse(projectsContent);

      // Inject top 4 most downloaded projects
      const projectsWithStats = projects.map((p: any) => ({
        ...p,
        downloads: stats.projectStats[p.id]?.downloads || 0,
        rating: stats.projectStats[p.id]?.rating || 0
      }));

      projectsWithStats.sort((a: any, b: any) => b.downloads - a.downloads);
      data.projects = projectsWithStats.slice(0, 4);

      // Update globalStats in the response
      if (data.globalStats) {
        data.globalStats = data.globalStats.map((stat: any) => {
          if (stat.label === "Total Downloads") {
            stat.value = stats.totalDownloads.toLocaleString();
          } else if (stat.label === "Modules") {
            stat.value = projects.length.toString(); // Real-time count
          }
          return stat;
        });
      }
    } catch (e) {
      console.warn("Stats or Projects file error, using defaults");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to load project data" }, { status: 500 });
  }
}
