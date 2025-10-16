import { create } from "zustand"

export interface CourseOutcome {
  id: string
  code: string
  description: string
  target: number
}

export interface Assessment {
  id: string
  name: string
  type: "IAE1" | "IAE2" | "Assignment"
  weightage: number
}

export interface StudentMark {
  studentId: string
  studentName: string
  marks: Record<string, number>
}

export interface Course {
  id: string
  code: string
  name: string
  semester: number
  outcomes: CourseOutcome[]
  assessments: Assessment[]
  students: StudentMark[]
  createdAt: string
}

export interface Settings {
  targetPercentage: number
  cieWeightage: number
  seeWeightage: number
}

export interface Student {
  id: string
  rollNumber: string
  name: string
  email: string
  phone: string
  enrolledCourses: string[]
  createdAt: string
}

export interface AttendanceRecord {
  studentId: string
  courseId: string
  date: string
  status: "present" | "absent" | "leave"
}

export interface GradingScale {
  id: string
  name: string
  grades: Array<{
    grade: string
    minMarks: number
    maxMarks: number
    points: number
  }>
}

export interface StudentGrade {
  studentId: string
  courseId: string
  totalMarks: number
  grade: string
  gpa: number
  remarks: string
}

interface Store {
  courses: Course[]
  settings: Settings
  students: Student[]
  attendance: AttendanceRecord[]
  gradingScales: GradingScale[]
  studentGrades: StudentGrade[]
  addCourse: (course: Course) => void
  updateCourse: (id: string, course: Partial<Course>) => void
  enrollStudents: (courseId: string, studentIds: string[]) => void
  unenrollStudents: (courseId: string, studentIds: string[]) => void
  deleteCourse: (id: string) => void
  getCourse: (id: string) => Course | undefined
  updateSettings: (settings: Partial<Settings>) => void
  loadFromStorage: () => void
  saveToStorage: () => void
  addStudent: (student: Student) => void
  updateStudent: (id: string, student: Partial<Student>) => void
  deleteStudent: (id: string) => void
  getStudent: (id: string) => Student | undefined
  addAttendance: (record: AttendanceRecord) => void
  getAttendance: (courseId: string, studentId?: string) => AttendanceRecord[]
  getAttendanceMap: (courseId: string, date: string) => Record<string, AttendanceRecord["status"]>
  setAttendanceFor: (
    courseId: string,
    date: string,
    data: Record<string, AttendanceRecord["status"]>,
  ) => void
  toggleAttendance: (
    studentId: string,
    courseId: string,
    date: string,
  ) => void
  addGradingScale: (scale: GradingScale) => void
  updateGradingScale: (id: string, scale: Partial<GradingScale>) => void
  deleteGradingScale: (id: string) => void
  addStudentGrade: (grade: StudentGrade) => void
  updateStudentGrade: (studentId: string, courseId: string, grade: Partial<StudentGrade>) => void
}

export const useStore = create<Store>((set, get) => ({
  courses: [],
  settings: {
    targetPercentage: 70,
    cieWeightage: 40,
    seeWeightage: 60,
  },
  students: [],
  attendance: [],
  gradingScales: [],
  studentGrades: [],
  addCourse: (course) =>
    set((state) => {
      const newState = { courses: [...state.courses, course] }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  updateCourse: (id, updates) =>
    set((state) => {
      const newState = {
        courses: state.courses.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  enrollStudents: (courseId, studentIds) =>
    set((state) => {
      const courses = state.courses.map((c) => {
        if (c.id !== courseId) return c
        const existing = new Set(c.students.map((s) => s.studentId))
        const added = studentIds
          .filter((id) => !existing.has(id))
          .map((id) => ({ studentId: id, studentName: state.students.find((s) => s.id === id)?.name || id, marks: {} }))
        return { ...c, students: [...c.students, ...added] }
      })
      const newState = { courses }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  unenrollStudents: (courseId, studentIds) =>
    set((state) => {
      const remove = new Set(studentIds)
      const courses = state.courses.map((c) => (c.id === courseId ? { ...c, students: c.students.filter((s) => !remove.has(s.studentId)) } : c))
      const newState = { courses }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  deleteCourse: (id) =>
    set((state) => {
      const newState = {
        courses: state.courses.filter((c) => c.id !== id),
      }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  getCourse: (id) => get().courses.find((c) => c.id === id),
  updateSettings: (settings) =>
    set((state) => {
      const newState = {
        settings: { ...state.settings, ...settings },
      }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  addStudent: (student) =>
    set((state) => {
      const newState = { students: [...state.students, student] }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  updateStudent: (id, updates) =>
    set((state) => {
      const newState = {
        students: state.students.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  deleteStudent: (id) =>
    set((state) => {
      const newState = {
        students: state.students.filter((s) => s.id !== id),
      }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  getStudent: (id) => get().students.find((s) => s.id === id),
  addAttendance: (record) =>
    set((state) => {
      const newState = { attendance: [...state.attendance, record] }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  getAttendance: (courseId, studentId) => {
    const records = get().attendance.filter((a) => a.courseId === courseId)
    return studentId ? records.filter((a) => a.studentId === studentId) : records
  },
  getAttendanceMap: (courseId, date) => {
    const map: Record<string, AttendanceRecord["status"]> = {}
    get()
      .attendance.filter((a) => a.courseId === courseId && a.date === date)
      .forEach((r) => (map[r.studentId] = r.status))
    return map
  },
  setAttendanceFor: (courseId, date, data) =>
    set((state) => {
      // Remove existing records for this course/date, then add new from map
      const remaining = state.attendance.filter((a) => !(a.courseId === courseId && a.date === date))
      const next: AttendanceRecord[] = [
        ...remaining,
        ...Object.entries(data).map(([studentId, status]) => ({ studentId, courseId, date, status })),
      ]
      const newState = { attendance: next }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  toggleAttendance: (studentId, courseId, date) =>
    set((state) => {
      // Cycle present -> absent -> leave -> present
      const idx = state.attendance.findIndex(
        (a) => a.studentId === studentId && a.courseId === courseId && a.date === date,
      )
      const next = [...state.attendance]
      if (idx >= 0) {
        const current = next[idx]
        const order: AttendanceRecord["status"][] = ["present", "absent", "leave"]
        const nextStatus = order[(order.indexOf(current.status) + 1) % order.length]
        next[idx] = { ...current, status: nextStatus }
      } else {
        next.push({ studentId, courseId, date, status: "present" })
      }
      const newState = { attendance: next }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  addGradingScale: (scale) =>
    set((state) => {
      const newState = { gradingScales: [...state.gradingScales, scale] }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  updateGradingScale: (id, updates) =>
    set((state) => {
      const newState = {
        gradingScales: state.gradingScales.map((g) => (g.id === id ? { ...g, ...updates } : g)),
      }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  deleteGradingScale: (id) =>
    set((state) => {
      const newState = {
        gradingScales: state.gradingScales.filter((g) => g.id !== id),
      }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  addStudentGrade: (grade) =>
    set((state) => {
      const newState = { studentGrades: [...state.studentGrades, grade] }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  updateStudentGrade: (studentId, courseId, updates) =>
    set((state) => {
      const newState = {
        studentGrades: state.studentGrades.map((g) =>
          g.studentId === studentId && g.courseId === courseId ? { ...g, ...updates } : g,
        ),
      }
      setTimeout(() => {
        if (typeof window !== "undefined") {
          localStorage.setItem("autom8-store", JSON.stringify(get()))
        }
      }, 0)
      return newState
    }),
  loadFromStorage: () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("autom8-store")
      if (stored) {
        try {
          const data = JSON.parse(stored)
          set({
            courses: data.courses || [],
            settings: data.settings || {
              targetPercentage: 70,
              cieWeightage: 40,
              seeWeightage: 60,
            },
            students: data.students || [],
            attendance: data.attendance || [],
            gradingScales: data.gradingScales || [],
            studentGrades: data.studentGrades || [],
          })
        } catch (e) {
          console.error("Failed to load store from localStorage", e)
        }
      }
    }
  },
  saveToStorage: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("autom8-store", JSON.stringify(get()))
    }
  },
}))
