"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { useWendyState } from "@/app/context/wendy-context"
import { VendorCard } from "@/components/vendor-card"
import { CreateVendorDialog } from "@/components/create-vendor-dialog"
import { Input } from "@/components/ui/input"

export default function VendorsPage() {
  const { state } = useWendyState()
  const [query, setQuery] = useState("")
  const [kind, setKind] = useState("all")
  const matches = state.vendors.filter((vendor) =>
    (kind === "all" || vendor.type === kind) &&
    [vendor.name, vendor.purpose, vendor.address].some((value) => value?.toLowerCase().includes(query.trim().toLowerCase())),
  )

  return (
    <div className="max-w-7xl mx-auto">
      <header className="planner-intro flex flex-wrap items-end justify-between gap-4">
        <div><h1>Vendors & venues</h1><p>Save a shortlist and keep vendor notes in one place.</p></div>
        <CreateVendorDialog />
      </header>
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative min-w-[175px] flex-1">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input type="search" aria-label="Search vendors and venues" value={query}
            onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or type…" className="bg-white pl-10" />
        </div>
        <select aria-label="Filter by type" value={kind} onChange={(event) => setKind(event.target.value)}
          className="rounded-md border bg-white px-3 text-sm">
          <option value="all">All types</option>
          <option value="venue">Venues</option>
          <option value="vendor">Vendors</option>
        </select>
      </div>
      {matches.length ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {matches.map((vendor) => <VendorCard key={vendor.id} vendor={vendor} />)}
        </div>
      ) : <p role="status">No vendors match those filters.</p>}
    </div>
  )
}
