export const demoPrompts = [
  "Find venues for 120 guests under $9,000",
  "Draft a venue inquiry",
  "Show the guest RSVP summary",
]

export const demoVenues = [
  { name: "Juniper House", guests: 140, price: 7800, detail: "Garden ceremony and indoor dining", email: "juniper@example.com" },
  { name: "Cedar Hall", guests: 180, price: 8800, detail: "Indoor ballroom with an outdoor terrace", email: "cedar@example.com" },
  { name: "The Willow Room", guests: 90, price: 5400, detail: "A smaller room for an intimate reception", email: "willow@example.com" },
]

export function demoReply(
  message: string,
  history: string[],
  guests: { name: string; rsvp: string }[],
): string {
  const lower = message.toLowerCase()
  const context = [...history, message].join(" ")
  if (/rsvp|guest list|guest summary/.test(lower)) {
    const count = (status: string) => guests.filter((guest) => guest.rsvp === status).length
    return `Guest list\n\n${count("yes")} attending · ${count("maybe")} tentative · ${count("no")} declined · ${count("unknown")} awaiting a reply.\n\nYou can update individual RSVPs in Guest List.`
  }

  if (/draft|inquiry|book|reserve/.test(lower)) {
    const venue = demoVenues.find((entry) => lower.includes(entry.name.toLowerCase()))
      ?? demoVenues.find((entry) => context.toLowerCase().includes(entry.name.toLowerCase()))
      ?? demoVenues[0]
    const party = context.match(/(\d+)\s*(?:guests|people)\b/i)?.[1]
    const date = context.match(/\b\d{4}-\d{2}-\d{2}\b/)?.[0]
    return [
      `Draft inquiry · ${venue.name}`,
      `To: ${venue.email}\nSubject: Wedding availability and pricing`,
      `Hello ${venue.name} team,\n\nWe’re planning a wedding${party ? ` for ${party} guests` : ""}${date ? ` on ${date}` : ""}. Could you share your availability, package pricing, and what’s included? We’d also love to know how to arrange a tour.\n\nThank you!`,
      "Preview only. No email was sent and no reservation was made.",
    ].join("\n\n")
  }

  if (/venue|location|shortlist/.test(lower)) {
    const guests = Number(message.match(/(\d+)\s*(?:guests|people)\b/i)?.[1] ?? 0)
    const price = Number((message.match(/\$([\d,]+)/)?.[1] ?? "Infinity").replaceAll(",", ""))
    const matches = demoVenues.filter((venue) => venue.guests >= guests && venue.price <= price)
    if (!matches.length) return "No sample venues fit those limits. Try a smaller guest count or a higher budget."
    return [
      "Venue shortlist",
      ...matches.map((venue) => `${venue.name} · up to ${venue.guests} guests · $${venue.price.toLocaleString("en-US")}\n${venue.detail}.`),
      `Try “Draft an inquiry for ${matches[0].name}” to preview an email.`,
    ].join("\n\n")
  }

  if (/calendar|timeline|checklist/.test(lower)) {
    return "Start with a venue tour, then schedule a catering tasting and a final guest-count deadline. Open Timeline to add dates and notes."
  }

  if (/invite/.test(lower)) {
    return "Invitation draft\n\nWe’d love for you to join us for our wedding! Please reply with your RSVP and any dietary requirements. We’ll share the date, location, and schedule when they’re confirmed.\n\nPreview only. No email was sent."
  }

  return "I can walk through a venue shortlist, draft an inquiry or invitation, or summarize the guest RSVPs. Pick a sample prompt to begin."
}
