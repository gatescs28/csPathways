# State

**Last updated:** 2026-10-22
**Phase:** 1 of the roadmap (general scope and details). The owner has started building the site's look

## What exists
- The project docs: `README.md`, `CLAUDE.md`, `AGENTS.md`, `STATE.md`, and `ROADMAP.md`.
- The folder layout: `frontend/`, `backend/`, `data/` (`courses/`, `careers/`), and `docs/` (`data-sources/`), and `research/`. Each folder has a README that explains its purpose.
- `frontend/`: a React + Vite app with a header: the blue CourseMap logo (64px wide, hanging left of a 44px box so the title and header height stay put), the title CourseMap next to it, and a white pill-shaped bar of 8 tabs centered on the header, with a light shadow so it looks raised: "Map", "Courses", "Careers", "Skill Groupings", "ACM", "Source Analysis", "Course List", and "Dashboard". The first tab, the page the site opens on, was named "Dashboard" until it was renamed "Map"; "Dashboard" is now a separate last tab. Each tab is as wide as its name, and the bar fits around them. Clicking a tab gives it a gray pill background. On Map (the page the site opens on), the header's bottom line is hidden and the logo and title sit in their own pill-shaped outline, with the same light shadow. Below them, the Map now defaults to the Parallel paths 2D design preview (`ParallelPaths.jsx`): six sample courses on the left, four illustrative career paths on the right, and curved links between them. Clicking a course or career path highlights its sample connections in blue; clicking a course also shows the existing Course Catalog sidebar. Labels stay visible, and a caption makes clear that all links are illustrative. A button fixed at the bottom left switches between Parallel paths and the existing 3D graph. On narrow screens, the Map tabs wrap and the Course Catalog sidebar stacks above the graph. The design is still in progress, and no course-to-career logic has been decided. In the retained 3D view, the placeholder course map works as before: the 109 courses are spread through an oval-shaped 3D space and drawn with perspective, so farther nodes and lines are smaller, fade toward white, and sit behind nearer ones. A soft oval shadow sits a little below the model's lowest node, as wide as the model, and fades out while the model is being turned. It opens zoomed out (about 750×530px on screen) and slightly turned so the depth shows. Dragging turns the model (side to side, and tipping toward or away from the viewer). Scrolling or pinching zooms in and out around the mouse (0.3× to 3×), which is also how users move around in x and y. Each course is a flat hollow ring in the logo's blue, joined by lighter blue lines. The lines are placeholders only, linking each course to its 2 nearest neighbors in the model, since how courses connect isn't decided yet. The map drifts gently, with nodes wandering slightly in all three directions and lines bowing, and nodes near the mouse lean toward it. Hovering a node shows the course number and name in a pill above it (kept inside the map area), turns the node and its links to Logo 2's purple gradient (the node with a soft glow), and slows all motion to a stop until the mouse leaves. Hovering also opens a white panel (rounded corners, 300×380px) in the top right corner of the map showing the course number and name; the rest of the panel is blank for now. Clicking a node selects it and shows the header's bottom line and the Course Catalog sidebar, the same as picking Map from the menu. The selected node and its links stay highlighted in the purple gradient after the mouse leaves, until another node is clicked, the same node is clicked again, or an empty spot on the map is clicked. With the system's reduce-motion setting on, the map stays still. There, the logo and title are a button: clicking it opens a dropdown menu, as wide as the button, listing the same 8 tabs as the tab bar (clicking outside it or pressing Escape closes it). While the logo and title are in their pill, the menu extends the pill downward as one shape, sliding smoothly out of it on opening and back up into it on closing (instant with the system's reduce-motion setting), with a little space between the pill and the first option. Options turn light gray on hover, and the page that's showing sits in a soft blue pill. Each option works like its tab, except Map, which also brings back the header's bottom line (dropping the pill outline) and shows the Course Catalog sidebar. Picking a tab from the tab bar resets it. Apart from that, the Course List tab has the left sidebar, 340px wide, titled "Course Catalog". Under the title is a white pill-shaped search box, the same one as on the Courses page (look only, no filtering yet). When a course is selected on the map, its course number and name appear under the search box as a subheading. Course List splits the main area into two halves: every course on the left and every career on the right, grouped by source, with no connection between them yet. The Careers tab is a page of just the careers, each its own pill, four to a row, grouped by source, laid out like the Courses page (no search bar). The Courses tab is a page of just the courses, with no sidebar. Under the header is a very light gray bar holding a white pill-shaped search box (magnifying glass on the left, placeholder "Search for a course..."). It's visual only and doesn't filter yet. Below that, each course is its own pill-shaped box, four to a row, with the title in the top left and the course number in the bottom right, grouped by source. The Skill Groupings, ACM, and Source Analysis tabs have empty pages. The Dashboard tab has a 340px left sidebar titled "Current Stats" (otherwise blank) and, in the main area, a white panel with rounded corners holding a small static map of 7 placeholder nodes joined by 9 lines, drawn like the course map (hollow blue rings, lighter blue lines). The nodes aren't courses yet. In the header's top right corner, on every page except Map, is a round login icon (a person outline in a 40px circle). Clicking it opens a blank page titled "Login" with no tab highlighted. There's no actual sign-in; the icon and page are the look only. Nothing else is built.
- `research/`: PDFs with sources at the top. Two are lists from the first data pull on 2026-10-21 (titles only), and one covers the tech stack.
  - `wfu-cs-courses.pdf`: 42 undergraduate courses, 41 graduate courses, and 26 special-topics offerings. Sources: the 2026-2027 WFU bulletins and the CS department site.
  - `cs-careers.pdf`: GSU Pathways (94 titles), BLS OOH (10), O\*NET Computer and Mathematical family (38), and NICE Framework v2.2.0 work roles (42).
  - `tech-stack.pdf`: the project's stack, with a brief reason for each choice.
- `data/`: `courses/courses.json` (109 courses) and `careers/careers.json` (184 careers), the same lists as the research PDFs, grouped by source. The frontend reads them directly until there's a backend.
- Logo assets: `frontend/src/assets/branding/logo-1.svg` (blue) and `logo-2.svg` (purple gradient), scalable versions of the selected folded-map/node design. The approved image is preserved alongside them as `approved-reference.png`. The header currently uses Logo 1.
- No backend code yet. Git is handled by another agent.

## Performance
Nothing to measure yet. This section will track how the product is performing once something is live.

## Decisions log
| Date | Decision |
|---|---|
| 2026-10-22 | Added the selected Parallel paths 2D visual demo as the default Dashboard view, with blue selection highlights and a bottom-left button to switch to the existing 3D graph. The six-course/four-path demo uses illustrative links only; the design remains unfinished |
| 2026-10-22 | Saved the selected map/node design as Logo 1 (blue) and Logo 2 (purple gradient); implemented Logo 1 left of the header title in a white circle |
| 2026-10-21 | Project restarted from scratch. GSU Pathways is light inspiration only |
| 2026-10-21 | Frontend: React, with Vite for development |
| 2026-10-21 | Backend: Python with FastAPI. Database: SQL |
| 2026-10-21 | Launch is browsing only. Sign-in and personal features come later (see roadmap) |
| 2026-10-21 | Course ↔ career logic is its own step, after the general scope and details are finished |
| 2026-10-21 | Hosting: Cloudflare and Vercel proposed. No paid systems until the budget is discussed with faculty |
| 2026-10-21 | Started building the site's look: main page header with title and pill-shaped tab bar (5 placeholder tabs) |
| 2026-10-21 | Header: gray circle logo placeholder left of the title; tab bar made narrower with smaller tab text |
| 2026-10-21 | Header: tab bar centered on the header |
| 2026-10-21 | Header: tab bar widened from 480px to 560px |
| 2026-10-21 | Main page: always-visible left sidebar titled "Course Catalog", blank for now |
| 2026-10-21 | Official name of the software: CourseMap, so it has its own name separate from GSU's tool. Header and page title updated |
| 2026-10-22 | Last tab renamed "Course List": the main panel shows all courses (left) and all careers (right), with no connections yet. The lists are stored as JSON in `data/` |
| 2026-10-22 | Fourth tab named "Course Info": a page of just the course list, without the sidebar |
| 2026-10-22 | "Course Info" renamed "Courses". Each course is now its own pill (four per row), title top left, course number bottom right |
| 2026-10-22 | Courses page: light gray search bar under the header, with a white pill search box (look only, no filtering yet) |
| 2026-10-22 | Header logo enlarged from 40px to 64px wide without moving the title or changing the header height; white circle removed |
| 2026-10-22 | First tab named "Dashboard". On it, the header's bottom line and the sidebar are hidden, and the logo and title sit in a pill |
| 2026-10-22 | Tabs reordered to Dashboard, Courses, Careers, Course List. New Careers tab lists every career as a pill, four per row, grouped by source |
| 2026-10-22 | Round login icon in the header's top right corner, hidden on Dashboard with the header bar. It opens a blank "Login" page. Look only: sign-in itself is still planned for later |
| 2026-10-22 | Three tabs added between Careers and Course List: "Skill Groupings", "ACM", and "Source Analysis" (pages empty). Tabs now size to their names instead of sharing a fixed 560px bar |
| 2026-10-22 | Dashboard: placeholder course map. Every course is a hollow blue ring (logo style) with lighter blue placeholder links to its nearest neighbors. Gentle drift, nodes lean away from the mouse, and hovering shows the course name, turns the node to Logo 2's gradient with a glow, and pauses the motion |
| 2026-10-22 | Dashboard course map: shrunk to about GSU's graph size (760×520px, centered), thinner node rings and lines, nodes now lean toward the mouse instead of away, and the hovered node's links take the gradient too |
| 2026-10-22 | On Dashboard, the logo and title button now opens a dropdown menu (as wide as the button) with the same tabs as the tab bar. Options work like the tabs, except Dashboard also shows the header line and the Course Catalog sidebar. Replaces the direct toggle |
| 2026-10-22 | Dashboard course map: soft shadow under the model that fades out while it's being turned. Later moved farther down and made wider, thicker, and darker to stand out more |
| 2026-10-22 | Dashboard course map: nodes enlarged (ring radius 7 to 9) and the model spread about 30% wider in every direction |
| 2026-10-22 | Dashboard course map rebuilt as a true 3D model: courses spread through 3D space with perspective and depth haze. Drag turns the model; scroll or pinch zooms around the mouse (which moves the view in x and y). Nodes back to flat logo rings (the earlier shading and shadows are removed) |
| 2026-10-22 | Dashboard course map: hovering a node also opens a panel in the top right corner with the course number and name. The rest of the panel is left blank for now |
| 2026-10-22 | Light shadow under the Dashboard logo-and-title pill and the tab bar (now with a white background), so they look raised off the page |
| 2026-10-22 | Dashboard course map: clicking a node selects it, and it stays highlighted until something else or an empty spot is clicked. Course Catalog sidebar: pill-shaped search box like the Courses page's (look only), with the selected course's number and name as a subheading under it |
| 2026-10-22 | Dashboard course map: clicking a node shows the header line and the Course Catalog sidebar (dragging to turn the model doesn't count as a click) |
| 2026-10-22 | Dashboard menu: the dropdown now extends the logo-and-title pill as one shape. Options highlight on hover, and the current page is in a soft blue pill |
| 2026-10-22 | Dashboard menu: slides smoothly out of the pill and back instead of appearing at once, and the options sit a little lower below the pill |
| 2026-10-22 | First tab renamed from "Dashboard" to "Map". New last tab "Dashboard": a "Current Stats" sidebar and a panel with a small placeholder map of a few connected nodes |
| 2026-10-22 | Dashboard course map: 3D look (shaded rings, shadows, depth by size and haze, slight parallax). Opens zoomed out like GSU's graph. Drag to pan in x and y, scroll or pinch to zoom |
| 2026-10-22 | On Dashboard, the logo and title are a toggle button that shows and hides the header line and the Course Catalog sidebar |
| 2026-10-22 | Course Catalog side panel widened from 260px to 340px |
| 2026-10-21 | Docs: ROADMAP.md replaces a separate PLAN.md. CLAUDE.md holds general context, and AGENTS.md holds short agent rules |
| 2026-10-21 | Database: PostgreSQL, chosen for many users at once and for linked course/career data |
| 2026-10-21 | All research goes in the top-level `research/` folder (docs/research/ merged into it). `data/` stays separate for the datasets the app will use, and `docs/data-sources/` stays where it is. `research/` is only for initial research and data-collection lists, not program data |

## Open questions
1. **Hosting split:** which pieces run on Cloudflare and which on Vercel (frontend, FastAPI backend, database), and what each costs. This waits on the faculty budget talk.
2. **Data sources.** First pull done (see `research/`). Used: the WFU bulletins, the CS department site, GSU Pathways, BLS OOH, O\*NET, and the NICE Framework. None are chosen as final data sources yet. Not yet checked:
   - WFU courses: syllabi (WFU login required).
   - Careers: BLS pay data and the ACM/IEEE CS2023 curriculum.
   - WFU-specific: Career Office outcomes data and Handshake.
   - Note: LinkedIn and Indeed don't allow scraping.
3. **Course ↔ career logic:** saved for its own roadmap step.
