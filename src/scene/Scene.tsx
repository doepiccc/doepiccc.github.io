import { useEffect, useRef } from 'react'
import { useLocale } from '../i18n/LocaleContext'

/* Fixed backdrop: a CSS sky and water per season plus light low-poly layers (Gemini),
   moved by scroll and pointer. Scrolling the page walks through four market seasons. */

const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const
type Season = (typeof SEASONS)[number]

const SEASON_NAMES = {
  en: ['Crypto spring', 'DeFi summer', 'Harvest autumn', 'Crypto winter'],
  ru: ['Крипто-весна', 'DeFi-лето', 'Осень урожая', 'Криптозима'],
} as const

const asset = (name: string) => `${import.meta.env.BASE_URL}img/lp/${name}.webp`
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

/** Blend weights of the four seasons for a scroll position from 0 to 3. */
function seasonWeights(position: number): number[] {
  const weights = [0, 0, 0, 0]
  const index = Math.min(2, Math.floor(position))
  const eased = clamp((position - index - 0.3) / 0.4, 0, 1)
  const k = eased * eased * (3 - 2 * eased)
  weights[index] = 1 - k
  weights[index + 1] = k
  return weights
}

type Kind = 'block' | 'firefly' | 'leaf' | 'coin' | 'snow'

interface Particle {
  kind: Kind
  x: number
  y: number
  vx: number
  vy: number
  size: number
  angle: number
  spin: number
  phase: number
  color: string
}

const KIND_SEASON: Record<Kind, number> = { block: 0, firefly: 1, leaf: 2, coin: 2, snow: 3 }
const KIND_CAP: Record<Kind, number> = { block: 38, firefly: 36, leaf: 36, coin: 12, snow: 130 }
const KIND_RATE: Record<Kind, number> = { block: 5, firefly: 0, leaf: 5, coin: 1.5, snow: 20 }

function spawn(kind: Kind, width: number, height: number): Particle {
  const random = Math.random
  const pick = (list: string[]) => list[Math.floor(random() * list.length)]
  const base: Particle = {
    kind,
    x: random() * width * 1.15 - width * 0.05,
    y: -24,
    vx: 8 + random() * 20,
    vy: 24 + random() * 30,
    size: 4 + random() * 5,
    angle: random() * 6.28,
    spin: (random() - 0.5) * 2.4,
    phase: random() * 6.28,
    color: '255,255,255',
  }
  if (kind === 'block') return { ...base, size: 5 + random() * 5, color: pick(['164,217,105', '240,235,136', '87,189,145']) }
  if (kind === 'leaf') return { ...base, vy: 34 + random() * 34, size: 7 + random() * 6, color: pick(['217,162,105', '189,87,87', '240,235,136']) }
  if (kind === 'coin') return { ...base, vy: 40 + random() * 30, size: 6 + random() * 4, color: '240,215,120' }
  if (kind === 'snow') return { ...base, vx: -6 + random() * 12, vy: 26 + random() * 40, size: 1.2 + random() * 2.8, color: '232,240,255' }
  return {
    ...base,
    x: random() * width,
    y: height * (0.3 + random() * 0.55),
    vx: -8 + random() * 16,
    vy: -6 + random() * 12,
    size: 1.6 + random() * 2.2,
    color: pick(['240,235,136', '164,217,105', '87,189,145']),
  }
}

function draw(context: CanvasRenderingContext2D, p: Particle, time: number, fade: number) {
  context.save()
  context.translate(p.x, p.y)
  context.rotate(p.angle)
  if (p.kind === 'block') {
    context.fillStyle = `rgba(${p.color},${0.75 * fade})`
    context.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
    context.strokeStyle = `rgba(255,255,255,${0.55 * fade})`
    context.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size)
  } else if (p.kind === 'leaf') {
    context.fillStyle = `rgba(${p.color},${0.9 * fade})`
    context.beginPath()
    context.moveTo(0, -p.size)
    context.quadraticCurveTo(p.size * 0.9, 0, 0, p.size)
    context.quadraticCurveTo(-p.size * 0.9, 0, 0, -p.size)
    context.fill()
  } else if (p.kind === 'coin') {
    const turn = Math.max(0.15, Math.abs(Math.cos(time * 2 + p.phase)))
    context.fillStyle = `rgba(${p.color},${0.92 * fade})`
    context.beginPath()
    context.ellipse(0, 0, p.size * turn, p.size, 0, 0, 6.283)
    context.fill()
    context.strokeStyle = `rgba(217,162,105,${fade})`
    context.lineWidth = 1.5
    context.stroke()
  } else if (p.kind === 'snow') {
    context.fillStyle = `rgba(${p.color},${0.9 * fade})`
    context.beginPath()
    context.arc(0, 0, p.size, 0, 6.283)
    context.fill()
  } else {
    const pulse = 0.5 + 0.5 * Math.sin(time * 2.2 + p.phase)
    const glow = context.createRadialGradient(0, 0, 0, 0, 0, p.size * 5)
    glow.addColorStop(0, `rgba(${p.color},${0.95 * pulse * fade})`)
    glow.addColorStop(1, `rgba(${p.color},0)`)
    context.fillStyle = glow
    context.beginPath()
    context.arc(0, 0, p.size * 5, 0, 6.283)
    context.fill()
  }
  context.restore()
}

export function Scene() {
  const { locale } = useLocale()
  const sceneRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scene = sceneRef.current
    const canvas = canvasRef.current
    const dots = dotsRef.current
    if (!scene || !canvas || !dots) return
    const context = canvas.getContext('2d')
    const root = document.documentElement
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const layers = Array.from(scene.querySelectorAll<HTMLElement>('[data-depth]'))
    const seasonal = Array.from(scene.querySelectorAll<HTMLElement>('[data-season]'))
    const buttons = Array.from(dots.querySelectorAll('button'))
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let particles: Particle[] = []
    let weights = [1, 0, 0, 0]
    let frameId = 0
    let last = performance.now()

    const update = () => {
      const scroll = window.scrollY
      const height = window.innerHeight
      const max = Math.max(1, root.scrollHeight - height)
      weights = seasonWeights(3 * clamp(scroll / max, 0, 1))
      for (const element of seasonal) element.style.opacity = String(weights[SEASONS.indexOf(element.dataset.season as Season)])
      const current = weights.indexOf(Math.max(...weights))
      buttons.forEach((button, index) => button.classList.toggle('is-on', index === current))

      const progress = 0.34 + 0.66 * Math.min(1, scroll / (height * 1.1))
      scene.style.setProperty('--night', String((1 - progress) * 0.7))
      /* the core climbs from just under the skyline to well above it */
      const rise = -(0.31 + 0.2 * progress) * height
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth)
        /* everything standing on the horizon moves sideways only, so no gap opens under the city */
        const x = -pointer.x * depth * 40
        const centre = layer.classList.contains('layer--centre') ? 'translateX(-50%) ' : ''
        const y = layer.classList.contains('layer--core') ? rise - pointer.y * depth * 20 : 0
        layer.style.transform = `${centre}translate3d(${x}px, ${y}px, 0)`
      }
      root.style.setProperty('--veil-amount', String(0.2 + 0.42 * Math.min(1, scroll / (height * 1.1))))
    }

    const stepParticles = (delta: number, time: number) => {
      if (!context) return
      const { width, height } = canvas
      const count: Record<Kind, number> = { block: 0, firefly: 0, leaf: 0, coin: 0, snow: 0 }
      for (const p of particles) count[p.kind] += 1
      for (const kind of Object.keys(KIND_CAP) as Kind[]) {
        const weight = weights[KIND_SEASON[kind]]
        if (weight <= 0.05) continue
        if (kind === 'firefly') {
          while (count.firefly < KIND_CAP.firefly * weight) {
            particles.push(spawn(kind, width, height))
            count.firefly += 1
          }
        } else if (count[kind] < KIND_CAP[kind] && Math.random() < KIND_RATE[kind] * weight * delta) {
          particles.push(spawn(kind, width, height))
        }
      }
      context.clearRect(0, 0, width, height)
      particles = particles.filter((p) => {
        const fade = Math.min(1, weights[KIND_SEASON[p.kind]] * 3)
        if (p.kind === 'firefly' && fade < 0.04) return false
        p.x += (p.vx + Math.sin(time * 1.3 + p.phase) * (p.kind === 'snow' ? 10 : 18)) * delta
        p.y += p.vy * delta
        p.angle += p.spin * delta
        if (p.kind === 'firefly') {
          if (p.x < -20 || p.x > width + 20) p.vx *= -1
          if (p.y < height * 0.25 || p.y > height * 0.9) p.vy *= -1
        } else if (p.y > height + 30 || p.x > width + 60) {
          return false
        }
        draw(context, p, time, fade)
        return true
      })
    }

    const frame = (now: number) => {
      pointer.x += (pointer.tx - pointer.x) * 0.06
      pointer.y += (pointer.ty - pointer.y) * 0.06
      update()
      stepParticles(Math.min(0.05, (now - last) / 1000), now / 1000)
      last = now
      frameId = requestAnimationFrame(frame)
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      update()
    }
    const onPointer = (event: PointerEvent) => {
      pointer.tx = (event.clientX / window.innerWidth) * 2 - 1
      pointer.ty = (event.clientY / window.innerHeight) * 2 - 1
    }
    const onScroll = () => update()
    const jumps = buttons.map((button, index) => {
      const jump = () => {
        const max = Math.max(1, root.scrollHeight - window.innerHeight)
        window.scrollTo({ top: (max * index) / 3, behavior: still ? 'auto' : 'smooth' })
      }
      button.addEventListener('click', jump)
      return () => button.removeEventListener('click', jump)
    })

    /* the spring shore ships with the page, the other three load when the browser is idle */
    const loadLaterShores = () => {
      for (const element of scene.querySelectorAll<HTMLElement>('[data-shore]')) {
        element.style.backgroundImage = `url("${asset(`shore-${element.dataset.shore}`)}")`
      }
    }
    const idle = window.setTimeout(loadLaterShores, 1500)

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    if (fine && !still) window.addEventListener('pointermove', onPointer)
    /* page height changes between routes, which shifts the season for the same scroll position */
    const observer = new ResizeObserver(() => update())
    observer.observe(document.body)
    resize()
    scene.classList.add('is-ready')
    if (!still) frameId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(frameId)
      window.clearTimeout(idle)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onPointer)
      jumps.forEach((remove) => remove())
    }
  }, [])

  return (
    <>
      <div className="scene" ref={sceneRef} aria-hidden="true">
        <div className="layer sky">
          {SEASONS.map((season) => <div className={`sky__season sky__season--${season}`} data-season={season} key={season} />)}
          <div className="sky__grid" />
          <div className="sky__stars" />
          <div className="sky__night" />
        </div>
        <div className="layer layer--core" data-depth="0.02">
          <div className="core__halo" />
          <img src={asset('core')} alt="" decoding="async" />
        </div>
        <div className="layer layer--centre hills" data-depth="0.02"><img src={asset('hills')} alt="" decoding="async" /></div>
        <div className="layer layer--centre city city--far" data-depth="0.045"><img src={asset('city-far')} alt="" decoding="async" /></div>
        <div className="layer layer--centre city city--near" data-depth="0.1"><img src={asset('city-near')} alt="" decoding="async" /></div>
        <div className="layer water">
          {SEASONS.map((season) => <div className={`water__season water__season--${season}`} data-season={season} key={season} />)}
          <div className="water__ripples" />
          <div className="water__glint" />
        </div>
        <div className="layer layer--centre shore" data-depth="0.12">
          {SEASONS.map((season, index) => (
            <div
              className="shore__season"
              data-season={season}
              data-shore={index ? season : undefined}
              style={index ? undefined : { backgroundImage: `url("${asset('shore-spring')}")` }}
              key={season}
            />
          ))}
        </div>
      </div>
      <canvas className="particles" ref={canvasRef} aria-hidden="true" />
      <div className="seasons glass" ref={dotsRef} role="group" aria-label="Seasons" data-no-i18n>
        {SEASONS.map((season, index) => (
          <button
            type="button"
            className={`seasons__dot seasons__dot--${season}`}
            data-name={SEASON_NAMES[locale][index]}
            aria-label={SEASON_NAMES[locale][index]}
            key={season}
          />
        ))}
      </div>
      <div className="veil" aria-hidden="true" />
    </>
  )
}
