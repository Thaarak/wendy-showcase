"use client"

import { type FormEvent, useEffect, useRef, useState } from "react"
import { ArrowRight, ArrowUp, Mail, MapPin, Users } from "lucide-react"
import { type Message, useWendyState } from "@/app/context/wendy-context"
import { demoPrompts } from "@/services/demo/planner"

export function ChatInterface({ messages, live }: { messages: Message[]; live: boolean }) {
  const { state, dispatch } = useWendyState()
  const [input, setInput] = useState("")
  const [pending, setPending] = useState(false)
  const [failed, setFailed] = useState<string | null>(null)
  const [allowEmail, setAllowEmail] = useState(false)
  const busy = useRef(false)
  const transcript = useRef<HTMLDivElement>(null)
  const realMessages = messages.filter((message) => message.id !== "welcome")

  useEffect(() => {
    if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight
  }, [messages, pending, failed])

  function append(sender: Message["sender"], text: string) {
    dispatch({ type: "add_message", payload: { id: crypto.randomUUID(), sender, text, ts: new Date().toISOString() } })
  }

  async function send(text: string, retry = false) {
    const message = text.trim()
    if (!message || busy.current) return
    busy.current = true
    setPending(true)
    setFailed(null)
    setInput("")
    const confirmed = live && allowEmail && !retry
    setAllowEmail(false)
    if (!retry) append("user", message)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(45_000),
        body: JSON.stringify({
          message,
          history: messages.filter((entry) => entry.sender === "user").map((entry) => entry.text).slice(-8),
          guests: state.guests.map(({ rsvp }) => ({ rsvp })),
          allowEmail: confirmed,
        }),
      })
      const data = await response.json()
      if (!response.ok || typeof data.reply !== "string") throw new Error("Reply unavailable")
      append("wendy", data.reply)
    } catch {
      if (confirmed) {
        append("wendy", "Wendy couldn’t verify delivery. Check your sent mail before trying again.")
      } else {
        setFailed(message)
      }
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!failed) void send(input)
  }

  return (
    <section className="planner-chat" aria-label="Planning chat">
      <div className="planner-chat-top">
        <span>Planning chat</span>
        <span className="planner-mode">{live ? "Local live mode" : "Demo mode"}</span>
      </div>
      <div ref={transcript} className="planner-transcript" aria-live="polite" aria-busy={pending}>
        {realMessages.length === 0 ? (
          <div className="planner-empty">
            <p>{live ? "Ask about a venue, an RSVP, or a wedding task." : "Choose a prompt to explore a sample wedding."}</p>
            {!live && <div className="planner-prompts">
              {demoPrompts.map((prompt, index) => {
                const Icon = [MapPin, Mail, Users][index]
                return <button key={prompt} type="button" onClick={() => void send(prompt)} disabled={pending}>
                  <Icon size={17} aria-hidden="true" />
                  <span>{prompt}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              })}
            </div>}
          </div>
        ) : realMessages.map(({ id, sender, text }) => (
          <article key={id} className={`planner-message planner-message--${sender}`}>
            <strong>{sender === "user" ? "You" : "Wendy"}</strong>
            <div>{text}</div>
          </article>
        ))}
        {pending && <p className="planner-status" role="status">Wendy is preparing a reply…</p>}
        {failed && <div className="planner-status" role="alert">
          The reply didn’t come through.{" "}
          <button type="button" onClick={() => void send(failed, true)}>Retry reply</button>
        </div>}
      </div>
      <form onSubmit={submit} className="planner-form">
        <div className="planner-composer">
          <label className="sr-only" htmlFor="planner-message">Message Wendy</label>
          <input id="planner-message" value={input} onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about venues, guests, or your timeline…" autoComplete="off" maxLength={2000} disabled={pending || !!failed} />
          <button type="submit" disabled={pending || !!failed || !input.trim()}>Send <ArrowUp size={16} aria-hidden="true" /></button>
        </div>
        {live
          ? <label className="planner-help"><input type="checkbox" checked={allowEmail} onChange={(event) => setAllowEmail(event.target.checked)} disabled={pending || !!failed} /> Allow a real email for the next message</label>
          : <p className="planner-help">Fictional sample data. Email drafts stay in the demo.</p>}
      </form>
    </section>
  )
}
