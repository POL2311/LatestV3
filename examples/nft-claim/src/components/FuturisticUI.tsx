import React from 'react'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  hover?: boolean
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  style = {}, 
  hover = true 
}) => {
  return (
    <div 
      className={`glass-card ${hover ? 'hover:scale-[1.02]' : ''} ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '24px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        ...style
      }}
    >
      {children}
    </div>
  )
}

interface NeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  className = '',
  style = {}
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)'
        }
      case 'success':
        return {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
        }
      case 'warning':
        return {
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)'
        }
      case 'error':
        return {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)'
        }
      default:
        return {
          background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)'
        }
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '8px 16px',
          fontSize: '14px',
          borderRadius: '20px'
        }
      case 'lg':
        return {
          padding: '16px 32px',
          fontSize: '18px',
          borderRadius: '30px'
        }
      default:
        return {
          padding: '12px 24px',
          fontSize: '16px',
          borderRadius: '25px'
        }
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`neon-button ${className}`}
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        border: 'none',
        color: 'white',
        fontWeight: '600',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        opacity: disabled ? 0.6 : 1,
        transform: loading ? 'scale(0.98)' : 'scale(1)',
        ...style
      }}
    >
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="animate-pulse">⚡</div>
        </div>
      )}
      <span style={{ opacity: loading ? 0 : 1 }}>
        {children}
      </span>
    </button>
  )
}

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'loading' | 'success' | 'warning' | 'error'
  children: React.ReactNode
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'online':
        return {
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981'
        }
      case 'offline':
        return {
          background: 'rgba(107, 114, 128, 0.2)',
          border: '1px solid rgba(107, 114, 128, 0.3)',
          color: '#6b7280'
        }
      case 'loading':
        return {
          background: 'rgba(59, 130, 246, 0.2)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#3b82f6'
        }
      case 'success':
        return {
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981'
        }
      case 'warning':
        return {
          background: 'rgba(245, 158, 11, 0.2)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          color: '#f59e0b'
        }
      case 'error':
        return {
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444'
        }
      default:
        return {
          background: 'rgba(139, 92, 246, 0.2)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: '#8b5cf6'
        }
    }
  }

  return (
    <div
      style={{
        ...getStatusStyles(),
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      <div 
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'currentColor',
          animation: status === 'loading' ? 'pulse 2s infinite' : 'none'
        }}
      />
      {children}
    </div>
  )
}

interface InfoCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: string
  gradient?: string
}

export const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon = '📊',
  gradient = 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)'
}) => {
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
      e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)'
      e.currentTarget.style.transform = 'translateY(-2px)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
      e.currentTarget.style.transform = 'translateY(0)'
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '16px' }}>{icon}</span>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>{title}</span>
      </div>
      <div style={{
        fontSize: '20px',
        fontWeight: '700',
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: subtitle ? '4px' : '0'
      }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          {subtitle}
        </div>
      )}
    </div>
  )
}

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = '#8b5cf6' 
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return '16px'
      case 'lg': return '32px'
      default: return '24px'
    }
  }

  return (
    <div
      style={{
        width: getSize(),
        height: getSize(),
        border: `2px solid rgba(139, 92, 246, 0.2)`,
        borderTop: `2px solid ${color}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}
    />
  )
}

// Agregar keyframes para el spinner
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

// Inyectar los keyframes en el head
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = spinKeyframes
  document.head.appendChild(style)
}