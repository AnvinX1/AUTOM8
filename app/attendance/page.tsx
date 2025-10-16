"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimateIn } from "@/components/ui/animate-in"
import { CalendarCheck2, Users2, Check, X, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"

export default function AttendancePage() {
  const { courses, students, attendance, addAttendance, getAttendance, getAttendanceMap, setAttendanceFor, toggleAttendance, enrollStudents, unenrollStudents } = useStore()
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [attendanceData, setAttendanceData] = useState<Record<string, "present" | "absent" | "leave">>({})

  const courseStudents = selectedCourse ? students.filter((s) => s.enrolledCourses.includes(selectedCourse)) : []
  const enrolledSet = new Set(courseStudents.map((s) => s.id))
  const [manageOpen, setManageOpen] = useState(false)
  const [selectedForEnroll, setSelectedForEnroll] = useState<Record<string, boolean>>({})

  const handleAttendanceChange = (studentId: string, status: "present" | "absent" | "leave") => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleSubmit = () => {
    if (!selectedCourse) return
    setAttendanceFor(selectedCourse, selectedDate, attendanceData)
    alert("Attendance saved.")
  }

  const courseAttendance = selectedCourse ? getAttendance(selectedCourse) : []
  // Initialize map when course/date changes
  useEffect(() => {
    if (!selectedCourse) return
    setAttendanceData(getAttendanceMap(selectedCourse, selectedDate))
  }, [selectedCourse, selectedDate])
  const attendanceStats = courseStudents.map((student) => {
    const records = courseAttendance.filter((a) => a.studentId === student.id)
    const present = records.filter((a) => a.status === "present").length
    const total = records.length
    const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : "N/A"
    return { student, present, total, percentage }
  })

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
        </div>
        <AnimateIn>
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Attendance Management</h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <CalendarCheck2 size={16} className="text-cyan-500" /> Mark daily attendance and review summaries
            </p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <AnimateIn>
            <div>
              <label className="block text-sm font-medium mb-2">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="">Choose a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>
          </AnimateIn>
          <AnimateIn delayMs={60}>
            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              />
            </div>
          </AnimateIn>
          {selectedCourse && (
            <AnimateIn delayMs={120}>
              <div className="flex items-end">
                <Dialog open={manageOpen} onOpenChange={setManageOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">Manage Participants</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Manage Participants</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-80 overflow-auto space-y-2">
                      {students.map((s) => (
                        <label key={s.id} className="flex items-center gap-2 p-2 rounded hover:bg-accent/50">
                          <input
                            type="checkbox"
                            checked={selectedForEnroll[s.id] ?? enrolledSet.has(s.id)}
                            onChange={(e) =>
                              setSelectedForEnroll((prev) => ({ ...prev, [s.id]: e.target.checked }))
                            }
                          />
                          <span className="text-sm">{s.name} ({s.rollNumber})</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => {
                          const toEnroll = Object.entries(selectedForEnroll)
                            .filter(([id, val]) => val)
                            .map(([id]) => id)
                          enrollStudents(selectedCourse, toEnroll)
                          setManageOpen(false)
                        }}
                        className="bg-cyan-500 hover:bg-cyan-600"
                      >
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setManageOpen(false)}>Cancel</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </AnimateIn>
          )}
        </div>

        {selectedCourse && (
          <>
            <AnimateIn>
              <Card className="mb-8 bg-card/70 backdrop-blur border-border/60">
                <CardHeader>
                  <CardTitle>Mark Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {courseStudents.map((student, idx) => (
                      <AnimateIn key={student.id} delayMs={idx * 30}>
                        <div className={`flex items-center justify-between p-3 border rounded-md ${attendanceData[student.id] ? "ring-1 ring-cyan-500/40" : ""}`}>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={attendanceData[student.id] === "present" ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleAttendanceChange(student.id, "present")}
                              className={attendanceData[student.id] === "present" ? "bg-green-500 hover:bg-green-600 gap-1" : "gap-1"}
                            >
                              <Check size={14}/> Present
                            </Button>
                            <Button
                              variant={attendanceData[student.id] === "absent" ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleAttendanceChange(student.id, "absent")}
                              className={attendanceData[student.id] === "absent" ? "bg-red-500 hover:bg-red-600 gap-1" : "gap-1"}
                            >
                              <X size={14}/> Absent
                            </Button>
                            <Button
                              variant={attendanceData[student.id] === "leave" ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleAttendanceChange(student.id, "leave")}
                              className={attendanceData[student.id] === "leave" ? "bg-yellow-500 hover:bg-yellow-600 gap-1" : "gap-1"}
                            >
                              <Clock size={14}/> Leave
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAttendance(student.id, selectedCourse, selectedDate)}
                            >
                              Cycle
                            </Button>
                          </div>
                        </div>
                      </AnimateIn>
                    ))}
                  </div>
                  <Button onClick={handleSubmit} className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600">
                    Save Attendance
                  </Button>
                </CardContent>
              </Card>
            </AnimateIn>

                <AnimateIn>
                  <Card className="bg-card/70 backdrop-blur border-border/60">
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Student</th>
                          <th className="text-left py-2 px-2">Roll</th>
                          <th className="text-center py-2 px-2">Present</th>
                          <th className="text-center py-2 px-2">Total</th>
                          <th className="text-center py-2 px-2">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attendanceStats.map(({ student, present, total, percentage }, idx) => (
                          <AnimateIn as="tr" key={student.id} delayMs={idx * 30}>
                            <td className="py-2 px-2">{student.name}</td>
                            <td className="py-2 px-2">{student.rollNumber}</td>
                            <td className="text-center py-2 px-2">{present}</td>
                            <td className="text-center py-2 px-2">{total}</td>
                            <td className="text-center py-2 px-2">
                              <span
                                className={
                                  percentage !== "N/A" && Number.parseFloat(percentage as string) >= 75
                                    ? "text-green-500 font-semibold"
                                    : "text-red-500 font-semibold"
                                }
                              >
                                {percentage}%
                              </span>
                            </td>
                          </AnimateIn>
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
    </div>
  )
}
