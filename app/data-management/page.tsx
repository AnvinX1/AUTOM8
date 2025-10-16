"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimateIn } from "@/components/ui/animate-in"

export default function DataManagementPage() {
  const store = useStore()
  const [exportStatus, setExportStatus] = useState<string>("")
  const [importStatus, setImportStatus] = useState<string>("")

  const handleExportAllData = () => {
    const data = {
      courses: store.courses,
      students: store.students,
      attendance: store.attendance,
      gradingScales: store.gradingScales,
      studentGrades: store.studentGrades,
      settings: store.settings,
      exportDate: new Date().toISOString(),
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `autom8_backup_${new Date().toISOString().split("T")[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)

    setExportStatus("All data exported successfully")
    setTimeout(() => setExportStatus(""), 3000)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)

        if (data.courses) store.updateCourse(store.courses[0]?.id || "", { students: [] })
        if (data.students) {
          data.students.forEach((student: any) => store.addStudent(student))
        }
        if (data.attendance) {
          data.attendance.forEach((record: any) => store.addAttendance(record))
        }
        if (data.gradingScales) {
          data.gradingScales.forEach((scale: any) => store.addGradingScale(scale))
        }
        if (data.studentGrades) {
          data.studentGrades.forEach((grade: any) => store.addStudentGrade(grade))
        }
        if (data.settings) {
          store.updateSettings(data.settings)
        }

        setImportStatus("Data imported successfully")
        setTimeout(() => setImportStatus(""), 3000)
      } catch (error) {
        setImportStatus("Error importing data. Please check the file format.")
        setTimeout(() => setImportStatus(""), 3000)
      }
    }
    reader.readAsText(file)
  }

  const handleClearAllData = () => {
    if (window.confirm("Are you sure you want to delete all data? This action cannot be undone.")) {
      localStorage.removeItem("autom8-store")
      window.location.reload()
    }
  }

  const stats = {
    totalCourses: store.courses.length,
    totalStudents: store.students.length,
    totalAttendanceRecords: store.attendance.length,
    totalGradingScales: store.gradingScales.length,
    totalStudentGrades: store.studentGrades.length,
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 space-y-6">
        <AnimateIn>
          <div>
            <h1 className="text-3xl font-bold">Data Management</h1>
            <p className="text-muted-foreground mt-2">Backup, restore, and manage your Autom8 data</p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-5 gap-4">
          <AnimateIn>
            <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Courses</p>
                <p className="text-3xl font-bold text-cyan-500">{stats.totalCourses}</p>
              </div>
            </CardContent>
            </Card>
          </AnimateIn>
          <AnimateIn delayMs={40}>
            <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Students</p>
                <p className="text-3xl font-bold text-cyan-500">{stats.totalStudents}</p>
              </div>
            </CardContent>
            </Card>
          </AnimateIn>
          <AnimateIn delayMs={80}>
            <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Attendance</p>
                <p className="text-3xl font-bold text-cyan-500">{stats.totalAttendanceRecords}</p>
              </div>
            </CardContent>
            </Card>
          </AnimateIn>
          <AnimateIn delayMs={120}>
            <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Grading Scales</p>
                <p className="text-3xl font-bold text-cyan-500">{stats.totalGradingScales}</p>
              </div>
            </CardContent>
            </Card>
          </AnimateIn>
          <AnimateIn delayMs={160}>
            <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm">Grades</p>
                <p className="text-3xl font-bold text-cyan-500">{stats.totalStudentGrades}</p>
              </div>
            </CardContent>
            </Card>
          </AnimateIn>
        </div>

        <AnimateIn>
          <Card>
          <CardHeader>
            <CardTitle>Backup & Restore</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Export All Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Download a complete backup of all your Autom8 data as a JSON file. This includes courses, students,
                attendance, grades, and settings.
              </p>
              <Button onClick={handleExportAllData} className="bg-green-500 hover:bg-green-600">
                📥 Export All Data
              </Button>
              {exportStatus && (
                <div className="mt-3 p-3 rounded-lg bg-green-500/20 text-green-700 dark:text-green-400 text-sm">
                  {exportStatus}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Import Data</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Restore data from a previously exported JSON backup file.
              </p>
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-file" />
              <label htmlFor="import-file">
                <Button asChild className="bg-blue-500 hover:bg-blue-600">
                  <span>📤 Import Data</span>
                </Button>
              </label>
              {importStatus && (
                <div className="mt-3 p-3 rounded-lg bg-blue-500/20 text-blue-700 dark:text-blue-400 text-sm">
                  {importStatus}
                </div>
              )}
            </div>
          </CardContent>
          </Card>
        </AnimateIn>

        <AnimateIn>
          <Card>
          <CardHeader>
            <CardTitle>Data Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span>Total Courses</span>
                <span className="font-semibold">{stats.totalCourses}</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span>Total Students</span>
                <span className="font-semibold">{stats.totalStudents}</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span>Attendance Records</span>
                <span className="font-semibold">{stats.totalAttendanceRecords}</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span>Grading Scales</span>
                <span className="font-semibold">{stats.totalGradingScales}</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span>Student Grades</span>
                <span className="font-semibold">{stats.totalStudentGrades}</span>
              </div>
            </div>
          </CardContent>
          </Card>
        </AnimateIn>

        <AnimateIn>
          <Card className="border-red-500/50 bg-red-500/5">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Permanently delete all data. This action cannot be undone. Make sure to export a backup first.
            </p>
            <Button onClick={handleClearAllData} variant="destructive">
              🗑️ Clear All Data
            </Button>
          </CardContent>
          </Card>
        </AnimateIn>
      </div>
    </div>
  )
}
