import { NextRequest, NextResponse } from "next/server";
import { generateChartVN } from "../../lib/tuvi-engine/ziwei/algorithm-vn";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    const year = parseInt(searchParams.get("year") ?? "1990");
    const month = parseInt(searchParams.get("month") ?? "1");
    const day = parseInt(searchParams.get("day") ?? "1");
    const timeIndex = parseInt(searchParams.get("timeIndex") ?? "0");
    const gender = (searchParams.get("gender") ?? "male") as "male" | "female";
    const namXem = parseInt(searchParams.get("namXem") ?? String(new Date().getFullYear()));

    const chart = generateChartVN(
      { year, month, day, timeIndex, gender },
      namXem
    );

    return NextResponse.json({ success: true, data: chart });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}