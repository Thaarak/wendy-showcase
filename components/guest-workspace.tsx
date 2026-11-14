"use client"

import { useEffect, useState } from "react"
import { type Guest, useWendyState } from "@/app/context/wendy-context"
import { GuestTable } from "@/components/guest-table"
import { CreateGuestDialog } from "@/components/create-guest-dialog"

type StoredGuest = { id: number; name: string; email: string; rsvp: Guest["rsvp"] }

export function GuestWorkspace({ live }: { live: boolean }) {
  const { state } = useWendyState()
  const [guests, setGuests] = useState<Guest[]>([])
  const [status, setStatus] = useState(live ? "Loading guests…" : "")

  async function loadGuests() {
    try {
      const response = await fetch("/api/guests", { signal: AbortSignal.timeout(8000) })
      if (!response.ok) throw new Error()
      const rows = await response.json() as StoredGuest[]
      setGuests(rows.map(({ id, name, email, rsvp }) => ({ id: String(id), name, contact: email, rsvp })))
      setStatus("")
    } catch {
      setStatus("Couldn’t load guests. Check that the local Python service is running.")
    }
  }

  useEffect(() => {
    if (live) void loadGuests()
  }, [live])

  async function saveGuest({ name, contact, rsvp }: Pick<Guest, "name" | "contact" | "rsvp">) {
    const response = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ name, email: contact, rsvp }),
    })
    if (!response.ok) throw new Error("Enter a valid email and check that the local service is running.")
    await loadGuests()
  }

  return (
    <div className="max-w-6xl mx-auto">
      <header className="planner-intro flex flex-wrap items-end justify-between gap-4">
        <div><h1>Guest list</h1><p>Track invitations and update RSVPs.</p></div>
        <CreateGuestDialog onCreate={live ? saveGuest : undefined} />
      </header>
      {status && <p role="status" className="mb-4">{status} <button type="button" className="underline" onClick={() => void loadGuests()}>Refresh</button></p>}
      <GuestTable guests={live ? guests : state.guests} onUpdate={live ? saveGuest : undefined} />
    </div>
  )
}
