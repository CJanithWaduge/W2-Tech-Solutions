import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export const dynamic = 'force-dynamic';

const STATS_PATH = path.join(process.cwd(), 'data', 'stats.json');
const PROJECTS_PATH = path.join(process.cwd(), 'data', 'projects.json');

async function getStats() {
  let stats;
  try {
    const fileContents = await fs.readFile(STATS_PATH, 'utf8');
    stats = JSON.parse(fileContents);
  } catch (error) {
    stats = {
      totalDownloads: 0,
      installs: 0,
      modules: 0,
      activeUsers: 0,
      projectStats: {}
    };
  }

  // Calculate modules dynamically from projects.json
  try {
    const projectsContent = await fs.readFile(PROJECTS_PATH, 'utf8');
    const projects = JSON.parse(projectsContent);
    stats.modules = projects.length;

    // Ensure all projects exist in projectStats
    if (!stats.projectStats) stats.projectStats = {};
    projects.forEach((p: any) => {
      if (!stats.projectStats[p.id]) {
        stats.projectStats[p.id] = { downloads: 0, rating: 0, ratingCount: 0 };
      }
    });
  } catch (e) {
    console.warn("Could not calculate dynamic modules or project list");
  }

  return stats;
}

async function saveStats(stats: any) {
  await fs.writeFile(STATS_PATH, JSON.stringify(stats, null, 2), 'utf8');
}

export async function GET() {
  const stats = await getStats();
  return NextResponse.json(stats);
}

export async function POST(request: Request) {
  try {
    const { type, projectId, rating } = await request.json();
    const stats = await getStats();

    if (type === 'download') {
      stats.totalDownloads += 1;
      stats.installs += 1;
      if (projectId && stats.projectStats[projectId]) {
        stats.projectStats[projectId].downloads += 1;
      }
    } else if (type === 'rate') {
      if (projectId && stats.projectStats[projectId] && typeof rating === 'number') {
        const pStats = stats.projectStats[projectId];
        const newCount = pStats.ratingCount + 1;
        const newRating = ((pStats.rating * pStats.ratingCount) + rating) / newCount;
        pStats.rating = Number(newRating.toFixed(1));
        pStats.ratingCount = newCount;
      }
    }

    await saveStats(stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Failed to update stats" }, { status: 500 });
  }
}
