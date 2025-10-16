"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
import { generateUUID } from "@/lib/utils"
import { AnimateIn } from "@/components/ui/animate-in"
import { BookOpen, Plus, Trash2 } from "lucide-react"

export default function CoursesPage() {
  const { courses, addCourse, deleteCourse } = useStore()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    semester: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code || !formData.name) return

    const newCourse = {
      id: generateUUID(),
      code: formData.code,
      name: formData.name,
      semester: formData.semester,
      outcomes: [
        { id: "co1", code: "CO1", description: "", target: 70 },
        { id: "co2", code: "CO2", description: "", target: 70 },
        { id: "co3", code: "CO3", description: "", target: 70 },
        { id: "co4", code: "CO4", description: "", target: 70 },
        { id: "co5", code: "CO5", description: "", target: 70 },
        { id: "co6", code: "CO6", description: "", target: 70 },
      ],
      assessments: [],
      students: [],
      createdAt: new Date().toISOString(),
    }

    addCourse(newCourse)
    setFormData({ code: "", name: "", semester: 1 })
    setOpen(false)
  }

  return (
    <div className="space-y-6 relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
      </div>

      <AnimateIn>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Courses</h1>
            <p className="text-muted-foreground mt-2">Manage your courses and course outcomes</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-cyan-500 hover:bg-cyan-600"><Plus size={16}/> New Course</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>Add a new course to track course outcomes</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="code">Course Code</Label>
                  <Input
                    id="code"
                    placeholder="e.g., CS101"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="name">Course Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Data Structures"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    type="number"
                    min="1"
                    max="8"
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        semester: Number.parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              <Button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600">
                  Create Course
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 ? (
          <AnimateIn>
            <Card className="md:col-span-2 lg:col-span-3 bg-card/70 backdrop-blur border-border/60">
              <CardContent className="pt-6 text-center py-12">
                <p className="text-muted-foreground mb-4">No courses yet</p>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Create First Course</Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          </AnimateIn>
        ) : (
          courses.map((course, idx) => (
            <AnimateIn key={course.id} delayMs={idx * 50}>
              <Card className="bg-card/70 backdrop-blur border-border/60 hover:border-cyan-500/40 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-500">
                          <BookOpen size={16} />
                        </span>
                        {course.name}
                      </CardTitle>
                      <CardDescription>{course.code}</CardDescription>
                    </div>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded"
                      aria-label="Delete course"
                      title="Delete course"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">Semester {course.semester}</span>
                    <span className="rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 px-2 py-1">
                      {course.students.length} students
                    </span>
                  </div>
                  <Link href={`/courses/${course.id}`}>
                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                      ✏️ Manage
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </AnimateIn>
          ))
        )}
      </div>
    </div>
  )
}
