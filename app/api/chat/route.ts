import { NextResponse } from "next/server"
import { demoReply } from "@/services/demo/planner"
import { isLocalRequest, liveEnabled } from "@/services/live"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const message = typeof body?.message === "string" ? body.message.trim() : ""
  if (!message || message.length > 2000) {
    return NextResponse.json({ error: "Enter a message of up to 2,000 characters." }, { status: 400 })
  }

  const history = Array.isArray(body.history)
    ? body.history.slice(-8).filter((entry: unknown) => typeof entry === "string" && entry.length <= 2000)
    : []
  if (liveEnabled) {
    if (!isLocalRequest(request)) return NextResponse.json({ error: "Live mode is local only." }, { status: 403 })
    try {
      const { getAgentOrchestrator } = await import("@/services/agent/orchestrator")
      return NextResponse.json({ reply: await getAgentOrchestrator().processMessage(message, history, body.allowEmail === true) })
    } catch {
      return NextResponse.json({ error: "Live Wendy couldn’t complete that request. Check the local service and configuration." }, { status: 502 })
    }
  }

  const guests = Array.isArray(body.guests) ? body.guests.slice(0, 300).filter(
    (guest: unknown) => !!guest && typeof guest === "object" && "rsvp" in guest && typeof guest.rsvp === "string",
  ) : []
  return NextResponse.json({ reply: demoReply(message, history, guests) })
}
