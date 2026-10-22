# CourseMap

A free tool that helps Wake Forest University students connect the careers they want to the classes and skills that will get them there.

**Status:** planning. No product code yet. See [STATE.md](STATE.md).

## Project docs
- [CLAUDE.md](CLAUDE.md): project context, goals, and decisions
- [AGENTS.md](AGENTS.md): rules for agents working on the project
- [STATE.md](STATE.md): current status, decisions log, and open questions
- [ROADMAP.md](ROADMAP.md): phases and next steps

## Layout
```
csPathways/
├── frontend/      React + Vite site (header, plus Dashboard, Courses, Careers, and Course List tabs, and empty Skill Groupings, ACM, and Source Analysis tabs, and a login icon that opens a blank Login page, so far)
├── backend/       Python + FastAPI API and PostgreSQL database (empty until Phase 3)
├── data/
│   ├── courses/   WFU CS course log
│   └── careers/   CS career list
├── docs/
│   └── data-sources/  reviews of candidate data sources
└── research/      initial research and data-collection lists (not program data)
```
