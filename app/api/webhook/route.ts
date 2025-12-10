import { NextRequest, NextResponse } from "next/server";
import { apiBaseUrl } from "@/shared/consts/baseUrl";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${apiBaseUrl}/api/webhook/trade`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al conectar con el servidor" },
      { status: 500 }
    );
  }
}