import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

const DATA_PATH = path.join(process.cwd(), 'data', 'article_interactions.json');

export async function GET() {
    try {
        const content = await fs.readFile(DATA_PATH, 'utf8');
        return NextResponse.json(JSON.parse(content));
    } catch {
        return NextResponse.json({});
    }
}
