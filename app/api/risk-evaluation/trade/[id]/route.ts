import { NextRequest, NextResponse } from "next/server";
import { apiBaseUrl } from "@/shared/consts/baseUrl";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const tradeId = params.id;

    const response = await fetch(
      `${apiBaseUrl}/api/risk-evaluation/trade/${tradeId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
        body: JSON.stringify({}),
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