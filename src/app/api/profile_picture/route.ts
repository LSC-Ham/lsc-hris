import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
    // 1. Get the filename or user ID from the query parameters
    // Example: /api/profile-picture?fileName=avatar-123.jpg
    const searchParams = req.nextUrl.searchParams;
    const fileName = searchParams.get("fileName");

    if (!fileName) {
        return new NextResponse("Filename is required", { status: 400 });
    }

    // 2. Build the absolute path to your 'public' folder
    // process.cwd() gets the root directory of your Next.js project
    // Adjust "uploads" if your images are in a different subfolder inside public/
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    try {
        // 3. Check if the file actually exists
        if (!fs.existsSync(filePath)) {
            // You could also return a default avatar image buffer here instead of a 404
            return new NextResponse("Image not found", { status: 404 });
        }

        // 4. Read the file
        const fileBuffer = fs.readFileSync(filePath);

        // 5. Determine the correct Content-Type based on the extension
        const ext = path.extname(fileName).toLowerCase();
        let contentType = "image/jpeg"; // default
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".svg") contentType = "image/svg+xml";

        // 6. Return the image to the browser
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                // Cache the image so the browser doesn't have to keep downloading it
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
            },
        });
    } catch (error) {
        console.error("Error reading profile picture:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}