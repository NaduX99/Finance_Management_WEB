import { useEffect, useRef } from 'react'

function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const value = parseInt(clean.length === 3 ? clean.split('').map((char) => char + char).join('') : clean, 16)

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  }
}

function mixColor(from, to, amount) {
  const start = hexToRgb(from)
  const end = hexToRgb(to)
  const ratio = Math.max(0, Math.min(amount, 1))

  return `rgb(${Math.round(start.r + (end.r - start.r) * ratio)}, ${Math.round(start.g + (end.g - start.g) * ratio)}, ${Math.round(start.b + (end.b - start.b) * ratio)})`
}

export default function DotField({
  dotRadius = 1.5,
  dotSpacing = 17,
  bulgeStrength = 82,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  cursorRadius = 350,
  cursorForce = 0.13,
  bulgeOnly = false,
  gradientFrom = '#11e915',
  gradientTo = '#2a742a',
  glowColor = '#120F17'
}) {
  const canvasRef = useRef(null)
  const pointerRef = useRef({ x: -9999, y: -9999, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let animationId = 0
    let dots = []
    let width = 0
    let height = 0

    const buildDots = () => {
      const rect = canvas.parentElement.getBoundingClientRect()
      const scale = window.devicePixelRatio || 1
      width = rect.width
      height = rect.height
      canvas.width = width * scale
      canvas.height = height * scale
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(scale, 0, 0, scale, 0, 0)

      dots = []
      for (let y = dotSpacing; y < height; y += dotSpacing) {
        for (let x = dotSpacing; x < width; x += dotSpacing) {
          dots.push({ x, y, phase: Math.random() * Math.PI * 2 })
        }
      }
    }

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height)
      const pointer = pointerRef.current

      if (pointer.active) {
        const glow = context.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, glowRadius)
        glow.addColorStop(0, `${glowColor}66`)
        glow.addColorStop(1, `${glowColor}00`)
        context.fillStyle = glow
        context.fillRect(0, 0, width, height)
      }

      dots.forEach((dot) => {
        const dx = dot.x - pointer.x
        const dy = dot.y - pointer.y
        const distance = Math.hypot(dx, dy)
        const influence = pointer.active ? Math.max(0, 1 - distance / cursorRadius) : 0
        const push = influence * bulgeStrength * cursorForce
        const angle = Math.atan2(dy, dx)
        const wave = bulgeOnly ? 0 : Math.sin(time * 0.002 + dot.phase) * waveAmplitude
        const x = dot.x + Math.cos(angle) * push
        const y = dot.y + Math.sin(angle) * push + wave
        const radius = dotRadius + influence * dotRadius * 2 + (sparkle ? Math.sin(time * 0.006 + dot.phase) * 0.25 : 0)

        context.beginPath()
        context.fillStyle = mixColor(gradientFrom, gradientTo, x / Math.max(width, 1))
        context.shadowColor = gradientFrom
        context.shadowBlur = influence > 0.15 ? 8 : 0
        context.globalAlpha = 0.78 + influence * 0.22
        context.arc(x, y, Math.max(radius, 1), 0, Math.PI * 2)
        context.fill()
      })

      context.shadowBlur = 0
      context.globalAlpha = 1
      animationId = requestAnimationFrame(draw)
    }

    const handleMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true
      }
    }

    const handleLeave = () => {
      pointerRef.current.active = false
    }

    buildDots()
    draw()
    window.addEventListener('resize', buildDots)
    canvas.addEventListener('pointermove', handleMove)
    canvas.addEventListener('pointerleave', handleLeave)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', buildDots)
      canvas.removeEventListener('pointermove', handleMove)
      canvas.removeEventListener('pointerleave', handleLeave)
    }
  }, [
    bulgeOnly,
    bulgeStrength,
    cursorForce,
    cursorRadius,
    dotRadius,
    dotSpacing,
    glowColor,
    glowRadius,
    gradientFrom,
    gradientTo,
    sparkle,
    waveAmplitude
  ])

  return (
    <div className="dot-field-container" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
