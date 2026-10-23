import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import courses from '../../data/courses/courses.json'

// Placeholder: how courses connect isn't decided yet (Phase 2), so each course
// is joined to its nearest neighbors in the model just to give the chart a shape.

// The courses sit inside an oval-shaped 3D space, viewed with perspective.
// Dragging turns the model; scrolling or pinching zooms in and out around the
// mouse, which is also how to move around in x and y.
const RADIUS_X = 650
const RADIUS_Y = 440
const RADIUS_Z = 440
const CAMERA_DISTANCE = 1820 // nearer means stronger perspective
const START_YAW = 0.45 // starting turn, so the depth shows right away
const START_PITCH = -0.3
const MAX_PITCH = 1.4
const TURN_SPEED = 0.006 // radians per px dragged
const PADDING = 48
const NEIGHBORS = 2
const START_ZOOM = 0.6
const MIN_ZOOM = 0.3
const MAX_ZOOM = 3
const NODE_RADIUS = 9
const MAX_HAZE = 0.6 // the farthest nodes and links fade this far toward white
const DRIFT = 7 // how far each node wanders around its spot
const LINK_BOW = 10 // how far a link's curve bows in and out
const MOUSE_RADIUS = 180
// A thin shadow under the model, hidden while it's being turned.
const SHADOW_GAP = 60 // how far below the lowest node
const SHADOW_WIDTH = 1 // share of the model's width
const SHADOW_THICKNESS = 0.1 // height as a share of its width
const MOUSE_PULL = 16

// Seeded random numbers, so the layout is the same on every visit.
function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

// A random spot inside the oval-shaped space.
function randomSpot(rand) {
  for (;;) {
    const x = rand() * 2 - 1
    const y = rand() * 2 - 1
    const z = rand() * 2 - 1
    if (x * x + y * y + z * z <= 1) return { x: x * RADIUS_X, y: y * RADIUS_Y, z: z * RADIUS_Z }
  }
}

function buildLayout() {
  const rand = seededRandom(7)
  const nodes = []
  for (const course of courses.groups.flatMap((group) => group.items)) {
    // Of 20 random spots, keep the one farthest from every node placed so far.
    let best = null
    let bestGap = -1
    for (let i = 0; i < 20; i++) {
      const spot = randomSpot(rand)
      const gap = Math.min(Infinity, ...nodes.map((node) => distance(spot, node)))
      if (gap > bestGap) {
        best = spot
        bestGap = gap
      }
    }
    nodes.push({ ...best, course, phase: rand() * Math.PI * 2, rate: 0.5 + rand() * 0.5 })
  }

  const seen = new Set()
  const links = []
  nodes.forEach((node, i) => {
    const nearest = nodes
      .map((other, j) => ({ j, d: distance(node, other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, NEIGHBORS)
    for (const { j } of nearest) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(key)) continue
      seen.add(key)
      links.push({ from: i, to: j, phase: rand() * Math.PI * 2, rate: 0.4 + rand() * 0.4 })
    }
  })
  return { nodes, links }
}

// Turns a point in the model into the camera's view: x right, y down, z toward
// the viewer.
function toCamera(x, y, z, view) {
  const cosYaw = Math.cos(view.yaw)
  const sinYaw = Math.sin(view.yaw)
  const cosPitch = Math.cos(view.pitch)
  const sinPitch = Math.sin(view.pitch)
  const turnedX = x * cosYaw + z * sinYaw
  const turnedZ = -x * sinYaw + z * cosYaw
  return {
    x: turnedX,
    y: y * cosPitch - turnedZ * sinPitch,
    z: y * sinPitch + turnedZ * cosPitch,
  }
}

// The reverse for a sideways move on screen: which way that is in the model.
function fromCameraPlane(dx, dy, view) {
  const sinPitch = Math.sin(view.pitch)
  return {
    x: dx * Math.cos(view.yaw) + dy * sinPitch * Math.sin(view.yaw),
    y: dy * Math.cos(view.pitch),
    z: dx * Math.sin(view.yaw) - dy * sinPitch * Math.cos(view.yaw),
  }
}

// Above the node, or below it near the top, and never past the sides.
function placeLabel(label, p, width) {
  const gap = p.scale * NODE_RADIUS * 1.4 + 10
  const half = label.offsetWidth / 2
  const x = clamp(p.x, half + 8, Math.max(width - half - 8, half + 8))
  const above = p.y - gap - label.offsetHeight > 8
  const y = above ? p.y - gap - label.offsetHeight : p.y + gap
  label.style.transform = `translate(${x - half}px, ${y}px)`
}

// `selected` is the clicked course, which stays highlighted until another
// course or an empty spot is clicked. `onSelect` gets the course, or null.
function CourseNetwork({ selected, onSelect }) {
  const layout = useMemo(buildLayout, [])
  const selectedIndex = layout.nodes.findIndex((node) => node.course === selected)
  const containerRef = useRef(null)
  const nodeGroupRef = useRef(null)
  const shadowRef = useRef(null)
  const nodeRefs = useRef([])
  const hazeRefs = useRef([])
  const linkRefs = useRef([])
  const glowLinkRefs = useRef([])
  const gradientRefs = useRef([])
  const pathsRef = useRef([])
  const labelRef = useRef(null)
  const mouseRef = useRef(null)
  const hoveredRef = useRef(null)
  const selectedRef = useRef(-1)
  const positionsRef = useRef([])
  // How the model is turned, the point it turns around (kept at the center of
  // the area), and the zoom level.
  const viewRef = useRef(null)
  const dragRef = useRef(null)
  const redrawRef = useRef(null)
  // Kept across resizes so the motion doesn't jump.
  const motionRef = useRef({ time: 0, speed: 1, pulls: layout.nodes.map(() => ({ x: 0, y: 0 })) })
  const [size, setSize] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [dragging, setDragging] = useState(false)

  useLayoutEffect(() => {
    const container = containerRef.current
    const measure = () => setSize({ width: container.clientWidth, height: container.clientHeight })
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!size) return
    if (!viewRef.current) {
      // Start zoomed out, and further if the model wouldn't fit.
      const fit = Math.min(
        (size.width - PADDING * 2) / (RADIUS_X * 2.2),
        (size.height - PADDING * 2) / (RADIUS_Y * 2.4),
      )
      viewRef.current = {
        yaw: START_YAW,
        pitch: START_PITCH,
        center: { x: 0, y: 0, z: 0 },
        zoom: clamp(Math.min(START_ZOOM, fit), MIN_ZOOM, MAX_ZOOM),
      }
    }
    const view = viewRef.current
    const motion = motionRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const positions = layout.nodes.map(() => ({ x: 0, y: 0, z: 0, scale: 1, haze: 0 }))
    positionsRef.current = positions
    const centerX = size.width / 2
    const centerY = size.height / 2
    const maxReach = Math.max(RADIUS_X, RADIUS_Y, RADIUS_Z)
    let drawOrder = layout.nodes.map((_, i) => i)
    let last = performance.now()
    let frame = null

    function draw(now) {
      frame = null
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      // Motion slows to a stop while a node is hovered and picks back up after.
      const target = reduceMotion || hoveredRef.current !== null ? 0 : 1
      motion.speed = reduceMotion ? 0 : motion.speed + (target - motion.speed) * Math.min(1, dt * 6)
      motion.time += dt * motion.speed
      const time = motion.time
      const zoom = view.zoom
      const mouse = mouseRef.current

      layout.nodes.forEach((node, i) => {
        const x = node.x + Math.sin(time * node.rate + node.phase) * DRIFT
        const y = node.y + Math.cos(time * node.rate * 0.8 + node.phase * 1.3) * DRIFT
        const z = node.z + Math.sin(time * node.rate * 0.7 + node.phase * 0.6) * DRIFT
        const cam = toCamera(x - view.center.x, y - view.center.y, z - view.center.z, view)
        // Perspective: nearer points are drawn bigger and farther from the center.
        const perspective = CAMERA_DISTANCE / Math.max(CAMERA_DISTANCE - cam.z, 1)
        const scale = zoom * perspective
        let screenX = centerX + cam.x * scale
        let screenY = centerY + cam.y * scale

        // Nodes near the mouse lean toward it, never past it.
        let pullX = 0
        let pullY = 0
        if (mouse) {
          const dx = mouse.x - screenX
          const dy = mouse.y - screenY
          const d = Math.hypot(dx, dy)
          const reach = MOUSE_RADIUS * zoom
          if (d > 0 && d < reach) {
            const force = Math.min((1 - d / reach) * MOUSE_PULL * zoom, d * 0.5)
            pullX = (dx / d) * force
            pullY = (dy / d) * force
          }
        }
        const pull = motion.pulls[i]
        const ease = Math.min(1, dt * 4) * motion.speed
        pull.x += (pullX - pull.x) * ease
        pull.y += (pullY - pull.y) * ease

        const p = positions[i]
        p.x = screenX + pull.x
        p.y = screenY + pull.y
        p.z = cam.z
        p.scale = scale
        // 0 at the front of the model, 1 at the back.
        p.haze = clamp((maxReach - cam.z) / (maxReach * 2), 0, 1)
        nodeRefs.current[i]?.setAttribute(
          'transform',
          `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) scale(${scale.toFixed(3)})`,
        )
        hazeRefs.current[i]?.setAttribute('opacity', (MAX_HAZE * p.haze).toFixed(2))
      })

      // The shadow follows the model's width and sits just under its lowest node.
      const shadow = shadowRef.current
      if (shadow) {
        let left = Infinity
        let right = -Infinity
        let bottom = -Infinity
        for (const p of positions) {
          left = Math.min(left, p.x)
          right = Math.max(right, p.x)
          bottom = Math.max(bottom, p.y)
        }
        const rx = ((right - left) / 2) * SHADOW_WIDTH
        shadow.setAttribute('cx', ((left + right) / 2).toFixed(1))
        shadow.setAttribute('cy', (bottom + SHADOW_GAP * zoom).toFixed(1))
        shadow.setAttribute('rx', rx.toFixed(1))
        shadow.setAttribute('ry', Math.max(rx * SHADOW_THICKNESS, 3).toFixed(1))
      }

      // Nodes farther back are drawn first, so nearer ones sit in front.
      const order = layout.nodes.map((_, i) => i).sort((a, b) => positions[a].z - positions[b].z)
      if (order.some((i, k) => i !== drawOrder[k])) {
        drawOrder = order
        const group = nodeGroupRef.current
        for (const i of order) if (nodeRefs.current[i]) group.appendChild(nodeRefs.current[i])
      }

      // Each link is a curve whose middle bows slowly from side to side.
      const h = hoveredRef.current
      const active = [h, selectedRef.current]
      layout.links.forEach((link, i) => {
        const a = positions[link.from]
        const b = positions[link.to]
        const length = Math.hypot(b.x - a.x, b.y - a.y) || 1
        const bow = Math.sin(time * link.rate + link.phase) * LINK_BOW * zoom
        const cx = (a.x + b.x) / 2 - ((b.y - a.y) / length) * bow
        const cy = (a.y + b.y) / 2 + ((b.x - a.x) / length) * bow
        const d = `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
        const width = (a.scale + b.scale) / 2
        pathsRef.current[i] = d
        const path = linkRefs.current[i]
        if (path) {
          path.setAttribute('d', d)
          path.setAttribute('opacity', (1 - MAX_HAZE * ((a.haze + b.haze) / 2)).toFixed(2))
          path.style.strokeWidth = (2 * width).toFixed(2)
        }
        const glowPath = glowLinkRefs.current[i]
        if (glowPath) {
          glowPath.setAttribute('d', d)
          glowPath.style.strokeWidth = (2.5 * width).toFixed(2)
        }
        const gradient = gradientRefs.current[i]
        if (gradient) {
          const [start, end] = active.includes(link.from) ? [a, b] : [b, a]
          gradient.setAttribute('x1', start.x)
          gradient.setAttribute('y1', start.y)
          gradient.setAttribute('x2', end.x)
          gradient.setAttribute('y2', end.y)
        }
      })

      if (h !== null && labelRef.current) placeLabel(labelRef.current, positions[h], size.width)

      if (!reduceMotion) redraw()
    }

    function redraw() {
      if (frame === null) frame = requestAnimationFrame(draw)
    }

    redrawRef.current = redraw
    draw(performance.now())
    return () => {
      cancelAnimationFrame(frame)
      redrawRef.current = null
    }
  }, [layout, size])

  useLayoutEffect(() => {
    selectedRef.current = selectedIndex
    redrawRef.current?.()
  }, [selectedIndex])

  useLayoutEffect(() => {
    if (hovered !== null && labelRef.current) placeLabel(labelRef.current, positionsRef.current[hovered], size.width)
  }, [hovered, size])

  // Scrolling or pinching zooms in and out around the mouse: the spot under it
  // stays put, so zooming in also moves the view toward it.
  useEffect(() => {
    const container = containerRef.current
    function zoom(e) {
      const view = viewRef.current
      if (!view) return
      e.preventDefault()
      const rect = container.getBoundingClientRect()
      const mx = e.clientX - rect.left - rect.width / 2
      const my = e.clientY - rect.top - rect.height / 2
      const delta = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY
      const next = clamp(view.zoom * Math.exp(-delta * (e.ctrlKey ? 0.01 : 0.002)), MIN_ZOOM, MAX_ZOOM)
      const shift = fromCameraPlane(mx / view.zoom - mx / next, my / view.zoom - my / next, view)
      view.center.x += shift.x
      view.center.y += shift.y
      view.center.z += shift.z
      view.zoom = next
      redrawRef.current?.()
    }
    container.addEventListener('wheel', zoom, { passive: false })
    return () => container.removeEventListener('wheel', zoom)
  }, [])

  function hover(i) {
    if (dragRef.current?.moved) return
    hoveredRef.current = i
    setHovered(i)
    redrawRef.current?.()
  }

  function startDrag(e) {
    if (e.button !== 0 || !viewRef.current) return
    dragRef.current = {
      pointer: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      yaw: viewRef.current.yaw,
      pitch: viewRef.current.pitch,
      moved: false,
    }
  }

  function moveMouse(e) {
    const drag = dragRef.current
    if (!drag) {
      const rect = containerRef.current.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      return
    }
    // Dragging turns the model: side to side around its vertical axis, and up
    // and down to tip it toward or away from the viewer.
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    if (!drag.moved) {
      if (Math.hypot(dx, dy) < 3) return
      hover(null)
      drag.moved = true
      containerRef.current.setPointerCapture(drag.pointer)
      mouseRef.current = null
      setDragging(true)
    }
    const view = viewRef.current
    view.yaw = drag.yaw + dx * TURN_SPEED
    view.pitch = clamp(drag.pitch - dy * TURN_SPEED, -MAX_PITCH, MAX_PITCH)
    redrawRef.current?.()
  }

  // A press and release without dragging is a click: on a node it selects that
  // course (or clears it if it's already selected), and anywhere else it clears.
  function endDrag(e) {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag) return
    if (drag.moved) {
      setDragging(false)
      return
    }
    if (e.type !== 'pointerup') return
    const i = hoveredRef.current
    onSelect(i === null || i === selectedIndex ? null : layout.nodes[i].course)
  }

  const hoveredCourse = hovered !== null ? layout.nodes[hovered].course : null
  // Links of the hovered and selected nodes, drawn in the purple gradient.
  const isActive = (i) => i === hovered || i === selectedIndex
  const activeLinks = layout.links.flatMap((link, i) => (isActive(link.from) || isActive(link.to) ? [i] : []))

  return (
    <div
      ref={containerRef}
      className={dragging ? 'network dragging' : 'network'}
      onPointerDown={startDrag}
      onPointerMove={moveMouse}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => (mouseRef.current = null)}
    >
      {size && (
        <svg className="network-chart" width={size.width} height={size.height} role="img" aria-label="Course map">
          <defs>
            {/* Logo 2's purple gradient, for the hovered and selected nodes. */}
            <linearGradient id="node-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#bd7cf4" />
              <stop offset="0.5" stopColor="#8750f5" />
              <stop offset="1" stopColor="#535cf6" />
            </linearGradient>
            {/* The same purple gradient along each of their links, running out
                from the node. */}
            {activeLinks.map((i) => {
              const link = layout.links[i]
              const [from, to] = isActive(link.from) ? [link.from, link.to] : [link.to, link.from]
              const start = positionsRef.current[from]
              const end = positionsRef.current[to]
              return (
                <linearGradient
                  key={i}
                  ref={(el) => (gradientRefs.current[i] = el)}
                  id={`link-gradient-${i}`}
                  gradientUnits="userSpaceOnUse"
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                >
                  <stop offset="0" stopColor="#bd7cf4" />
                  <stop offset="0.5" stopColor="#8750f5" />
                  <stop offset="1" stopColor="#535cf6" />
                </linearGradient>
              )
            })}
            <radialGradient id="network-shadow">
              <stop offset="0" stopColor="#1d3a66" stopOpacity="0.3" />
              <stop offset="0.6" stopColor="#1d3a66" stopOpacity="0.12" />
              <stop offset="1" stopColor="#1d3a66" stopOpacity="0" />
            </radialGradient>
            <filter id="node-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <ellipse ref={shadowRef} className="network-shadow" />
          <g className="network-links">
            {layout.links.map((link, i) => (
              <path key={i} ref={(el) => (linkRefs.current[i] = el)} />
            ))}
          </g>
          <g className="network-links-active">
            {activeLinks.map((i) => (
              <path
                key={i}
                ref={(el) => (glowLinkRefs.current[i] = el)}
                d={pathsRef.current[i]}
                stroke={`url(#link-gradient-${i})`}
              />
            ))}
          </g>
          <g ref={nodeGroupRef}>
            {layout.nodes.map((node, i) => (
              <g
                key={i}
                ref={(el) => (nodeRefs.current[i] = el)}
                className={isActive(i) ? 'network-node active' : 'network-node'}
                onPointerEnter={() => hover(i)}
                onPointerLeave={() => hover(null)}
              >
                <circle className="node-hit" r={NODE_RADIUS + 5} />
                <circle className="node-ring" r={NODE_RADIUS} />
                <circle ref={(el) => (hazeRefs.current[i] = el)} className="node-haze" r={NODE_RADIUS + 2} />
              </g>
            ))}
          </g>
        </svg>
      )}
      {hoveredCourse && (
        <div ref={labelRef} className="network-label">
          <span className="network-label-code">{hoveredCourse.code}</span>
          {hoveredCourse.title}
        </div>
      )}
      {/* Course details while a node is hovered. Only the name and number so far. */}
      {hoveredCourse && (
        <div className="network-panel">
          <div className="network-panel-code">{hoveredCourse.code}</div>
          <div className="network-panel-title">{hoveredCourse.title}</div>
        </div>
      )}
    </div>
  )
}

export default CourseNetwork
