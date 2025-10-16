<div align="center">

# 🎯 AI08

## Autom8 Dashboard

*A modern, glassy Course Outcome Attainment dashboard*

Manage courses, students, attendance, marks, analytics, and reports with a slick dock-style UI.  
Local-first by default (no backend required).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)](https://tailwindcss.com/)

</div>

## ✨ Features
- Dock-style navigation with smooth magnification
- Glassmorphism UI, subtle motion, and accessibility-minded components
- End-to-end flow: Courses → Students → Attendance → Marks → Analytics → Reports
- Local-first data stored in your browser (export/import supported)
- CSV import for marks and CSV export for reports

## 🚀 Quickstart
Prereqs: Node.js 18+

```bash
npm install --legacy-peer-deps
npm run dev
```

Open http://localhost:3000

## 🧭 Product Tour

```mermaid
graph TD
    A[Dashboard] --> B[Courses]
    A --> C[Students]
    A --> D[Attendance]
    A --> E[Marks]
    A --> F[Analytics]
    A --> G[Reports]
    
    B --> H[Course Outcomes<br/>CO1-CO6]
    B --> I[Student Enrollment]
    
    C --> J[Student Profiles]
    C --> K[Contact Information]
    
    D --> L[Daily Attendance<br/>Present/Absent/Leave]
    D --> M[Bulk Operations]
    
    E --> N[CSV Import]
    E --> O[Manual Entry]
    E --> P[GPA Calculation]
    
    F --> Q[Outcome Attainment]
    F --> R[Attendance Analytics]
    F --> S[Performance Metrics]
    
    G --> T[CSV Export]
    G --> U[Attainment Reports]
    
    style A fill:#e1f5fe
    style F fill:#f3e5f5
    style G fill:#e8f5e8
```

### Core Modules
- **Dashboard**: Key stats and quick actions
- **Courses**: Create/manage courses and outcomes (CO1–CO6)
- **Students**: Manage roster and profiles
- **Attendance**: Per-course daily marking with bulk save and status cycling
- **Marks**: CSV import, manual entry, GPA mapping
- **Analytics**: Outcome attainment, attendance, and GPA visuals
- **Reports**: Export attainment reports (CSV)
- **Data Management**: Full backup/restore (JSON)
- **Settings**: Targets and weightages with reset defaults

## 🧩 Tech Stack
- Next.js 15, React 19, TypeScript
- Tailwind CSS, Radix UI
- Zustand (state)
- Recharts (charts)
- motion (Framer Motion v11 API)

## 🛠️ Scripts
```bash
npm run dev      # start dev server
npm run build    # build for production
npm run start    # run production build
npm run lint     # lint
```

## 🗂️ Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js App Router]
        B[React Components]
        C[Dock Navigation]
        D[UI Components]
    end
    
    subgraph "State Management"
        E[Zustand Store]
        F[Courses State]
        G[Students State]
        H[Attendance State]
        I[Marks State]
        J[Settings State]
    end
    
    subgraph "Data Layer"
        K[localStorage]
        L[CSV Import/Export]
        M[JSON Backup/Restore]
    end
    
    subgraph "External Libraries"
        N[Recharts]
        O[Radix UI]
        P[Motion]
        Q[Lucide Icons]
    end
    
    A --> B
    B --> C
    B --> D
    B --> E
    E --> F
    E --> G
    E --> H
    E --> I
    E --> J
    E --> K
    E --> L
    E --> M
    B --> N
    D --> O
    C --> P
    D --> Q
    
    style E fill:#fff3e0
    style K fill:#e8f5e8
    style A fill:#e3f2fd
```

### Project Structure
```
autom8-dashboard/
├── app/                    # Next.js App Router pages
│   ├── analytics/         # Analytics dashboard
│   ├── attendance/        # Attendance management
│   ├── courses/           # Course management
│   ├── students/          # Student management
│   ├── marks/             # Marks & grading
│   └── ...
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── dock.tsx          # Navigation dock
│   └── layout-wrapper.tsx
├── lib/
│   ├── store.ts          # Zustand global state
│   └── utils.ts          # Utility functions
└── styles/               # Global CSS
```

## 🔐 Privacy
- All data stays in the browser via `localStorage`
- Import/Export for portability

## 🤝 Contributing
We welcome issues and PRs.
1. Fork and create a feature branch
2. Follow ESLint/Prettier, keep components typed and accessible
3. Explain the problem/solution clearly in the PR

Good first issues:
- Unit tests for `lib/store.ts`
- Reduced-motion preferences
- Additional analytics (sparklines, trends)
- CSV templates for marks/attendance

## 🛣️ Roadmap

```mermaid
gantt
    title AI08 Development Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Core Features           :done, core, 2024-01-01, 2024-02-01
    Dock Navigation         :done, dock, 2024-01-15, 2024-01-25
    Glassmorphism UI        :done, ui, 2024-01-20, 2024-02-01
    
    section Phase 2
    Enhanced Analytics      :active, analytics, 2024-02-01, 2024-03-01
    PDF Export             :pdf, 2024-02-15, 2024-03-15
    Advanced Charts        :charts, 2024-02-20, 2024-03-10
    
    section Phase 3
    Pluggable Storage      :storage, 2024-03-01, 2024-04-01
    RBAC System           :rbac, 2024-03-15, 2024-04-15
    API Integration       :api, 2024-04-01, 2024-05-01
    
    section Future
    Mobile App            :mobile, 2024-05-01, 2024-06-01
    AI Insights           :ai, 2024-06-01, 2024-07-01
```

### Upcoming Features
- **Phase 2**: Enhanced analytics with cohort comparisons and time-series data
- **Phase 2**: PDF export for official reports and certificates
- **Phase 3**: Pluggable storage adapters (Supabase/Firebase/PostgreSQL)
- **Phase 3**: Role-based access control (admin/instructor/student roles)
- **Future**: Mobile companion app and AI-powered insights

## 📜 License
MIT. See `LICENSE`.

## 🙌 Acknowledgements
- Icons: `lucide-react`
- Components: Radix UI
- Charts: Recharts
- Motion: `motion` (Framer Motion v11 API)

---

<div align="center">

**Built with ❤️ by the AI08 Team**

*Empowering educators with modern technology*

[⭐ Star this repo](https://github.com/your-username/autom8-dashboard) • [🐛 Report Bug](https://github.com/your-username/autom8-dashboard/issues) • [💡 Request Feature](https://github.com/your-username/autom8-dashboard/issues)

If you build on Autom8, let us know — we'd love to feature it!

</div>
