import { useEffect, useRef } from 'react'

interface Snowflake {
  x: number
  y: number
  radius: number
  speed: number
  wind: number
  opacity: number
  swing: number
  swingSpeed: number
  swingOffset: number
}

export default function SnowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const snowflakesRef = useRef<Snowflake[]>([])

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

    // 初始化雪花
    const createSnowflake = (): Snowflake => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      radius: Math.random() * 3 + 1,
      speed: Math.random() * 1.5 + 0.5,
      wind: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.6 + 0.4,
      swing: Math.random() * 2,
      swingSpeed: Math.random() * 0.02 + 0.01,
      swingOffset: Math.random() * Math.PI * 2,
    })

    const snowflakeCount = Math.min(200, Math.floor(window.innerWidth / 5))
    snowflakesRef.current = Array.from({ length: snowflakeCount }, createSnowflake)

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.01

      snowflakesRef.current.forEach((flake) => {
        // 更新位置
        flake.y += flake.speed
        flake.x += flake.wind + Math.sin(time * flake.swingSpeed * 100 + flake.swingOffset) * flake.swing * 0.3

        // 重置位置
        if (flake.y > canvas.height) {
          flake.y = -10
          flake.x = Math.random() * canvas.width
        }
        if (flake.x > canvas.width) flake.x = 0
        if (flake.x < 0) flake.x = canvas.width

        // 绘制雪花
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()

        // 添加光晕效果
        if (flake.radius > 2) {
          ctx.beginPath()
          ctx.arc(flake.x, flake.y, flake.radius * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200, 220, 255, ${flake.opacity * 0.2})`
          ctx.fill()
        }
      })

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
      className="snow-canvas"
    />
  )
}
