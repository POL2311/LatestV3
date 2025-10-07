import React, { useEffect, useRef } from 'react'

interface ParticleSystemProps {
  particleCount?: number
  colors?: string[]
  speed?: number
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  particleCount = 50,
  colors = ['#8b5cf6', '#3b82f6', '#ec4899', '#10b981'],
  speed = 0.5
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Particle class
    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      size: number
      color: string
      opacity: number
      life: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.vx = (Math.random() - 0.5) * speed
        this.vy = (Math.random() - 0.5) * speed
        this.size = Math.random() * 3 + 1
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = Math.random() * 0.5 + 0.2
        this.life = Math.random() * 100 + 50
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.life--

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0

        // Fade out as life decreases
        this.opacity = (this.life / 100) * 0.5
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      isDead() {
        return this.life <= 0
      }
    }

    // Create particles
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.update()
        particle.draw()

        // Remove dead particles and create new ones
        if (particle.isDead()) {
          particles.splice(i, 1)
          particles.push(new Particle())
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [particleCount, colors, speed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.6
      }}
    />
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  distance?: number
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  delay = 0,
  duration = 3,
  distance = 10
}) => {
  return (
    <div
      style={{
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        '--float-distance': `${distance}px`
      } as React.CSSProperties}
    >
      {children}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(var(--float-distance));
          }
        }
      `}</style>
    </div>
  )
}

interface GlowEffectProps {
  children: React.ReactNode
  color?: string
  intensity?: number
  size?: number
}

export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  color = '#8b5cf6',
  intensity = 0.5,
  size = 20
}) => {
  return (
    <div
      style={{
        filter: `drop-shadow(0 0 ${size}px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')})`,
        transition: 'filter 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.filter = `drop-shadow(0 0 ${size * 1.5}px ${color}${Math.floor(intensity * 1.5 * 255).toString(16).padStart(2, '0')})`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.filter = `drop-shadow(0 0 ${size}px ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')})`
      }}
    >
      {children}
    </div>
  )
}

interface TypewriterEffectProps {
  text: string
  speed?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  speed = 100,
  delay = 0,
  className = '',
  style = {}
}) => {
  const [displayText, setDisplayText] = React.useState('')
  const [currentIndex, setCurrentIndex] = React.useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1))
        setCurrentIndex(currentIndex + 1)
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timer)
  }, [currentIndex, text, speed, delay])

  return (
    <span className={className} style={style}>
      {displayText}
      {currentIndex < text.length && (
        <span
          style={{
            opacity: 1,
            animation: 'blink 1s infinite'
          }}
        >
          |
        </span>
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </span>
  )
}

interface HolographicTextProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export const HolographicText: React.FC<HolographicTextProps> = ({
  children,
  className = '',
  style = {}
}) => {
  return (
    <div
      className={className}
      style={{
        background: 'linear-gradient(45deg, #8b5cf6, #3b82f6, #ec4899, #10b981, #8b5cf6)',
        backgroundSize: '400% 400%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'holographic 3s ease-in-out infinite',
        ...style
      }}
    >
      {children}
      <style jsx>{`
        @keyframes holographic {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </div>
  )
}

interface PulseRingProps {
  size?: number
  color?: string
  duration?: number
}

export const PulseRing: React.FC<PulseRingProps> = ({
  size = 100,
  color = '#8b5cf6',
  duration = 2
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`
      }}
    >
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: `2px solid ${color}`,
            borderRadius: '50%',
            animation: `pulse-ring ${duration}s ease-out infinite`,
            animationDelay: `${index * 0.5}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

export default {
  ParticleSystem,
  FloatingElement,
  GlowEffect,
  TypewriterEffect,
  HolographicText,
  PulseRing
}