import { useEffect, useRef } from 'react'

interface Ember {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  hue: number
}

export default function LavaParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const embers: Ember[] = []
    let animationId: number
    let frameCount = 0

    const createEmber = (): Ember => {
      const centerX = window.innerWidth / 2
      const topY = window.innerHeight * 0.55
      return {
        x: centerX + (Math.random() - 0.5) * 60,
        y: topY,
        vx: (Math.random() - 0.5) * 3,
        vy: -(Math.random() * 3 + 1),
        size: Math.random() * 3 + 1,
        life: 0,
        maxLife: Math.random() * 80 + 40,
        hue: Math.random() * 40 + 10, // 10-50 range (red to yellow)
      }
    }

    const animate = () => {
      frameCount++

      // 创建新ember
      if (frameCount % 3 === 0) {
        embers.push(createEmber())
      }

      // 更新和渲染
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i]
        e.x += e.vx
        e.y += e.vy
        e.vy += 0.02
        e.vx += (Math.random() - 0.5) * 0.1
        e.life++

        if (e.life >= e.maxLife) {
          embers.splice(i, 1)
        }
      }

      // 限制数量
      while (embers.length > 80) embers.shift()

      // 更新DOM
      if (container) {
        // 使用CSS变量更新ember位置（性能优化）
        const emberElements = container.querySelectorAll('.ember')
        embers.forEach((e, idx) => {
          let el = emberElements[idx] as HTMLElement
          if (!el) {
            el = document.createElement('div')
            el.className = 'ember'
            container.appendChild(el)
          }
          const lifeRatio = e.life / e.maxLife
          const opacity = 1 - lifeRatio
          const scale = 1 - lifeRatio * 0.5
          el.style.transform = `translate(${e.x}px, ${e.y}px) scale(${scale})`
          el.style.opacity = `${opacity}`
          el.style.width = `${e.size}px`
          el.style.height = `${e.size}px`
          el.style.background = `hsl(${e.hue}, 100%, ${60 - lifeRatio * 30}%)`
          el.style.boxShadow = `0 0 ${e.size * 2}px hsl(${e.hue}, 100%, 50%)`
        })

        // 移除多余的元素
        const allEmbers = container.querySelectorAll('.ember')
        for (let i = embers.length; i < allEmbers.length; i++) {
          allEmbers[i].remove()
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [])

  return <div ref={containerRef} className="lava-particles-container" />
}
