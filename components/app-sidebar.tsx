"use client"

import { Calendar, MapPin, Menu, MessageCircle, Users, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const items = [
  { title: "Planning chat", url: "/chat", icon: MessageCircle },
  { title: "Vendors & venues", url: "/vendors", icon: MapPin },
  { title: "Guest list", url: "/guests", icon: Users },
  { title: "Timeline", url: "/calendar", icon: Calendar },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <aside className="planner-sidebar">
      <div className="planner-brand-row">
        <Link className="planner-brand" href="/chat" onClick={() => setOpen(false)}>
          <span aria-hidden="true">W</span>
          <strong>Wendy</strong>
        </Link>
        <button className="planner-menu" type="button" onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="planner-navigation">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav id="planner-navigation" className={open ? "planner-nav planner-nav--open" : "planner-nav"} aria-label="Wedding workspace">
        {items.map(({ title, url, icon: Icon }) => (
          <Link key={url} href={url} aria-current={pathname === url ? "page" : undefined} onClick={() => setOpen(false)}>
            <Icon size={18} aria-hidden="true" />{title}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
