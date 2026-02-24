import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest) {
    // Get the filename from the URL (e.g., ?fileName=profile-068a...jpg)
    const searchParams = req.nextUrl.searchParams;
    const fileName = searchParams.get("fileName");

    if (!fileName) {
        return new NextResponse("Filename is required", { status: 400 });
    }

    // ✨ This builds the exact path: public/uploads/your-image.jpg
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);

    try {
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return new NextResponse("Image not found", { status: 404 });
        }

        // Read the file
        const fileBuffer = fs.readFileSync(filePath);

        // Determine the Content-Type
        const ext = path.extname(fileName).toLowerCase();
        let contentType = "image/jpeg"; // default for .jpg
        if (ext === ".png") contentType = "image/png";
        else if (ext === ".webp") contentType = "image/webp";
        else if (ext === ".gif") contentType = "image/gif";
        else if (ext === ".svg") contentType = "image/svg+xml";

        // Send the image to the browser
        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400, stale-while-revalidate=43200",
            },
        });
    } catch (error) {
        console.error("Error reading profile picture:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}