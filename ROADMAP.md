# Roadmap

Each phase starts only after the previous one is reviewed. Building starts only when the project owner says so.

## Phase 1: General scope and details (current)
- [x] Set up the project docs
- [x] Choose the core stack: React + Vite, Python + FastAPI, PostgreSQL
- [ ] Log all WFU CS classes (first pass done: `research/wfu-cs-courses.pdf`)
- [ ] Build a large list of computer science careers (first pass done: `research/cs-careers.pdf`)
- [ ] Find and review data sources for courses and careers
- [ ] Settle any remaining scope and details

## Phase 2: Course ↔ career logic
The core of the project: how careers connect to classes and skills, and how to analyze the data so students get reliable results. It will be designed together, step by step, once Phase 1 is finished.

## Phase 3: Build the browsing version
Browsing only, with no sign-in. Details will be planned once Phases 1 and 2 are done.
- [x] Main page header: CourseMap logo, title, and a pill-shaped tab bar with 7 tabs (started early, at the owner's request)
- [x] Save Logo 1 (blue) and Logo 2 (purple gradient); place Logo 1 in the header
- [x] Dashboard tab: no header line or sidebar; logo and title in a pill
- [x] Dashboard: the logo and title toggle the header line and the Course Catalog sidebar
- [x] Dashboard: placeholder course map (every course a node, placeholder links, gentle motion, hover shows the name)
- [x] Dashboard course map: 3D look, opens zoomed out, drag to pan and scroll or pinch to zoom
- [ ] Dashboard course map: replace the placeholder links with real connections once Phase 2 decides them
- [x] Course Catalog sidebar on the Course List tab (title only, blank for now)
- [x] Courses tab: every course as a pill, four per row (title top left, number bottom right)
- [x] Courses search bar: the look only
- [ ] Courses search bar: make it filter the courses
- [x] Careers tab: every career as a pill, four per row
- [x] Skill Groupings, ACM, and Source Analysis tabs added to the tab bar
- [x] Login icon in the header (hidden on Dashboard) that opens a blank Login page (look only; sign-in itself is under Later)
- [ ] Skill Groupings, ACM, and Source Analysis pages (empty for now)

## Hosting and deployment (long term)
- Cloudflare and Vercel are proposed.
- Talk through operating costs and budget with a faculty member. The department will cover costs.
- Don't commit to any paid systems before that talk.

## Later: Sign-in and personal features
- Add a way to sign in.
- Add more personal information and features, so a login is worth having.
