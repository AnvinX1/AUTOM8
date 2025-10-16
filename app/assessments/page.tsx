"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateUUID } from "@/lib/utils"
import { AnimateIn } from "@/components/ui/animate-in"

export default function AssessmentsPage() {
  const { courses, updateCourse } = useStore()
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || "")
  const [newAssessment, setNewAssessment] = useState({
    name: "",
    type: "IAE1" as const,
    weightage: 0,
  })

  const selectedCourse = courses.find((c) => c.id === selectedCourseId)

  const handleAddAssessment = () => {
    if (!selectedCourse || !newAssessment.name || newAssessment.weightage <= 0) return

    const assessment = {
      id: generateUUID(),
      name: newAssessment.name,
      type: newAssessment.type,
      weightage: newAssessment.weightage,
    }

    updateCourse(selectedCourseId, {
      assessments: [...selectedCourse.assessments, assessment],
    })

    setNewAssessment({ name: "", type: "IAE1", weightage: 0 })
  }

  const handleDeleteAssessment = (assessmentId: string) => {
    if (!selectedCourse) return
    updateCourse(selectedCourseId, {
      assessments: selectedCourse.assessments.filter((a) => a.id !== assessmentId),
    })
  }

  const totalWeightage = selectedCourse?.assessments.reduce((sum, a) => sum + a.weightage, 0) || 0

  return (
    <div className="space-y-6">
      <AnimateIn>
        <div>
          <h1 className="text-3xl font-bold">Assessment Setup</h1>
          <p className="text-muted-foreground mt-2">Configure assessments and weightages for each course</p>
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
            <AnimateIn>
              <Card>
                <CardHeader>
                  <CardTitle>Assessments</CardTitle>
                  <CardDescription>
                    Total Weightage: {totalWeightage}%
                    {totalWeightage !== 100 && <span className="text-destructive ml-2">(Should be 100%)</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {selectedCourse.assessments.map((assessment, idx) => (
                      <AnimateIn key={assessment.id} delayMs={idx * 40}>
                        <div className="p-4 border border-border rounded-lg flex justify-between items-center">
                          <div className="flex-1">
                            <p className="font-medium">{assessment.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {assessment.type} - {assessment.weightage}%
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteAssessment(assessment.id)}
                            className="text-destructive hover:bg-destructive/10 p-2 rounded text-lg"
                          >
                            🗑️
                          </button>
                        </div>
                      </AnimateIn>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <h3 className="font-semibold">Add New Assessment</h3>
                    <div>
                      <Label htmlFor="name">Assessment Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Quiz 1"
                        value={newAssessment.name}
                        onChange={(e) =>
                          setNewAssessment({
                            ...newAssessment,
                            name: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Assessment Type</Label>
                      <Select
                        value={newAssessment.type}
                        onValueChange={(value: any) =>
                          setNewAssessment({
                            ...newAssessment,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IAE1">IAE1</SelectItem>
                          <SelectItem value="IAE2">IAE2</SelectItem>
                          <SelectItem value="Assignment">Assignment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="weightage">Weightage (%)</Label>
                      <Input
                        id="weightage"
                        type="number"
                        min="0"
                        max="100"
                        value={newAssessment.weightage}
                        onChange={(e) =>
                          setNewAssessment({
                            ...newAssessment,
                            weightage: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <Button onClick={handleAddAssessment} className="w-full gap-2 bg-cyan-500 hover:bg-cyan-600">
                      ➕ Add Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimateIn>
          )}
        </div>
      )}
    </div>
  )
}
