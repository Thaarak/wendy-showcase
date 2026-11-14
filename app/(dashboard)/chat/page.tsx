import { ChatWorkspace } from "@/components/chat-workspace"
import { liveEnabled } from "@/services/live"

export const dynamic = "force-dynamic"

export default function ChatPage() {
  return <ChatWorkspace live={liveEnabled} />
}
