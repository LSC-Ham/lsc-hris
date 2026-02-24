import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    let fileName = searchParams.get("fileName");

    if (!fileName) {
        return new NextResponse("Filename is required", { status: 400 });
    }

    // Since your DB stores "/uploads/profile-xxx.jpg", we strip the leading slash 
    // to prevent path.join from treating it as a root directory on Linux/Mac
    if (fileName.startsWith('/')) {
        fileName = fileName.slice(1);
    }

    // This dynamically points to the live folder on your disk, ignoring Next.js build cache
    const filePath = path.join(process.cwd(), "public", fileName);

    try {
        if (!fs.existsSync(filePath)) {
            return new NextResponse("Image not found", { status: 404 });
        }

        const fileBuffer = fs.readFileSync(filePath);
        
        const ext = path.extname(fileName).toLowerCase();
        let contentType = "image/jpeg";
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".webp") contentType = "image/webp";
        
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400", 
            },
        });
    } catch (error) {
        console.error("API Error reading file:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}