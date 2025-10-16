"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimateIn } from "@/components/ui/animate-in"

export default function StudentPerformancePage() {
  const { students, courses, studentGrades, attendance } = useStore()
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || "")

  const selectedStudent = students.find((s) => s.id === selectedStudentId)
  const studentCourseGrades = selectedStudentId ? studentGrades.filter((g) => g.studentId === selectedStudentId) : []
  const studentAttendance = selectedStudentId ? attendance.filter((a) => a.studentId === selectedStudentId) : []

  const attendanceByCourse = courses.map((course) => {
    const records = studentAttendance.filter((a) => a.courseId === course.id)
    const present = records.filter((a) => a.status === "present").length
    const total = records.length
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "N/A"

    return {
      courseCode: course.code,
      courseName: course.name,
      present,
      total,
      percentage,
    }
  })

  const overallStats = {
    totalCourses: studentCourseGrades.length,
    averageGPA:
      studentCourseGrades.length > 0
        ? (studentCourseGrades.reduce((sum, g) => sum + g.gpa, 0) / studentCourseGrades.length).toFixed(2)
        : "0",
    highestGPA: studentCourseGrades.length > 0 ? Math.max(...studentCourseGrades.map((g) => g.gpa)).toFixed(2) : "0",
    lowestGPA: studentCourseGrades.length > 0 ? Math.min(...studentCourseGrades.map((g) => g.gpa)).toFixed(2) : "0",
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 space-y-6">
        <AnimateIn>
          <div>
            <h1 className="text-3xl font-bold">Student Performance Tracking</h1>
            <p className="text-muted-foreground mt-2">Monitor individual student progress and performance metrics</p>
          </div>
        </AnimateIn>

        {students.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <p className="text-muted-foreground">No students registered yet.</p>
            </CardContent>
          </Card>
        ) : (
          <>
          <AnimateIn>
            <Card>
              <CardHeader>
                <CardTitle>Select Student</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.rollNumber})
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          </AnimateIn>

            {selectedStudent && (
              <>
                <div className="grid grid-cols-4 gap-4">
                  <AnimateIn>
                    <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">Total Courses</p>
                        <p className="text-3xl font-bold text-cyan-500">{overallStats.totalCourses}</p>
                      </div>
                    </CardContent>
                    </Card>
                  </AnimateIn>
                  <AnimateIn delayMs={60}>
                    <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">Average GPA</p>
                        <p className="text-3xl font-bold text-cyan-500">{overallStats.averageGPA}</p>
                      </div>
                    </CardContent>
                    </Card>
                  </AnimateIn>
                  <AnimateIn delayMs={120}>
                    <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">Highest GPA</p>
                        <p className="text-3xl font-bold text-green-500">{overallStats.highestGPA}</p>
                      </div>
                    </CardContent>
                    </Card>
                  </AnimateIn>
                  <AnimateIn delayMs={180}>
                    <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-muted-foreground text-sm">Lowest GPA</p>
                        <p className="text-3xl font-bold text-red-500">{overallStats.lowestGPA}</p>
                      </div>
                    </CardContent>
                    </Card>
                  </AnimateIn>
                </div>

                <AnimateIn>
                  <Card>
                  <CardHeader>
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-semibold">{selectedStudent.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Roll Number</p>
                        <p className="font-semibold">{selectedStudent.rollNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-semibold">{selectedStudent.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-semibold">{selectedStudent.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                </AnimateIn>

                <AnimateIn>
                  <Card>
                  <CardHeader>
                    <CardTitle>Course Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2">Course</th>
                            <th className="text-center py-2 px-2">Total Marks</th>
                            <th className="text-center py-2 px-2">Grade</th>
                            <th className="text-center py-2 px-2">GPA</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentCourseGrades.map((grade) => {
                            const course = courses.find((c) => c.id === grade.courseId)
                            return (
                              <tr key={`${grade.studentId}-${grade.courseId}`} className="border-b hover:bg-muted/50">
                                <td className="py-2 px-2">
                                  {course?.code} - {course?.name}
                                </td>
                                <td className="text-center py-2 px-2">{grade.totalMarks.toFixed(2)}</td>
                                <td className="text-center py-2 px-2">
                                  <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-semibold">
                                    {grade.grade}
                                  </span>
                                </td>
                                <td className="text-center py-2 px-2 font-semibold">{grade.gpa.toFixed(2)}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                  </Card>
                </AnimateIn>

                <AnimateIn>
                  <Card>
                  <CardHeader>
                    <CardTitle>Attendance Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-2">Course</th>
                            <th className="text-center py-2 px-2">Present</th>
                            <th className="text-center py-2 px-2">Total</th>
                            <th className="text-center py-2 px-2">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendanceByCourse.map((att) => (
                            <tr key={att.courseCode} className="border-b hover:bg-muted/50">
                              <td className="py-2 px-2">{att.courseCode}</td>
                              <td className="text-center py-2 px-2">{att.present}</td>
                              <td className="text-center py-2 px-2">{att.total}</td>
                              <td className="text-center py-2 px-2">
                                <span
                                  className={
                                    att.percentage !== "N/A" && Number.parseFloat(att.percentage as string) >= 75
                                      ? "text-green-500 font-semibold"
                                      : "text-red-500 font-semibold"
                                  }
                                >
                                  {att.percentage}%
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
