import { GuestWorkspace } from "@/components/guest-workspace"
import { liveEnabled } from "@/services/live"

export const dynamic = "force-dynamic"

export default function GuestsPage() {
  return <GuestWorkspace live={liveEnabled} />
}
