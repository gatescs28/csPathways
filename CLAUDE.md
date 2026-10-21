# csPathways: Project Context

General background for any agent or person working on this project. Short rules for agents are in [AGENTS.md](AGENTS.md). Current status is in [STATE.md](STATE.md), and next steps are in [ROADMAP.md](ROADMAP.md).

## What this is
csPathways is a website for Wake Forest University (WFU) students. It shows how the careers they want connect to the classes and skills they need to get there.

- It's a **professor-assigned research and coding project**.
- It's meant to become a **real, free product** used by students.
- **Audience:** most of the WFU CS department at first. Adjacent departments may join as the project grows.
- **End goal:** a frontend that shows all the needed information and grows as the program becomes more capable, plus a backend that supports many users.

## Background and inspiration
Georgia State University built a similar tool called **Pathways**. Levine & Bourgeois, "Why Learn This? Visualizing Pathways Between CS Courses and Careers to Engage Students," SIGCSE TS 2026, https://doi.org/10.1145/3770762.3772598.

We take only **light inspiration** from it. csPathways is our own design, built from the ground up.

What GSU reported, for context only, not as a template:
- **Two views:** course → ranked careers (with prerequisite chains), and career → tiers of electives. There's also a course details page and a career list with salaries.
- **Their links:** one hand-scored 0–5 table of courses × careers, over 2,000 scores, all set by a single author.
- **Their limits:** the scores aren't reproducible, and keeping data current by hand is hard when the curriculum changes.

## Current phase
**Planning only.** Nothing is being built yet: no site, API, or database code. See [ROADMAP.md](ROADMAP.md).

## Decided so far
Each decision is dated in [STATE.md](STATE.md).

| Area | Decision |
|---|---|
| Frontend | React, with Vite as the development server and build tool |
| Backend | Python with FastAPI |
| Database | SQL (which database is still open) |
| Launch scope | Browsing only, no sign-in |
| Sign-in | Later. It comes along with more personal features so a login is worth having |
| Hosting | Cloudflare and Vercel proposed. Nothing paid until the budget is discussed with faculty, since the department will cover costs |
| Course ↔ career logic | Not decided. It's the core of the project and gets its own step after the general scope is finished |

## Project docs
| File | Purpose |
|---|---|
| `CLAUDE.md` | This file: general project context |
| `AGENTS.md` | Short rules for how agents should work here |
| `STATE.md` | Current status, decisions log, open questions, and how the project is performing |
| `ROADMAP.md` | Phases and what comes next |
| `README.md` | Front page for anyone new to the repo |

## Folder layout
| Folder | Purpose |
|---|---|
| `frontend/` | React + Vite site (empty until Phase 3) |
| `backend/` | Python + FastAPI API and SQL database (empty until Phase 3) |
| `data/courses/` | WFU CS course log |
| `data/careers/` | CS career list |
| `docs/research/` | Notes on background reading |
| `docs/data-sources/` | Reviews of candidate data sources |

Each folder has a README that explains what goes in it.
