"use client"

import { useParams } from "next/navigation"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { AnimateIn } from "@/components/ui/animate-in"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const { getCourse, updateCourse } = useStore()
  const course = getCourse(courseId)
  const [editingOutcome, setEditingOutcome] = useState<string | null>(null)

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
      </div>
    )
  }

  const handleOutcomeUpdate = (outcomeId: string, field: string, value: any) => {
    const updatedOutcomes = course.outcomes.map((o) => (o.id === outcomeId ? { ...o, [field]: value } : o))
    updateCourse(courseId, { outcomes: updatedOutcomes })
  }

  return (
    <div className="space-y-6">
      <AnimateIn>
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <p className="text-muted-foreground mt-2">{course.code}</p>
        </div>
      </AnimateIn>

      <Tabs defaultValue="outcomes" className="w-full">
        <TabsList>
          <TabsTrigger value="outcomes">Course Outcomes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="outcomes" className="space-y-4">
          <AnimateIn>
            <Card>
              <CardHeader>
                <CardTitle>Course Outcomes (CO1-CO6)</CardTitle>
                <CardDescription>Define course outcomes and set attainment targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.outcomes.map((outcome, idx) => (
                  <AnimateIn key={outcome.id} delayMs={idx * 40}>
                    <div className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Label className="text-base font-semibold">{outcome.code}</Label>
                        </div>
                        <button
                          onClick={() => handleOutcomeUpdate(outcome.id, "description", null)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded text-lg"
                        >
                          🗑️
                        </button>
                      </div>
                      <div>
                        <Label htmlFor={`desc-${outcome.id}`} className="text-sm">
                          Description
                        </Label>
                        <Input
                          id={`desc-${outcome.id}`}
                          placeholder="Describe this course outcome"
                          value={outcome.description}
                          onChange={(e) => handleOutcomeUpdate(outcome.id, "description", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`target-${outcome.id}`} className="text-sm">
                          Target Attainment (%)
                        </Label>
                        <Input
                          id={`target-${outcome.id}`}
                          type="number"
                          min="0"
                          max="100"
                          value={outcome.target}
                          onChange={(e) => handleOutcomeUpdate(outcome.id, "target", Number.parseInt(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </AnimateIn>
                ))}
              </CardContent>
            </Card>
          </AnimateIn>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <AnimateIn>
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students</CardTitle>
                <CardDescription>{course.students.length} students enrolled</CardDescription>
              </CardHeader>
              <CardContent>
                {course.students.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No students enrolled yet. Upload marks to add students.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {course.students.map((student, idx) => (
                      <AnimateIn key={student.studentId} delayMs={idx * 40}>
                        <div className="p-3 border border-border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">{student.studentName}</p>
                            <p className="text-sm text-muted-foreground">{student.studentId}</p>
                          </div>
                        </div>
                      </AnimateIn>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimateIn>
        </TabsContent>
      </Tabs>
    </div>
  )
}
