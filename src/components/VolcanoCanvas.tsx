import { useEffect, useRef } from 'react'

interface LavaParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  life: number
  maxLife: number
  color: string
}

interface SmokeParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  life: number
  maxLife: number
  opacity: number
}

export default function VolcanoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const lavaParticles: LavaParticle[] = []
    const smokeParticles: SmokeParticle[] = []

    const volcanoX = () => canvas.width / 2
    const volcanoTopY = () => canvas.height * 0.55

    const lavaColors = [
      '#FF4500',
      '#FF6347',
      '#FF8C00',
      '#FFD700',
      '#FF0000',
      '#FFA500',
    ]

    const createLavaParticle = (): LavaParticle => {
      const angle = Math.random() * Math.PI - Math.PI / 2
      const speed = Math.random() * 4 + 2
      return {
        x: volcanoX() + (Math.random() - 0.5) * 30,
        y: volcanoTopY(),
        vx: Math.cos(angle) * speed * (Math.random() * 0.5 + 0.5),
        vy: -Math.abs(Math.sin(angle) * speed) - Math.random() * 3,
        radius: Math.random() * 4 + 2,
        life: 0,
        maxLife: Math.random() * 60 + 40,
        color: lavaColors[Math.floor(Math.random() * lavaColors.length)],
      }
    }

    const createSmokeParticle = (): SmokeParticle => ({
      x: volcanoX() + (Math.random() - 0.5) * 40,
      y: volcanoTopY() - Math.random() * 20,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.5 + 0.5),
      radius: Math.random() * 20 + 10,
      life: 0,
      maxLife: Math.random() * 100 + 80,
      opacity: Math.random() * 0.3 + 0.1,
    })

    const drawVolcano = () => {
      const cx = volcanoX()
      const topY = volcanoTopY()
      const baseY = canvas.height
      const baseWidth = canvas.width * 0.4

      // 火山主体
      ctx.beginPath()
      ctx.moveTo(cx - baseWidth / 2, baseY)
      ctx.quadraticCurveTo(cx - baseWidth * 0.3, baseY - (baseY - topY) * 0.5, cx - 40, topY)
      ctx.lineTo(cx + 40, topY)
      ctx.quadraticCurveTo(cx + baseWidth * 0.3, baseY - (baseY - topY) * 0.5, cx + baseWidth / 2, baseY)
      ctx.closePath()

      // 火山渐变
      const gradient = ctx.createLinearGradient(cx, topY, cx, baseY)
      gradient.addColorStop(0, '#2d1b0e')
      gradient.addColorStop(0.3, '#1a0f08')
      gradient.addColorStop(0.7, '#0d0805')
      gradient.addColorStop(1, '#050302')
      ctx.fillStyle = gradient
      ctx.fill()

      // 火山口发光
      const glowGradient = ctx.createRadialGradient(cx, topY, 5, cx, topY, 60)
      glowGradient.addColorStop(0, 'rgba(255, 100, 0, 0.8)')
      glowGradient.addColorStop(0.3, 'rgba(255, 50, 0, 0.4)')
      glowGradient.addColorStop(0.6, 'rgba(200, 0, 0, 0.2)')
      glowGradient.addColorStop(1, 'rgba(100, 0, 0, 0)')
      ctx.fillStyle = glowGradient
      ctx.fillRect(cx - 60, topY - 60, 120, 120)

      // 熔岩流
      drawLavaFlows(cx, topY, baseY)
    }

    const drawLavaFlows = (cx: number, topY: number, baseY: number) => {
      const time = Date.now() * 0.001
      
      // 左侧熔岩流
      ctx.beginPath()
      ctx.moveTo(cx - 20, topY + 10)
      ctx.quadraticCurveTo(
        cx - 60 + Math.sin(time) * 5,
        topY + (baseY - topY) * 0.3,
        cx - 80 + Math.sin(time * 0.7) * 8,
        baseY
      )
      ctx.lineTo(cx - 70 + Math.sin(time * 0.7) * 8, baseY)
      ctx.quadraticCurveTo(
        cx - 50 + Math.sin(time) * 5,
        topY + (baseY - topY) * 0.3,
        cx - 10, topY + 10
      )
      ctx.closePath()
      
      const lavaGrad = ctx.createLinearGradient(cx, topY, cx, baseY)
      lavaGrad.addColorStop(0, 'rgba(255, 150, 0, 0.9)')
      lavaGrad.addColorStop(0.5, 'rgba(255, 69, 0, 0.7)')
      lavaGrad.addColorStop(1, 'rgba(200, 0, 0, 0.5)')
      ctx.fillStyle = lavaGrad
      ctx.fill()

      // 右侧熔岩流
      ctx.beginPath()
      ctx.moveTo(cx + 15, topY + 10)
      ctx.quadraticCurveTo(
        cx + 50 + Math.sin(time * 1.2) * 5,
        topY + (baseY - topY) * 0.4,
        cx + 60 + Math.sin(time * 0.9) * 8,
        baseY
      )
      ctx.lineTo(cx + 50 + Math.sin(time * 0.9) * 8, baseY)
      ctx.quadraticCurveTo(
        cx + 40 + Math.sin(time * 1.2) * 5,
        topY + (baseY - topY) * 0.4,
        cx + 5, topY + 10
      )
      ctx.closePath()
      ctx.fillStyle = lavaGrad
      ctx.fill()
    }

    let frameCount = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frameCount++

      // 绘制火山
      drawVolcano()

      // 添加新的熔岩粒子
      if (frameCount % 2 === 0) {
        for (let i = 0; i < 3; i++) {
          lavaParticles.push(createLavaParticle())
        }
      }

      // 添加烟雾粒子
      if (frameCount % 5 === 0) {
        smokeParticles.push(createSmokeParticle())
      }

      // 更新和绘制烟雾
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.radius += 0.3
        p.life++

        const lifeRatio = p.life / p.maxLife
        const alpha = p.opacity * (1 - lifeRatio)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(80, 80, 80, ${alpha})`
        ctx.fill()

        if (p.life >= p.maxLife) {
          smokeParticles.splice(i, 1)
        }
      }

      // 更新和绘制熔岩粒子
      for (let i = lavaParticles.length - 1; i >= 0; i--) {
        const p = lavaParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.08 // 重力
        p.life++

        const lifeRatio = p.life / p.maxLife
        const alpha = 1 - lifeRatio
        const radius = p.radius * (1 - lifeRatio * 0.5)

        // 绘制粒子
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color.replace(')', `, ${alpha})`).replace('rgb', 'rgba').replace('#', '')
        
        // 使用hex颜色转rgba
        const r = parseInt(p.color.slice(1, 3), 16) || 255
        const g = parseInt(p.color.slice(3, 5), 16) || 100
        const b = parseInt(p.color.slice(5, 7), 16) || 0
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
        ctx.fill()

        // 光晕
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`
        ctx.fill()

        if (p.life >= p.maxLife) {
          lavaParticles.splice(i, 1)
        }
      }

      // 限制粒子数量
      while (lavaParticles.length > 150) lavaParticles.shift()
      while (smokeParticles.length > 30) smokeParticles.shift()

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="volcano-canvas"
    />
  )
}
