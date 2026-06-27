"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  alpha: number
  decay: number
}

type FrameStep =
  | { type: "hold"; idx: number; start: number; end: number }
  | { type: "fade"; from: number; to: number; start: number; end: number }

function getBezierXY(t: number, p0: number, p1: number, p2: number, p3: number) {
  return (
    Math.pow(1 - t, 3) * p0 +
    3 * Math.pow(1 - t, 2) * t * p1 +
    3 * (1 - t) * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3
  )
}

// Lantern frame sequence timeline (in frames @ ~60fps).
// domdom_0 (unlit) and domdom_4 (final, with subtitle) are held longer than the
// intermediate "DD" / "DO DO" / "DOM DOM" frames, which only flash by briefly.
const FRAME_SCHEDULE: FrameStep[] = [
  { type: "hold", idx: 0, start: 0, end: 130 },
  { type: "fade", from: 0, to: 1, start: 130, end: 155 },
  { type: "hold", idx: 1, start: 155, end: 175 },
  { type: "fade", from: 1, to: 2, start: 175, end: 200 },
  { type: "hold", idx: 2, start: 200, end: 220 },
  { type: "fade", from: 2, to: 3, start: 220, end: 245 },
  { type: "hold", idx: 3, start: 245, end: 265 },
  { type: "fade", from: 3, to: 4, start: 265, end: 295 },
  { type: "hold", idx: 4, start: 295, end: 385 },
]
const TOTAL_DURATION = 385
const MASK_REVEAL_DURATION = 90

function getFrameBlend(progress: number) {
  const clamped = Math.min(progress, TOTAL_DURATION)
  for (const step of FRAME_SCHEDULE) {
    if (clamped >= step.start && clamped <= step.end) {
      if (step.type === "hold") {
        return { from: step.idx, to: step.idx, alpha: 0 }
      }
      const t = (clamped - step.start) / (step.end - step.start)
      return { from: step.from, to: step.to, alpha: t }
    }
  }
  return { from: 4, to: 4, alpha: 0 }
}

export default function StudioSplash({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const lanternFrames = [0, 1, 2, 3, 4].map((i) => {
      const img = new Image()
      img.src = `/brand/domdom_${i}.webp`
      return img
    })

    const fireflyImg = new Image()
    fireflyImg.src = "/brand/domdom_firefly.webp"

    let progress = 0
    let animationId: number
    let particles: Particle[] = []
    let cancelled = false

    const cw = canvas.width
    const ch = canvas.height
    const centerX = cw / 2
    const centerY = ch * 0.42
    const imgSize = Math.min(cw, ch) * 0.72
    const maxMaskRadius = Math.sqrt(cw * cw + ch * ch)

    // Firefly sweeps in along a Bezier curve during the reveal, then settles
    // into a small idle hover near the lantern for the rest of the sequence.
    const startX = -40, startY = ch * 0.15
    const cp1X = cw * 0.2, cp1Y = ch * 0.85
    const cp2X = cw * 0.85, cp2Y = ch * 0.2
    const endX = centerX + imgSize * 0.32
    const endY = centerY - imgSize * 0.4

    function drawLanternFrame(blendFrom: number, blendTo: number, alpha: number) {
      const dx = centerX - imgSize / 2
      const dy = centerY - imgSize / 2
      ctx.globalAlpha = 1
      ctx.drawImage(lanternFrames[blendFrom], dx, dy, imgSize, imgSize)
      if (alpha > 0) {
        ctx.globalAlpha = alpha
        ctx.drawImage(lanternFrames[blendTo], dx, dy, imgSize, imgSize)
        ctx.globalAlpha = 1
      }
    }

    function animate() {
      if (cancelled) return
      if (progress > TOTAL_DURATION) {
        cancelAnimationFrame(animationId)
        onComplete()
        return
      }

      const revealT = Math.min(progress / MASK_REVEAL_DURATION, 1)

      let fx: number, fy: number
      if (revealT < 1) {
        fx = getBezierXY(revealT, startX, cp1X, cp2X, endX)
        fy = getBezierXY(revealT, startY, cp1Y, cp2Y, endY)
      } else {
        fx = endX + Math.sin(progress * 0.05) * 14
        fy = endY + Math.cos(progress * 0.07) * 10
      }

      ctx.fillStyle = "#000000"
      ctx.fillRect(0, 0, cw, ch)

      // Light trail particles (lighter emission once idle, for ambiance)
      const shouldEmit = revealT < 1 || progress % 4 === 0
      if (shouldEmit && progress < TOTAL_DURATION - 15) {
        particles.push({
          x: fx,
          y: fy,
          size: 24 + Math.random() * 12,
          alpha: 1.0,
          decay: 0.035,
        })
      }

      ctx.save()
      ctx.globalCompositeOperation = "screen"

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, `rgba(180, 255, 50, ${p.alpha})`)
        gradient.addColorStop(0.3, `rgba(0, 200, 50, ${p.alpha * 0.5})`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.alpha -= p.decay
        if (p.alpha <= 0) {
          particles.splice(i, 1)
        }
      }
      ctx.restore()

      // Reveal: during the firefly's sweep, an expanding clip mask reveals the
      // lantern art from the pitch-black background; once it fully covers the
      // canvas the mask is dropped and the crossfading frame sequence plays.
      const { from, to, alpha } = getFrameBlend(progress)
      if (revealT < 1) {
        ctx.save()
        ctx.beginPath()
        const maskRadius = 50 + revealT * maxMaskRadius
        ctx.arc(fx, fy, maskRadius, 0, Math.PI * 2)
        ctx.clip()
        drawLanternFrame(from, to, alpha)
        ctx.restore()
      } else {
        drawLanternFrame(from, to, alpha)
      }

      // Firefly sprite
      ctx.save()
      const flicker = Math.sin(progress * 0.8) * 2
      const size = 16 + flicker

      ctx.shadowBlur = 15
      ctx.shadowColor = "#b4ff32"
      ctx.drawImage(fireflyImg, fx - size / 2, fy - size / 2, size, size)
      ctx.restore()

      progress++
      animationId = requestAnimationFrame(animate)
    }

    let imagesLoaded = 0
    const totalImages = lanternFrames.length + 1
    function checkLoad() {
      imagesLoaded++
      if (imagesLoaded === totalImages) animate()
    }
    lanternFrames.forEach((img) => {
      img.onload = checkLoad
    })
    fireflyImg.onload = checkLoad

    return () => {
      cancelled = true
      cancelAnimationFrame(animationId)
    }
  }, [onComplete])

  return (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      <canvas
        ref={canvasRef}
        width={450}
        height={800}
        style={{ imageRendering: "pixelated", maxWidth: "100%", maxHeight: "100%", aspectRatio: "9 / 16" }}
      />
    </div>
  )
}
