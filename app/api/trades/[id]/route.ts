import { NextRequest, NextResponse } from "next/server";
import { apiBaseUrl } from "@/shared/consts/baseUrl";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    const body = await request.json();
    const {id} = await params

    const response = await fetch(
      `${apiBaseUrl}/api/trades/${id}`,
      {
        method: "PUT",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    console.log({ authHeader })
    console.log({ apiBaseUrl })
    
    const {id} = await params

    const response = await fetch(
      `${apiBaseUrl}/api/trades/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader || "",
        },
      }
    );
    console.log("status:", response.status)
    const data = await response.json();
    console.log({data})
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Error al conectar con el servidor" },
      { status: 500 }
    );
  }
}
