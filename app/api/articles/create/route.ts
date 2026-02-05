import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(req: Request) {
    try {
        const article = await req.json();
        const featuresPath = path.join(process.cwd(), 'public', 'Features.json');

        // Read existing articles
        let articles = [];
        try {
            const content = await fs.readFile(featuresPath, 'utf8');
            articles = JSON.parse(content);
        } catch (error) {
            console.error('Error reading Features.json:', error);
            // If file doesn't exist, start with empty array
        }

        // Add new article to the beginning
        articles.unshift({
            ...article,
            publishDate: new Date().toISOString().split('T')[0],
            views: "auto",
            comments: 0
        });

        // Save back to file
        await fs.writeFile(featuresPath, JSON.stringify(articles, null, 2), 'utf8');

        return NextResponse.json({
            success: true,
            article: articles[0]
        });
    } catch (error) {
        console.error('Create Article Error:', error);
        return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
    }
}
