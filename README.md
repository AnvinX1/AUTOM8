# Autom8 Dashboard

A modern, glassy Course Outcome Attainment dashboard. Manage courses, students, attendance, marks, analytics, and reports with a slick dock-style UI. Local-first by default (no backend required).

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
- Dashboard: Key stats and quick actions
- Courses: Create/manage courses and outcomes (CO1–CO6)
- Students: Manage roster and profiles
- Attendance: Per-course daily marking with bulk save and status cycling
- Marks: CSV import, manual entry, GPA mapping
- Analytics: Outcome attainment, attendance, and GPA visuals
- Reports: Export attainment reports (CSV)
- Data Management: Full backup/restore (JSON)
- Settings: Targets and weightages with reset defaults

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

## 🗂️ Structure
- `app/` – routes and pages
- `components/` – UI + layout (includes Dock)
- `lib/store.ts` – Zustand store for all entities
- `styles/` – global styles

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
- Pluggable storage adapters (Supabase/Firebase)
- RBAC (admin/instructor roles)
- Advanced analytics (cohorts, time-series)
- PDF export

## 📜 License
MIT. See `LICENSE`.

## 🙌 Acknowledgements
- Icons: `lucide-react`
- Components: Radix UI
- Charts: Recharts
- Motion: `motion` (Framer Motion v11 API)

If you build on Autom8, let us know — we’d love to feature it!
