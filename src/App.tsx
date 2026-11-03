import { useEffect, useRef, useState } from 'react'
import VolcanoCanvas from './components/VolcanoCanvas'
import SnowCanvas from './components/SnowCanvas'
import LavaParticles from './components/LavaParticles'
import './App.css'

function App() {
  const [showTitle, setShowTitle] = useState(false)

  useEffect(() => {
    setTimeout(() => setShowTitle(true), 500)
  }, [])

  return (
    <div className="app-container">
      {/* 背景渐变 */}
      <div className="background-gradient" />
      
      {/* 星空背景 */}
      <div className="stars" />
      
      {/* 雪花画布 */}
      <SnowCanvas />
      
      {/* 火山画布 */}
      <VolcanoCanvas />
      
      {/* 熔岩粒子 */}
      <LavaParticles />
      
      {/* 地面 */}
      <div className="ground" />
      
      {/* 雪地 */}
      <div className="snow-ground" />
      
      {/* 标题 */}
      <div className={`title-container ${showTitle ? 'visible' : ''}`}>
        <h1 className="main-title">
          <span className="fire-text">火山</span>
          <span className="ice-text">飘雪</span>
        </h1>
        <p className="subtitle">当烈焰遇上冰雪，天地间最壮美的邂逅</p>
      </div>

      {/* 装饰元素 */}
      <div className="decoration-left">
        <div className="snow-flake-deco">❄</div>
      </div>
      <div className="decoration-right">
        <div className="fire-deco">🔥</div>
      </div>
    </div>
  )
}

export default App
