"use client"

import type React from "react"

import { useState } from "react"
import { useStore, type GradingScale } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateUUID } from "@/lib/utils"

export default function GradingPage() {
  const { gradingScales, addGradingScale, updateGradingScale, deleteGradingScale } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    grades: [
      { grade: "A+", minMarks: 90, maxMarks: 100, points: 4.0 },
      { grade: "A", minMarks: 80, maxMarks: 89, points: 3.7 },
      { grade: "B+", minMarks: 70, maxMarks: 79, points: 3.3 },
      { grade: "B", minMarks: 60, maxMarks: 69, points: 3.0 },
      { grade: "C", minMarks: 50, maxMarks: 59, points: 2.0 },
      { grade: "F", minMarks: 0, maxMarks: 49, points: 0.0 },
    ],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateGradingScale(editingId, formData)
      setEditingId(null)
    } else {
      const newScale: GradingScale = {
        id: generateUUID(),
        ...formData,
      }
      addGradingScale(newScale)
    }
    setFormData({
      name: "",
      grades: [
        { grade: "A+", minMarks: 90, maxMarks: 100, points: 4.0 },
        { grade: "A", minMarks: 80, maxMarks: 89, points: 3.7 },
        { grade: "B+", minMarks: 70, maxMarks: 79, points: 3.3 },
        { grade: "B", minMarks: 60, maxMarks: 69, points: 3.0 },
        { grade: "C", minMarks: 50, maxMarks: 59, points: 2.0 },
        { grade: "F", minMarks: 0, maxMarks: 49, points: 0.0 },
      ],
    })
    setShowForm(false)
  }

  const handleGradeChange = (index: number, field: string, value: any) => {
    const newGrades = [...formData.grades]
    newGrades[index] = { ...newGrades[index], [field]: value }
    setFormData({ ...formData, grades: newGrades })
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Grading System</h1>
          <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-600">
            {showForm ? "Cancel" : "Create Grading Scale"}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Grading Scale" : "Create New Grading Scale"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Scale Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Standard 10-Point Scale"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-4">Grade Configuration</label>
                  <div className="space-y-3">
                    {formData.grades.map((grade, index) => (
                      <div key={index} className="grid grid-cols-5 gap-2 items-end">
                        <div>
                          <label className="text-xs text-muted-foreground">Grade</label>
                          <Input
                            value={grade.grade}
                            onChange={(e) => handleGradeChange(index, "grade", e.target.value)}
                            placeholder="A+"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Min Marks</label>
                          <Input
                            type="number"
                            value={grade.minMarks}
                            onChange={(e) => handleGradeChange(index, "minMarks", Number.parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Max Marks</label>
                          <Input
                            type="number"
                            value={grade.maxMarks}
                            onChange={(e) => handleGradeChange(index, "maxMarks", Number.parseInt(e.target.value))}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">GPA Points</label>
                          <Input
                            type="number"
                            step="0.1"
                            value={grade.points}
                            onChange={(e) => handleGradeChange(index, "points", Number.parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 w-full">
                  {editingId ? "Update Scale" : "Create Scale"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {gradingScales.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No grading scales created yet. Click "Create Grading Scale" to get started.
              </CardContent>
            </Card>
          ) : (
            gradingScales.map((scale) => (
              <Card key={scale.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{scale.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(scale.id)
                          setFormData(scale)
                          setShowForm(true)
                        }}
                      >
                        ✏️ Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteGradingScale(scale.id)}>
                        🗑️ Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-2">Grade</th>
                          <th className="text-center py-2 px-2">Min Marks</th>
                          <th className="text-center py-2 px-2">Max Marks</th>
                          <th className="text-center py-2 px-2">GPA Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scale.grades.map((grade, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-2 font-semibold">{grade.grade}</td>
                            <td className="text-center py-2 px-2">{grade.minMarks}</td>
                            <td className="text-center py-2 px-2">{grade.maxMarks}</td>
                            <td className="text-center py-2 px-2">{grade.points.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
