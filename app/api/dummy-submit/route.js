import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const text = formData.get("text");

    let fileInfo = null;
    if (file) {
      fileInfo = {
        name: file.name,
        type: file.type,
        size: file.size,
      };
    }

    return NextResponse.json({
      message: "lorem ipsum dolor sit amet",
      file: fileInfo,
      text: text || "",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 },
    );
  }
}
