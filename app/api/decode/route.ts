import { NextRequest, NextResponse } from "next/server";
import { decodeBarrel } from "@/lib/decoder";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { barrelCode } = body;

    if (!barrelCode) {
      return NextResponse.json(
        { error: "barrelCode is required" },
        { status: 400 }
      );
    }

    const result = decodeBarrel(barrelCode);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error decoding barrel:", error);
    return NextResponse.json(
      { error: "Failed to decode barrel" },
      { status: 500 }
    );
  }
}
