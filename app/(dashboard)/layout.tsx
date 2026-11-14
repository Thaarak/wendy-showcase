import { AppSidebar } from "@/components/app-sidebar"
import { ActionLog } from "@/components/action-log"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="planner-shell">
      <AppSidebar />
      <main className="planner-main">{children}</main>
      <ActionLog />
    </div>
  )
}
