import { NextResponse } from 'next/server';
import path from 'path';
import { promises as fs } from 'fs';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name;
        const extension = path.extname(fileName);
        const newFileName = `avatar${extension}`;

        // Ensure directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'about');
        try {
            await fs.access(uploadDir);
        } catch {
            await fs.mkdir(uploadDir, { recursive: true });
        }

        // Save file
        const filePath = path.join(uploadDir, newFileName);
        await fs.writeFile(filePath, buffer);

        // Update About.json
        const aboutPath = path.join(process.cwd(), 'public', 'About.json');
        const aboutContent = await fs.readFile(aboutPath, 'utf8');
        const aboutData = JSON.parse(aboutContent);

        const publicPath = `/images/about/${newFileName}`;
        aboutData.profile.avatar = publicPath;

        await fs.writeFile(aboutPath, JSON.stringify(aboutData, null, 2));

        return NextResponse.json({
            success: true,
            path: publicPath
        });
    } catch (error) {
        console.error('Upload Error:', error);
        return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
}
