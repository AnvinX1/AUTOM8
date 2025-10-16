"use client"

import type React from "react"
import { useEffect } from "react"
import { ThemeToggle } from "./theme-toggle"
import Dock from "@/components/ui/dock"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Home, BarChart3, Users2, BookOpen, ClipboardList, CalendarCheck2, Settings, FileBarChart2, Database } from "lucide-react"
import { useStore } from "@/lib/store"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useStore.getState().loadFromStorage()
  }, [])

  const router = useRouter()

  const dockItems = [
    { icon: <Home size={18} />, label: "Dashboard", onClick: () => router.push("/") },
    { icon: <BookOpen size={18} />, label: "Courses", onClick: () => router.push("/courses") },
    { icon: <Users2 size={18} />, label: "Students", onClick: () => router.push("/students") },
    { icon: <CalendarCheck2 size={18} />, label: "Attendance", onClick: () => router.push("/attendance") },
    { icon: <ClipboardList size={18} />, label: "Marks", onClick: () => router.push("/marks") },
    { icon: <BarChart3 size={18} />, label: "Analytics", onClick: () => router.push("/analytics") },
    { icon: <FileBarChart2 size={18} />, label: "Reports", onClick: () => router.push("/reports") },
    { icon: <Database size={18} />, label: "Data", onClick: () => router.push("/data-management") },
    { icon: <Settings size={18} />, label: "Settings", onClick: () => router.push("/settings") },
  ]

  return (
    <div className="flex h-screen bg-background">
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-border bg-card p-4 flex justify-end">
          <ThemeToggle />
        </header>
        <div className="flex-1 overflow-auto">
          <div className="p-6 pb-24">{children}</div>
        </div>
        <Dock items={dockItems} />
      </main>
    </div>
  )
}
