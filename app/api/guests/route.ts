import { NextResponse } from "next/server"
import { isLocalRequest, liveEnabled } from "@/services/live"
import { getMCPClient } from "@/services/mcp/client"

export async function GET(request: Request) {
  if (!liveEnabled || !isLocalRequest(request)) return NextResponse.json({ error: "Live guests are local only." }, { status: 403 })
  try {
    const guests = await getMCPClient().listGuests()
    return NextResponse.json(guests)
  } catch {
    return NextResponse.json({ error: "Couldn’t load guests from the local service." }, { status: 502 })
  }
}

export async function POST(request: Request) {
  if (!liveEnabled || !isLocalRequest(request)) return NextResponse.json({ error: "Live guests are local only." }, { status: 403 })
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === "string" ? body.email.trim() : ""
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !name || name.length > 200 ||
      !["yes", "no", "maybe", "unknown"].includes(body?.rsvp)) {
    return NextResponse.json({ error: "Enter a guest name, valid email, and RSVP." }, { status: 400 })
  }
  try {
    const response = await fetch("http://localhost:8000/resources/save_guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, rsvp: body.rsvp }),
      signal: AbortSignal.timeout(6000),
    })
    if (!response.ok) throw new Error("Save failed")
    return NextResponse.json(await response.json())
  } catch {
    return NextResponse.json({ error: "Couldn’t save the guest to the local service." }, { status: 502 })
  }
}
