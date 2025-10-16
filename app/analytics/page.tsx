"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimateIn } from "@/components/ui/animate-in"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function AnalyticsPage() {
  const { courses, students, attendance, studentGrades } = useStore()
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "")

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  const courseAttendance = selectedCourseId ? attendance.filter((a) => a.courseId === selectedCourseId) : []
  const courseGrades = selectedCourseId ? studentGrades.filter((g) => g.courseId === selectedCourseId) : []

  const attendanceStats = students.map((student) => {
    const records = courseAttendance.filter((a) => a.studentId === student.id)
    const present = records.filter((a) => a.status === "present").length
    const absent = records.filter((a) => a.status === "absent").length
    const leave = records.filter((a) => a.status === "leave").length
    const total = records.length
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "0"

    return {
      name: student.name,
      present,
      absent,
      leave,
      percentage: Number.parseFloat(percentage as string),
    }
  })

  const gradeDistribution = courseGrades.reduce(
    (acc, grade) => {
      const existing = acc.find((g) => g.grade === grade.grade)
      if (existing) {
        existing.count += 1
      } else {
        acc.push({ grade: grade.grade, count: 1 })
      }
      return acc
    },
    [] as Array<{ grade: string; count: number }>,
  )

  const coAttainment = selectedCourse
    ? selectedCourse.outcomes.map((outcome) => {
        const studentMarks = selectedCourse.students.map((s) => s.marks[outcome.id] || 0)
        const average = studentMarks.length > 0 ? studentMarks.reduce((a, b) => a + b, 0) / studentMarks.length : 0
        const attainmentPercentage = (average / 100) * 100

        return {
          name: outcome.code,
          attainment: Math.round(attainmentPercentage * 100) / 100,
          target: outcome.target,
          status: attainmentPercentage >= outcome.target ? "Achieved" : "Below Target",
        }
      })
    : []

  const gpaDistribution = courseGrades.map((grade) => ({
    name: grade.studentId,
    gpa: grade.gpa,
  }))

  const COLORS = ["#00D8FF", "#06B6D4", "#0891B2", "#0E7490", "#164E63"]

  const stats = {
    totalStudents: students.length,
    totalCourses: courses.length,
    averageAttendance:
      attendanceStats.length > 0
        ? (attendanceStats.reduce((sum, s) => sum + s.percentage, 0) / attendanceStats.length).toFixed(1)
        : "0",
    averageGPA:
      courseGrades.length > 0
        ? (courseGrades.reduce((sum, g) => sum + g.gpa, 0) / courseGrades.length).toFixed(2)
        : "0",
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 space-y-8 relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
        </div>
        <AnimateIn>
          <div>
            <h1 className="text-3xl font-bold">Performance Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights into student performance and course outcomes
            </p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-4 gap-4">
          {[stats.totalStudents, stats.totalCourses, `${stats.averageAttendance}%`, stats.averageGPA].map(
            (value, i) => (
              <AnimateIn key={i} delayMs={i * 60}>
                <Card className="bg-card/70 backdrop-blur border-border/60">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-muted-foreground text-sm">
                        {i === 0 ? "Total Students" : i === 1 ? "Total Courses" : i === 2 ? "Avg Attendance" : "Avg GPA"}
                      </p>
                      <p className="text-3xl font-bold text-cyan-500">{value}</p>
                    </div>
                  </CardContent>
                </Card>
              </AnimateIn>
            ),
          )}
        </div>

        {courses.length > 0 && (
          <>
            <AnimateIn>
              <Card className="bg-card/70 backdrop-blur border-border/60">
                <CardHeader>
                  <CardTitle>Select Course for Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </CardContent>
              </Card>
            </AnimateIn>

            {selectedCourse && (
              <>
                <AnimateIn>
                  <Card className="bg-card/70 backdrop-blur border-border/60">
                    <CardHeader>
                      <CardTitle>Course Outcome Attainment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={coAttainment}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="attainment" fill="#00D8FF" name="Attainment %" />
                          <Bar dataKey="target" fill="#06B6D4" name="Target %" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </AnimateIn>

                {attendanceStats.length > 0 && (
                  <AnimateIn>
                    <Card className="bg-card/70 backdrop-blur border-border/60">
                      <CardHeader>
                        <CardTitle>Student Attendance Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={attendanceStats}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="present" fill="#10B981" name="Present" />
                            <Bar dataKey="absent" fill="#EF4444" name="Absent" />
                            <Bar dataKey="leave" fill="#F59E0B" name="Leave" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </AnimateIn>
                )}

                {gradeDistribution.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <AnimateIn>
                      <Card className="bg-card/70 backdrop-blur border-border/60">
                        <CardHeader>
                          <CardTitle>Grade Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={gradeDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ grade, count }) => `${grade}: ${count}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {gradeDistribution.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </AnimateIn>

                    <AnimateIn delayMs={80}>
                      <Card className="bg-card/70 backdrop-blur border-border/60">
                        <CardHeader>
                          <CardTitle>GPA Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={gpaDistribution}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                              <YAxis />
                              <Tooltip />
                              <Line type="monotone" dataKey="gpa" stroke="#00D8FF" strokeWidth={2} />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </AnimateIn>
                  </div>
                )}

                <AnimateIn>
                  <Card className="bg-card/70 backdrop-blur border-border/60">
                    <CardHeader>
                      <CardTitle>Course Outcome Attainment Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2 px-2">Outcome</th>
                              <th className="text-center py-2 px-2">Attainment %</th>
                              <th className="text-center py-2 px-2">Target %</th>
                              <th className="text-center py-2 px-2">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {coAttainment.map((outcome) => (
                              <tr key={outcome.name} className="border-b hover:bg-muted/50">
                                <td className="py-2 px-2 font-semibold">{outcome.name}</td>
                                <td className="text-center py-2 px-2">{outcome.attainment}%</td>
                                <td className="text-center py-2 px-2">{outcome.target}%</td>
                                <td className="text-center py-2 px-2">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                      outcome.status === "Achieved"
                                        ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                        : "bg-red-500/20 text-red-700 dark:text-red-400"
                                    }`}
                                  >
                                    {outcome.status}
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
          </>
        )}
      </div>
    </div>
  )
}
