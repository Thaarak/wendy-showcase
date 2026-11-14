"use client"

import { useWendyState } from "@/app/context/wendy-context"
import { FullCalendar } from "@/components/full-calendar"
import { CreateEventDialog } from "@/components/create-event-dialog"
import { Calendar } from "lucide-react"

export default function CalendarPage() {
  const { state } = useWendyState()

  return (
    <div className="max-w-7xl mx-auto">
      <header className="planner-intro flex flex-wrap items-end justify-between gap-4">
        <div><h1>Wedding timeline</h1><p>Schedule appointments and track planning milestones.</p></div>
        <CreateEventDialog />
      </header>

      {state.events.length === 0 ? (
        <div className="text-center py-20">
          <div className="wedding-card rounded-3xl p-12 max-w-md mx-auto">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-rose-800 mb-3 luxury-serif">No events scheduled</h3>
            <p className="text-rose-600/70 mb-8 luxury-serif">
              Start planning your perfect timeline with appointments and milestones
            </p>
            <CreateEventDialog />
          </div>
        </div>
      ) : (
        <FullCalendar events={state.events} />
      )}
    </div>
  )
}
