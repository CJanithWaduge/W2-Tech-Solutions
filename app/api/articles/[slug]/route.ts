import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const DATA_PATH = path.join(process.cwd(), 'data', 'article_interactions.json');

async function ensureDataFile() {
    try {
        await fs.access(DATA_PATH);
    } catch {
        await fs.writeFile(DATA_PATH, JSON.stringify({}), 'utf8');
    }
}

async function getInteractions() {
    await ensureDataFile();
    const content = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(content);
}

async function saveInteractions(data: any) {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const interactions = await getInteractions();
    const articleInteractions = interactions[slug] || { views: 0, comments: [] };
    return NextResponse.json(articleInteractions);
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { type, comment } = await request.json();
        const interactions = await getInteractions();

        if (!interactions[slug]) {
            interactions[slug] = { views: 0, comments: [] };
        }

        if (type === 'view') {
            interactions[slug].views += 1;
        } else if (type === 'comment') {
            const newComment = {
                id: Date.now().toString(),
                author: comment.author || 'Anonymous User',
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(comment.author || 'Anonymous')}`,
                content: comment.content,
                date: new Date().toISOString(),
                likes: 0
            };
            interactions[slug].comments.push(newComment);
        }

        await saveInteractions(interactions);
        return NextResponse.json(interactions[slug]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update interaction' }, { status: 500 });
    }
}
