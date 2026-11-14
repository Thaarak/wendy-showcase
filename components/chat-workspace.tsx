"use client"

import { ChatInterface } from "@/components/chat-interface"
import { useWendyState } from "@/app/context/wendy-context"

export function ChatWorkspace({ live }: { live: boolean }) {
  const { state } = useWendyState()
  return (
    <div className="planner-page">
      <header className="planner-intro">
        <h1>Plan your wedding with Wendy</h1>
        <p>Shortlist venues, draft an inquiry, and keep track of who’s coming.</p>
      </header>
      <ChatInterface messages={state.messages} live={live} />
    </div>
  )
}
