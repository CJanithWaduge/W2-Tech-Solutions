import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const type = formData.get('type') as string; // 'cover' or 'avatar'
        const articleId = formData.get('articleId') as string;

        if (!file || !articleId || !type) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const extension = path.extname(file.name);
        const fileName = `${type === 'cover' ? 'Cover' : 'Author'}${extension}`;

        // Create directory structure: /images/Articles/${articleId}
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'Articles', articleId);

        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        await fs.writeFile(filePath, buffer);

        const publicPath = `/images/Articles/${articleId}/${fileName}`;

        return NextResponse.json({
            success: true,
            path: publicPath
        });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
