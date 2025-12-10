import { NextRequest, NextResponse } from "next/server";
import { apiBaseUrl } from "@/shared/consts/baseUrl";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    const response = await fetch(
      `${apiBaseUrl}/api/trades`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
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

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

    const response = await fetch(
      `${apiBaseUrl}/api/trades`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
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
