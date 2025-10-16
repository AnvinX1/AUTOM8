"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { AnimateIn } from "@/components/ui/animate-in"

export default function ReportsPage() {
  const { courses, settings } = useStore()
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "")
  const [exportStatus, setExportStatus] = useState<string>("")

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  const getAttainmentData = () => {
    if (!selectedCourse) return []

    return selectedCourse.outcomes.map((outcome) => {
      const students = selectedCourse.students
      const attainedCount = students.filter((s) => (s.marks[outcome.id] || 0) >= outcome.target).length
      const attainmentPercentage = students.length > 0 ? (attainedCount / students.length) * 100 : 0

      return {
        name: outcome.code,
        attainment: Math.round(attainmentPercentage),
        target: outcome.target,
        students: students.length,
        attained: attainedCount,
      }
    })
  }

  const getStudentPerformanceData = () => {
    if (!selectedCourse) return []

    return selectedCourse.students.map((student) => {
      const avgMarks =
        Object.values(student.marks).reduce((a, b) => a + b, 0) / Object.values(student.marks).length || 0

      return {
        name: student.studentName,
        average: Math.round(avgMarks),
      }
    })
  }

  const attainmentData = getAttainmentData()
  const performanceData = getStudentPerformanceData()

  const overallAttainment =
    attainmentData.length > 0
      ? Math.round(attainmentData.reduce((sum, d) => sum + d.attainment, 0) / attainmentData.length)
      : 0

  const handleExportReport = () => {
    if (!selectedCourse) return

    const headers = ["CO", "Description", "Attained", "Total", "Attainment %", "Target %", "Status"]
    const rows = attainmentData.map((row) => [
      row.name,
      selectedCourse.outcomes.find((o) => o.code === row.name)?.description || "-",
      row.attained,
      row.students,
      row.attainment,
      row.target,
      row.attainment >= row.target ? "Met" : "Not Met",
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedCourse.code}_attainment_report_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    setExportStatus("Report exported successfully")
    setTimeout(() => setExportStatus(""), 3000)
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 space-y-6">
        <AnimateIn>
          <div>
            <h1 className="text-3xl font-bold">Attainment Reports</h1>
            <p className="text-muted-foreground mt-2">Visualize course outcome attainment metrics and export reports</p>
          </div>
        </AnimateIn>

        {courses.length === 0 ? (
          <AnimateIn>
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground">No courses available. Create a course first.</p>
              </CardContent>
            </Card>
          </AnimateIn>
        ) : (
          <div className="space-y-6">
            <AnimateIn>
              <Card>
              <CardHeader>
                <CardTitle>Select Course</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
              </Card>
            </AnimateIn>

            {selectedCourse && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <AnimateIn>
                    <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Overall Attainment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-cyan-500">{overallAttainment}%</div>
                      <p className="text-xs text-muted-foreground mt-1">Target: {settings.targetPercentage}%</p>
                    </CardContent>
                    </Card>
                  </AnimateIn>

                  <AnimateIn delayMs={60}>
                    <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{selectedCourse.students.length}</div>
                    </CardContent>
                    </Card>
                  </AnimateIn>

                  <AnimateIn delayMs={120}>
                    <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Course Outcomes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{selectedCourse.outcomes.length}</div>
                    </CardContent>
                    </Card>
                  </AnimateIn>
                </div>

                <AnimateIn>
                  <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>CO Attainment Analysis</CardTitle>
                      <Button onClick={handleExportReport} className="bg-green-500 hover:bg-green-600">
                        📥 Export Report
                      </Button>
                    </div>
                    <CardDescription>Attainment percentage vs target for each course outcome</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {attainmentData.length > 0 ? (
                      <>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={attainmentData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="attainment" fill="#00D8FF" name="Attainment %" />
                            <Bar dataKey="target" fill="#888888" name="Target %" />
                          </BarChart>
                        </ResponsiveContainer>
                        {exportStatus && (
                          <div className="mt-4 p-3 rounded-lg bg-green-500/20 text-green-700 dark:text-green-400 text-sm">
                            {exportStatus}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No data available. Upload marks to see attainment analysis.
                      </p>
                    )}
                  </CardContent>
                  </Card>
                </AnimateIn>

                {performanceData.length > 0 && (
                  <AnimateIn>
                    <Card>
                    <CardHeader>
                      <CardTitle>Student Performance Distribution</CardTitle>
                      <CardDescription>Average marks across all course outcomes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="average" stroke="#00D8FF" name="Average Marks" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                    </Card>
                  </AnimateIn>
                )}

                <AnimateIn>
                  <Card>
                  <CardHeader>
                    <CardTitle>Detailed Attainment Table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-2">CO</th>
                            <th className="text-left py-2 px-2">Description</th>
                            <th className="text-right py-2 px-2">Attained</th>
                            <th className="text-right py-2 px-2">Total</th>
                            <th className="text-right py-2 px-2">Attainment %</th>
                            <th className="text-right py-2 px-2">Target %</th>
                            <th className="text-center py-2 px-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attainmentData.map((row) => (
                            <tr key={row.name} className="border-b border-border">
                              <td className="py-2 px-2 font-medium">{row.name}</td>
                              <td className="py-2 px-2 text-muted-foreground">
                                {selectedCourse.outcomes.find((o) => o.code === row.name)?.description || "-"}
                              </td>
                              <td className="text-right py-2 px-2">{row.attained}</td>
                              <td className="text-right py-2 px-2">{row.students}</td>
                              <td className="text-right py-2 px-2 font-semibold text-cyan-500">{row.attainment}%</td>
                              <td className="text-right py-2 px-2">{row.target}%</td>
                              <td className="text-center py-2 px-2">
                                <span
                                  className={`text-xs px-2 py-1 rounded ${
                                    row.attainment >= row.target
                                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                      : "bg-red-500/20 text-red-700 dark:text-red-400"
                                  }`}
                                >
                                  {row.attainment >= row.target ? "Met" : "Not Met"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  </Card>
                </AnimateIn>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
