"use client"

import type React from "react"

import { useState } from "react"
import { useStore, type Student } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { generateUUID } from "@/lib/utils"
import { AnimateIn } from "@/components/ui/animate-in"
import { UserPlus, Users2, Pencil, Trash2 } from "lucide-react"

export default function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    email: "",
    phone: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateStudent(editingId, formData)
      setEditingId(null)
    } else {
      const newStudent: Student = {
        id: generateUUID(),
        ...formData,
        enrolledCourses: [],
        createdAt: new Date().toISOString(),
      }
      addStudent(newStudent)
    }
    setFormData({ rollNumber: "", name: "", email: "", phone: "" })
    setShowForm(false)
  }

  const handleEdit = (student: Student) => {
    setEditingId(student.id)
    setFormData({
      rollNumber: student.rollNumber,
      name: student.name,
      email: student.email,
      phone: student.phone,
    })
    setShowForm(true)
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 relative">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
        </div>
        <AnimateIn>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Student Management</h1>
              <p className="text-muted-foreground mt-2 flex items-center gap-2">
                <Users2 size={16} className="text-cyan-500" /> Manage your students and their information
              </p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-cyan-500 hover:bg-cyan-600 gap-2">
              {showForm ? "Cancel" : (<><UserPlus size={16}/> Add Student</>)}
            </Button>
          </div>
        </AnimateIn>

        {showForm && (
          <AnimateIn>
            <Card className="mb-8 bg-card/70 backdrop-blur border-border/60">
              <CardHeader>
                <CardTitle>{editingId ? "Edit Student" : "Add New Student"}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Roll Number</label>
                    <Input
                      value={formData.rollNumber}
                      onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      placeholder="e.g., 001"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Student name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                </div>
                  <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 w-full">
                    {editingId ? "Update Student" : "Add Student"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </AnimateIn>
        )}

        <div className="grid gap-4">
          {students.length === 0 ? (
            <AnimateIn>
              <Card className="bg-card/70 backdrop-blur border-border/60">
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No students added yet. Click "Add Student" to get started.
                </CardContent>
              </Card>
            </AnimateIn>
          ) : (
            students.map((student, idx) => (
              <AnimateIn key={student.id} delayMs={idx * 40}>
                <Card className="bg-card/70 backdrop-blur border-border/60 hover:border-cyan-500/40 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                        <p className="text-sm text-muted-foreground">Email: {student.email}</p>
                        <p className="text-sm text-muted-foreground">Phone: {student.phone}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Enrolled in {student.enrolledCourses.length} course(s)
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(student)} className="gap-1">
                          <Pencil size={14}/> Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteStudent(student.id)} className="gap-1">
                          <Trash2 size={14}/> Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimateIn>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
