import path from 'path';
import { promises as fs } from 'fs';

export async function getPortfolioData() {
    const publicDir = path.join(process.cwd(), 'public');
    const dataDir = path.join(process.cwd(), 'data');

    try {
        const homeContent = await fs.readFile(path.join(publicDir, 'HomePage.json'), 'utf8');
        const data = JSON.parse(homeContent);

        try {
            const statsContent = await fs.readFile(path.join(dataDir, 'stats.json'), 'utf8');
            const stats = JSON.parse(statsContent);

            const projectsContent = await fs.readFile(path.join(dataDir, 'projects.json'), 'utf8');
            const projects = JSON.parse(projectsContent);

            const projectsWithStats = projects.map((p: any) => ({
                ...p,
                downloads: stats.projectStats[p.id]?.downloads || 0,
                rating: stats.projectStats[p.id]?.rating || 0
            }));

            projectsWithStats.sort((a: any, b: any) => b.downloads - a.downloads);
            data.projects = projectsWithStats.slice(0, 4);

            if (data.globalStats) {
                data.globalStats = data.globalStats.map((stat: any) => {
                    if (stat.label === "Total Downloads") {
                        stat.value = stats.totalDownloads.toLocaleString();
                    } else if (stat.label === "Modules") {
                        stat.value = projects.length.toString();
                    }
                    return stat;
                });
            }
        } catch (e) {
            console.warn("Stats or Projects file error, using defaults");
        }

        return data;
    } catch (error) {
        console.error("Data loading error:", error);
        return null;
    }
}

export async function getDownloadsData() {
    const publicDir = path.join(process.cwd(), 'public');
    const dataDir = path.join(process.cwd(), 'data');

    try {
        const content = await fs.readFile(path.join(publicDir, 'Download.json'), 'utf8');
        const data = JSON.parse(content);

        const projectsContent = await fs.readFile(path.join(dataDir, 'projects.json'), 'utf8');
        const projectsSource = JSON.parse(projectsContent);

        try {
            const statsContent = await fs.readFile(path.join(dataDir, 'stats.json'), 'utf8');
            const stats = JSON.parse(statsContent);

            if (data.globalStats) {
                data.globalStats.totalDownloads = stats.totalDownloads;
                data.globalStats.totalProjects = stats.modules;
            }

            data.projects = projectsSource.map((project: any) => {
                const pStats = stats.projectStats?.[project.id];
                return {
                    ...project,
                    downloads: pStats?.downloads || 0,
                    rating: pStats?.rating || 0
                };
            });
        } catch (e) {
            console.warn("Stats file error, using defaults");
            data.projects = projectsSource;
        }

        return data;
    } catch (error) {
        console.error("Download data loading error:", error);
        return null;
    }
}

export async function getArticlesData() {
    const publicDir = path.join(process.cwd(), 'public');
    const dataDir = path.join(process.cwd(), 'data');

    try {
        const [featuresRes, interactionsRes] = await Promise.all([
            fs.readFile(path.join(publicDir, 'Features.json'), 'utf8'),
            fs.readFile(path.join(dataDir, 'article_interactions.json'), 'utf8').catch(() => '{}')
        ]);

        const data: any[] = JSON.parse(featuresRes);
        const interactions: any = JSON.parse(interactionsRes);

        const updatedArticles = data.map(article => ({
            ...article,
            views: interactions[article.slug]?.views || 0,
            comments: interactions[article.slug]?.comments || []
        }));

        return updatedArticles.filter(a => a.status === 'published');
    } catch (error) {
        console.error('Error loading articles:', error);
        return [];
    }
}

export async function getArticleBySlug(slug: string) {
    const articles = await getArticlesData();
    return articles.find(a => a.slug === slug) || null;
}

export async function getAllProjectIds() {
    try {
        const dataDir = path.join(process.cwd(), 'data');
        const projectsContent = await fs.readFile(path.join(dataDir, 'projects.json'), 'utf8');
        const projects: any[] = JSON.parse(projectsContent);
        return projects.map(p => ({ id: p.id }));
    } catch (error) {
        console.error('Error getting project IDs:', error);
        return [];
    }
}

export async function getProjectById(id: string) {
    try {
        const dataDir = path.join(process.cwd(), 'data');
        const projectsContent = await fs.readFile(path.join(dataDir, 'projects.json'), 'utf8');
        const projects: any[] = JSON.parse(projectsContent);
        const project = projects.find(p => p.id === id);

        if (!project) return null;

        try {
            const statsContent = await fs.readFile(path.join(dataDir, 'stats.json'), 'utf8');
            const stats = JSON.parse(statsContent);
            const pStats = stats.projectStats?.[id];

            return {
                ...project,
                downloads: pStats?.downloads || 0,
                rating: pStats?.rating || 0
            };
        } catch {
            return project;
        }
    } catch (error) {
        console.error(`Error loading project ${id}:`, error);
        return null;
    }
}
