"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AnimateIn } from "@/components/ui/animate-in"
import { BookOpen, Users2, Gauge, Bell, ArrowRight, Sparkles } from "lucide-react"

export default function Dashboard() {
  const { courses, students, attendance, studentGrades } = useStore()

  const totalCourses = courses.length
  const totalStudents = students.length
  const avgAttainment =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, course) => {
            const courseAttainment = course.outcomes.reduce((outSum, outcome) => {
              const courseStudents = course.students
              const attainedCount = courseStudents.filter((s) => (s.marks[outcome.id] || 0) >= outcome.target).length
              return outSum + (courseStudents.length > 0 ? (attainedCount / courseStudents.length) * 100 : 0)
            }, 0)
            return sum + (course.outcomes.length > 0 ? courseAttainment / course.outcomes.length : 0)
          }, 0) / courses.length,
        )
      : 0

  const alerts = []

  students.forEach((student) => {
    const studentAttendance = attendance.filter((a) => a.studentId === student.id)
    if (studentAttendance.length > 0) {
      const present = studentAttendance.filter((a) => a.status === "present").length
      const percentage = (present / studentAttendance.length) * 100
      if (percentage < 75) {
        alerts.push({
          type: "attendance",
          severity: "warning",
          message: `${student.name} has low attendance (${percentage.toFixed(1)}%)`,
        })
      }
    }
  })

  studentGrades.forEach((grade) => {
    if (grade.gpa < 2.0) {
      const student = students.find((s) => s.id === grade.studentId)
      if (student) {
        alerts.push({
          type: "performance",
          severity: "critical",
          message: `${student.name} has low GPA (${grade.gpa.toFixed(2)}) in a course`,
        })
      }
    }
  })

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 space-y-6 relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
        </div>

        <AnimateIn>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
              <p className="text-muted-foreground mt-2">Welcome to Autom8 - Course Outcome Attainment Automation</p>
            </div>
            <Link href="/courses">
              <Button className="bg-cyan-500 hover:bg-cyan-600 gap-2">
                <Sparkles size={16} /> Quick Start <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AnimateIn>
            <Card className="bg-card/70 backdrop-blur border-border/60 hover:border-cyan-500/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-500">
                  <BookOpen size={16} />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground mt-1">Active courses</p>
            </CardContent>
            </Card>
          </AnimateIn>

          <AnimateIn delayMs={60}>
            <Card className="bg-card/70 backdrop-blur border-border/60 hover:border-cyan-500/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-500">
                  <Users2 size={16} />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered students</p>
            </CardContent>
            </Card>
          </AnimateIn>

          <AnimateIn delayMs={120}>
            <Card className="bg-card/70 backdrop-blur border-border/60 hover:border-cyan-500/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Attainment</CardTitle>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-500">
                  <Gauge size={16} />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-cyan-500">{avgAttainment}%</div>
              <p className="text-xs text-muted-foreground mt-1">Overall CO attainment</p>
            </CardContent>
            </Card>
          </AnimateIn>

          <AnimateIn delayMs={180}>
            <Card className="bg-card/70 backdrop-blur border-border/60 hover:border-cyan-500/40 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Alerts</CardTitle>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-red-500/20 to-transparent text-red-500">
                  <Bell size={16} />
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{alerts.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active alerts</p>
            </CardContent>
            </Card>
          </AnimateIn>
        </div>

        {alerts.length > 0 && (
          <AnimateIn>
            <Card className="bg-card/70 backdrop-blur border-red-500/30">
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts.slice(0, 5).map((alert, idx) => (
                    <AnimateIn key={idx} delayMs={idx * 40}>
                      <div
                        className={`p-3 rounded-lg text-sm ring-1 ${
                          alert.severity === "critical"
                            ? "bg-red-500/10 ring-red-500/30 text-red-600 dark:text-red-400"
                            : "bg-yellow-500/10 ring-yellow-500/30 text-yellow-700 dark:text-yellow-400"
                        }`}
                      >
                        {alert.severity === "critical" ? "🔴" : "🟡"} {alert.message}
                      </div>
                    </AnimateIn>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimateIn>
        )}

        <AnimateIn>
          <Card className="bg-card/70 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>
              {courses.length === 0
                ? "No courses yet. Create your first course to get started."
                : `Showing ${Math.min(5, courses.length)} of ${courses.length} courses`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-4">📚</p>
                <p className="text-muted-foreground mb-4">No courses created yet</p>
                <Link href="/courses">
                  <Button>Create First Course</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 5).map((course, idx) => (
                  <AnimateIn key={course.id} delayMs={idx * 40}>
                    <Link href={`/courses/${course.id}`}>
                      <div className="p-3 border border-border/60 rounded-lg hover:border-cyan-500/40 hover:bg-accent/40 transition-colors cursor-pointer">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{course.name}</p>
                            <p className="text-sm text-muted-foreground">{course.code}</p>
                          </div>
                          <span className="text-xs bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 px-2 py-1 rounded">
                            {course.students.length} students
                          </span>
                        </div>
                      </div>
                    </Link>
                  </AnimateIn>
                ))}
              </div>
            )}
          </CardContent>
          </Card>
        </AnimateIn>

        <div className="grid grid-cols-2 gap-4">
          <AnimateIn>
            <Card className="bg-card/70 backdrop-blur border-border/60">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/courses">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  📚 Manage Courses
                </Button>
              </Link>
              <Link href="/students">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  👥 Manage Students
                </Button>
              </Link>
              <Link href="/marks">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  📝 Enter Marks
                </Button>
              </Link>
            </CardContent>
            </Card>
          </AnimateIn>

          <AnimateIn delayMs={80}>
            <Card className="bg-card/70 backdrop-blur border-border/60">
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/analytics">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  📊 View Analytics
                </Button>
              </Link>
              <Link href="/reports">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  📈 Generate Reports
                </Button>
              </Link>
              <Link href="/attendance">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  ✓ Track Attendance
                </Button>
              </Link>
            </CardContent>
            </Card>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}
