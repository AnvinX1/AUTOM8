"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimateIn } from "@/components/ui/animate-in"
import { Input } from "@/components/ui/input"
import { Upload, UserPlus, FileDown, BookOpen } from "lucide-react"

export default function MarksPage() {
  const { courses, updateCourse, gradingScales, addStudentGrade, updateStudentGrade, studentGrades } = useStore()
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "")
  const [selectedGradingScaleId, setSelectedGradingScaleId] = useState<string>(gradingScales[0]?.id || "")
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    marks: {} as Record<string, number>,
  })

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)
  const selectedGradingScale = gradingScales.find((g) => g.id === selectedGradingScaleId)

  const calculateGrade = (marks: Record<string, number>) => {
    if (!selectedCourse || !selectedGradingScale) return { total: 0, grade: "N/A", gpa: 0 }

    const total = Object.values(marks).reduce((sum, mark) => sum + mark, 0)
    const average = selectedCourse.outcomes.length > 0 ? total / selectedCourse.outcomes.length : 0

    const gradeInfo = selectedGradingScale.grades.find((g) => average >= g.minMarks && average <= g.maxMarks)

    return {
      total,
      average: Math.round(average * 100) / 100,
      grade: gradeInfo?.grade || "N/A",
      gpa: gradeInfo?.points || 0,
    }
  }

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedCourse) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split("\n").filter((line) => line.trim())
        const headers = lines[0].split(",").map((h) => h.trim())

        const students = lines.slice(1).map((line) => {
          const values = line.split(",").map((v) => v.trim())
          const row = Object.fromEntries(headers.map((h, i) => [h, values[i]]))

          return {
            studentId: row["Student ID"] || row["ID"] || "",
            studentName: row["Student Name"] || row["Name"] || "",
            marks: selectedCourse.outcomes.reduce(
              (acc, outcome) => {
                const value = row[outcome.code] || row[`CO${outcome.code.slice(-1)}`] || "0"
                acc[outcome.id] = Number.parseFloat(value) || 0
                return acc
              },
              {} as Record<string, number>,
            ),
          }
        })

        updateCourse(selectedCourseId, { students })
        setUploadStatus(`Successfully imported ${students.length} students`)
        setTimeout(() => setUploadStatus(""), 3000)
      } catch (error) {
        setUploadStatus("Error importing file. Please check the CSV format.")
        setTimeout(() => setUploadStatus(""), 3000)
      }
    }
    reader.readAsText(file)
  }

  const handleManualEntry = () => {
    if (!formData.studentId || !formData.studentName) {
      setUploadStatus("Please fill in student ID and name")
      setTimeout(() => setUploadStatus(""), 3000)
      return
    }

    const newStudent = {
      studentId: formData.studentId,
      studentName: formData.studentName,
      marks: formData.marks,
    }

    const existingStudents = selectedCourse?.students || []
    const updatedStudents = [...existingStudents.filter((s) => s.studentId !== formData.studentId), newStudent]

    updateCourse(selectedCourseId, { students: updatedStudents })

    const gradeInfo = calculateGrade(formData.marks)
    const existingGrade = studentGrades.find(
      (g) => g.studentId === formData.studentId && g.courseId === selectedCourseId,
    )

    if (existingGrade) {
      updateStudentGrade(formData.studentId, selectedCourseId, {
        totalMarks: gradeInfo.average,
        grade: gradeInfo.grade,
        gpa: gradeInfo.gpa,
      })
    } else {
      addStudentGrade({
        studentId: formData.studentId,
        courseId: selectedCourseId,
        totalMarks: gradeInfo.average,
        grade: gradeInfo.grade,
        gpa: gradeInfo.gpa,
        remarks: "",
      })
    }

    setFormData({ studentId: "", studentName: "", marks: {} })
    setShowManualEntry(false)
    setUploadStatus("Student added successfully")
    setTimeout(() => setUploadStatus(""), 3000)
  }

  const handleDeleteStudent = (studentId: string) => {
    const updatedStudents = selectedCourse?.students.filter((s) => s.studentId !== studentId) || []
    updateCourse(selectedCourseId, { students: updatedStudents })
  }

  const handleExportToExcel = () => {
    if (!selectedCourse || selectedCourse.students.length === 0) {
      setUploadStatus("No students to export")
      setTimeout(() => setUploadStatus(""), 3000)
      return
    }

    const headers = ["Student ID", "Student Name", ...selectedCourse.outcomes.map((o) => o.code), "Average", "Grade"]
    const rows = selectedCourse.students.map((student) => {
      const gradeInfo = calculateGrade(student.marks)
      return [
        student.studentId,
        student.studentName,
        ...selectedCourse.outcomes.map((o) => student.marks[o.id] || 0),
        gradeInfo.average,
        gradeInfo.grade,
      ]
    })

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${selectedCourse.code}_marks_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    setUploadStatus("Marks exported successfully")
    setTimeout(() => setUploadStatus(""), 3000)
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 space-y-6 relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
        </div>
        <AnimateIn>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Marks Entry & Management</h1>
              <p className="text-muted-foreground mt-2">Import, enter, and manage student marks with automatic grading</p>
            </div>
            {selectedCourse && (
              <Button onClick={handleExportToExcel} className="bg-green-500 hover:bg-green-600 gap-2">
                <FileDown size={16}/> Export CSV
              </Button>
            )}
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
              <Card className="bg-card/70 backdrop-blur border-border/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Select Course & Grading Scale</CardTitle>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-500">
                    <BookOpen size={16} />
                  </span>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Course</label>
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
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Grading Scale</label>
                  <Select value={selectedGradingScaleId} onValueChange={setSelectedGradingScaleId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grading scale..." />
                    </SelectTrigger>
                    <SelectContent>
                      {gradingScales.map((scale) => (
                        <SelectItem key={scale.id} value={scale.id}>
                          {scale.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              </Card>
            </AnimateIn>

            {selectedCourse && (
              <>
                <AnimateIn>
                  <Card className="bg-card/70 backdrop-blur border-border/60">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Import Marks</CardTitle>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-500">
                        <Upload size={16} />
                      </span>
                    </div>
                    <CardDescription>
                      Upload a CSV file with student marks. Expected columns: Student ID, Student Name, CO1, CO2, CO3,
                      CO4, CO5, CO6
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <p className="text-4xl mb-4">📤</p>
                      <p className="text-muted-foreground mb-4">Drag and drop your CSV file here or click to browse</p>
                      <input type="file" accept=".csv" onChange={handleCSVUpload} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload">
                        <Button asChild className="gap-2 bg-cyan-500 hover:bg-cyan-600">
                          <span className="flex items-center gap-2"><Upload size={16}/> Choose CSV File</span>
                        </Button>
                      </label>
                    </div>

                    {uploadStatus && (
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          uploadStatus.includes("Successfully") || uploadStatus.includes("added")
                            ? "bg-green-500/20 text-green-700 dark:text-green-400"
                            : "bg-red-500/20 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {uploadStatus}
                      </div>
                    )}
                  </CardContent>
                  </Card>
                </AnimateIn>

                <AnimateIn>
                  <Card className="bg-card/70 backdrop-blur border-border/60">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Add Student Manually</CardTitle>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-500">
                        <UserPlus size={16} />
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!showManualEntry ? (
                      <Button onClick={() => setShowManualEntry(true)} className="w-full bg-cyan-500 hover:bg-cyan-600">
                        <span className="flex items-center gap-2"><UserPlus size={16}/> Add Student</span>
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <Input
                          placeholder="Student ID"
                          value={formData.studentId}
                          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        />
                        <Input
                          placeholder="Student Name"
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        />
                        <div className="space-y-3">
                          <p className="text-sm font-medium">Marks (out of 100)</p>
                          {selectedCourse.outcomes.map((outcome) => (
                            <Input
                              key={outcome.id}
                              type="number"
                              placeholder={`${outcome.code} marks`}
                              min="0"
                              max="100"
                              value={formData.marks[outcome.id] || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  marks: {
                                    ...formData.marks,
                                    [outcome.id]: Number.parseFloat(e.target.value) || 0,
                                  },
                                })
                              }
                            />
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleManualEntry} className="flex-1 bg-cyan-500 hover:bg-cyan-600">
                            Save Student
                          </Button>
                          <Button onClick={() => setShowManualEntry(false)} variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  </Card>
                </AnimateIn>

                {selectedCourse.students.length > 0 && (
                  <AnimateIn>
                    <Card className="bg-card/70 backdrop-blur border-border/60">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Student Marks & Grades ({selectedCourse.students.length})</CardTitle>
                          <Button onClick={handleExportToExcel} className="bg-green-500 hover:bg-green-600">
                            <span className="flex items-center gap-2"><FileDown size={16}/> Export to CSV</span>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2 px-2">Student ID</th>
                                <th className="text-left py-2 px-2">Name</th>
                                {selectedCourse.outcomes.map((outcome) => (
                                  <th key={outcome.id} className="text-center py-2 px-2">
                                    {outcome.code}
                                  </th>
                                ))}
                                <th className="text-center py-2 px-2">Average</th>
                                <th className="text-center py-2 px-2">Grade</th>
                                <th className="text-center py-2 px-2">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedCourse.students.map((student, idx) => {
                                const gradeInfo = calculateGrade(student.marks)
                                return (
                                  <AnimateIn as="tr" key={student.studentId} delayMs={idx * 30}>
                                    <td className="py-2 px-2">{student.studentId}</td>
                                    <td className="py-2 px-2">{student.studentName}</td>
                                    {selectedCourse.outcomes.map((outcome) => (
                                      <td key={outcome.id} className="text-center py-2 px-2">
                                        {student.marks[outcome.id] || 0}
                                      </td>
                                    ))}
                                    <td className="text-center py-2 px-2 font-semibold">{gradeInfo.average}</td>
                                    <td className="text-center py-2 px-2">
                                      <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 font-semibold">
                                        {gradeInfo.grade}
                                      </span>
                                    </td>
                                    <td className="text-center py-2 px-2">
                                      <Button
                                        onClick={() => handleDeleteStudent(student.studentId)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700"
                                      >
                                        🗑️
                                      </Button>
                                    </td>
                                  </AnimateIn>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </AnimateIn>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
