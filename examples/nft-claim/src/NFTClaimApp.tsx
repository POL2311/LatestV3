import React, { useMemo, useState, useCallback } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'

import '@solana/wallet-adapter-react-ui/styles.css'
import './styles.css'
import { GlassCard, NeonButton, StatusBadge, InfoCard, LoadingSpinner } from './components/FuturisticUI'
import { ParticleSystem, FloatingElement, GlowEffect, TypewriterEffect, HolographicText } from './components/VisualEffects'

// === CONFIG ===
const endpoint = 'https://api.devnet.solana.com'
const apiUrl = 'http://localhost:3000'

console.log('🔧 Config:', { endpoint, apiUrl });

export default function NFTClaimApp() {
  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter()], [])
  const connection = useMemo(() => new Connection(endpoint, 'confirmed'), [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div style={{ 
            minHeight: '100vh',
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Particle System Background */}
            <ParticleSystem 
              particleCount={30}
              colors={['#8b5cf6', '#3b82f6', '#ec4899', '#10b981']}
              speed={0.3}
            />

            {/* Header futurista */}
            <header style={{
              padding: '24px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              position: 'sticky',
              top: 0,
              zIndex: 100,
              background: 'rgba(10, 10, 15, 0.8)'
            }}>
              <div style={{ 
                maxWidth: '1200px', 
                margin: '0 auto', 
                padding: '0 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <FloatingElement delay={0} duration={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <GlowEffect color="#8b5cf6" intensity={0.6} size={15}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--gradient-primary)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        boxShadow: 'var(--shadow-glow-purple)'
                      }}>
                        🎨
                      </div>
                    </GlowEffect>
                    <div>
                      <HolographicText style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>
                        Gasless NFT
                      </HolographicText>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Solana Devnet</p>
                    </div>
                  </div>
                </FloatingElement>
                
                <FloatingElement delay={0.5} duration={3}>
                  <WalletMultiButton />
                </FloatingElement>
              </div>
            </header>

            {/* Contenido principal */}
            <main style={{ 
              maxWidth: '800px', 
              margin: '0 auto', 
              padding: '48px 24px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              {/* Hero Section */}
              <div className="animate-fadeInUp" style={{ marginBottom: '48px' }}>
                <FloatingElement delay={1} duration={5} distance={15}>
                  <h1 style={{ 
                    fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                    fontWeight: '900',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '24px',
                    textShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
                    lineHeight: '1.1'
                  }}>
                    <TypewriterEffect 
                      text="Gasless NFT Minting"
                      speed={150}
                      delay={1500}
                    />
                  </h1>
                </FloatingElement>
                
                <FloatingElement delay={2} duration={4} distance={8}>
                  <p style={{ 
                    fontSize: 'clamp(16px, 3vw, 20px)', 
                    color: 'var(--text-secondary)',
                    marginBottom: '16px',
                    lineHeight: '1.6',
                    maxWidth: '600px',
                    margin: '0 auto 16px'
                  }}>
                    Mint real NFTs on <span style={{ color: 'var(--purple-light)', fontWeight: '600' }}>Solana Devnet</span> without gas fees!
                  </p>
                </FloatingElement>
                
                <FloatingElement delay={2.5} duration={3} distance={5}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <StatusBadge status="success">Real Blockchain</StatusBadge>
                    <StatusBadge status="online">Zero Cost</StatusBadge>
                    <StatusBadge status="loading">Instant Delivery</StatusBadge>
                  </div>
                </FloatingElement>
              </div>

              {/* Info Cards */}
              <div className="animate-fadeInUp" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '16px',
                marginBottom: '48px'
              }}>
                <FloatingElement delay={3} duration={4} distance={6}>
                  <InfoCard 
                    title="Network" 
                    value="Solana Devnet" 
                    icon="🌐"
                    gradient="var(--gradient-primary)"
                  />
                </FloatingElement>
                <FloatingElement delay={3.2} duration={3.5} distance={8}>
                  <InfoCard 
                    title="API Endpoint" 
                    value="localhost:3000" 
                    icon="🔗"
                    gradient="var(--gradient-secondary)"
                  />
                </FloatingElement>
                <FloatingElement delay={3.4} duration={4.5} distance={4}>
                  <InfoCard 
                    title="Gas Fees" 
                    value="FREE" 
                    icon="⚡"
                    gradient="var(--gradient-success)"
                  />
                </FloatingElement>
              </div>

              {/* Main NFT Claim Section */}
              <FloatingElement delay={4} duration={6} distance={10}>
                <GlassCard className="animate-fadeInScale" style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}>
                  <DevnetNFTClaimSection />
                </GlassCard>
              </FloatingElement>

              {/* Footer Info */}
              <FloatingElement delay={5} duration={5} distance={6}>
                <div style={{ 
                  marginTop: '48px', 
                  padding: '24px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <p style={{ 
                    fontSize: '14px', 
                    color: 'var(--text-muted)',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    🔒 Powered by Solana blockchain technology<br/>
                    ⚡ Real devnet transactions with automatic gas payment<br/>
                    <code style={{ 
                      fontSize: '12px',
                      background: 'rgba(139, 92, 246, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      color: 'var(--purple-light)',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}>
                      POST {apiUrl}/api/nft/claim-magical
                    </code>
                  </p>
                </div>
              </FloatingElement>
            </main>
          </div>

          {/* Toast personalizado */}
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              duration: 10000,
              style: {
                background: 'rgba(26, 26, 46, 0.95)',
                color: '#fff',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                maxWidth: '500px',
                fontSize: '14px'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
              loading: {
                iconTheme: {
                  primary: '#8b5cf6',
                  secondary: '#fff',
                },
              }
            }} 
          />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

function DevnetNFTClaimSection() {
  const { publicKey } = useWallet()
  const [isLoading, setIsLoading] = useState(false)
  const [claimedNFTs, setClaimedNFTs] = useState<any[]>([])
  const [relayerStats, setRelayerStats] = useState<any>(null)

  // Load relayer stats
  const loadRelayerStats = useCallback(async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/relayer/stats`)
      if (response.data.success) {
        setRelayerStats(response.data.data)
      }
    } catch (error) {
      console.error('Error loading relayer stats:', error)
    }
  }, [])

  // Load initial data
  React.useEffect(() => {
    loadRelayerStats()
  }, [loadRelayerStats])

  // 🎯 DEVNET NFT CLAIM - Direct API call
  const onDevnetClaim = useCallback(async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first!', {
        style: {
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444'
        }
      })
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading(
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LoadingSpinner size="sm" />
        <span>Minting real NFT on Solana Devnet...</span>
      </div>
    )

    try {
      console.log('🎯 DEVNET NFT CLAIM STARTED')
      console.log(`👤 User: ${publicKey.toString()}`)
      console.log(`🌐 Network: Solana Devnet`)
      console.log(`🔗 API URL: ${apiUrl}/api/nft/claim-magical`)

      // Direct API call to backend
      const response = await axios.post(`${apiUrl}/api/nft/claim-magical`, {
        userPublicKey: publicKey.toString(),
        serviceId: 'devnet-demo-service'
      })

      console.log('📦 API Response:', response.data)

      if (response.data.success) {
        const { 
          nftMint, 
          transactionSignature, 
          userTokenAccount, 
          gasCostPaidByRelayer,
          metadata,
          relayerPublicKey
        } = response.data.data
        
        toast.dismiss(loadingToast)
        
        // Show success
        toast.success(
          <div style={{ lineHeight: '1.4' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px', color: '#10b981' }}>
              🎉 NFT MINTED SUCCESSFULLY!
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              ✨ Real Solana Devnet transaction<br/>
              💰 Gas paid by relayer: {gasCostPaidByRelayer} lamports
            </div>
          </div>,
          { 
            duration: 12000,
            style: {
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981'
            }
          }
        )

        // Show devnet explorer link
        setTimeout(() => {
          toast.success(
            <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#8b5cf6' }}>
                🎨 {metadata.name}
              </div>
              <div style={{ marginBottom: '4px' }}>
                📍 Mint: <code>{nftMint.slice(0, 12)}...{nftMint.slice(-12)}</code>
              </div>
              <div style={{ marginBottom: '8px' }}>
                📦 TX: <code>{transactionSignature.slice(0, 12)}...{transactionSignature.slice(-12)}</code>
              </div>
              <a 
                href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`} 
                target="_blank" 
                style={{
                  color: '#10b981',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                🔗 View on Devnet Explorer
              </a>
            </div>,
            { 
              duration: 20000,
              style: {
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#8b5cf6'
              }
            }
          )
        }, 2000)

        // Add NFT to local list
        const newNFT = {
          mint: nftMint,
          tokenAccount: userTokenAccount,
          transaction: transactionSignature,
          metadata,
          timestamp: new Date().toISOString(),
          gasCost: gasCostPaidByRelayer
        }
        setClaimedNFTs(prev => [newNFT, ...prev])

        // Reload relayer stats
        await loadRelayerStats()

      } else {
        throw new Error(response.data.error || 'Failed to mint NFT')
      }

    } catch (error: any) {
      console.error('❌ Error minting devnet NFT:', error)
      toast.dismiss(loadingToast)
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to mint NFT'
      toast.error(
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>❌ Minting Failed</div>
          <div style={{ fontSize: '12px' }}>{errorMessage}</div>
        </div>,
        {
          style: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444'
          }
        }
      )
      
      // Show debugging info
      setTimeout(() => {
        toast.error(
          <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>🔍 Debug Information:</div>
            <div>API URL: {apiUrl}</div>
            <div>User: {publicKey.toString().slice(0, 16)}...</div>
            <div>Network: Solana Devnet</div>
            <div>Check backend is running on port 3000</div>
          </div>,
          { 
            duration: 15000,
            style: {
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#f59e0b'
            }
          }
        )
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }, [publicKey, loadRelayerStats])

  if (!publicKey) {
    return (
      <div style={{ textAlign: 'center', padding: '48px 24px' }}>
        <GlowEffect color="#8b5cf6" intensity={0.8} size={25}>
          <div style={{
            fontSize: '48px',
            marginBottom: '24px',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            👆
          </div>
        </GlowEffect>
        <h3 style={{ 
          fontSize: '24px', 
          marginBottom: '16px',
          color: 'var(--text-primary)'
        }}>
          Connect Your Wallet
        </h3>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--text-muted)',
          marginBottom: '0',
          lineHeight: '1.6'
        }}>
          Connect your wallet to start minting NFTs on Solana Devnet<br/>
          <span style={{ color: 'var(--purple-light)' }}>Real blockchain transactions, zero gas fees! ✨</span>
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Wallet Info */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <GlowEffect color="#10b981" intensity={0.6} size={15}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '12px 20px',
            borderRadius: '50px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ fontSize: '14px', fontWeight: '600' }}>
              Connected: <code>{publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-8)}</code>
            </span>
          </div>
        </GlowEffect>
        
        {relayerStats && (
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--text-muted)',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <span>💰 Relayer Balance: {relayerStats.balance.toFixed(4)} SOL</span>
            <span>🌐 {relayerStats.network}</span>
          </div>
        )}
      </div>

      {/* Mint Button */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <GlowEffect 
          color={
            isLoading 
              ? '#8b5cf6' 
              : (relayerStats && relayerStats.balance < 0.01)
              ? '#ef4444'
              : '#10b981'
          } 
          intensity={0.7} 
          size={20}
        >
          <NeonButton
            onClick={onDevnetClaim}
            disabled={isLoading || (relayerStats && relayerStats.balance < 0.01)}
            loading={isLoading}
            variant={
              isLoading 
                ? 'primary' 
                : (relayerStats && relayerStats.balance < 0.01)
                ? 'error'
                : 'success'
            }
            size="lg"
            style={{ minWidth: '280px' }}
          >
            {isLoading 
              ? '🎨 Minting on Devnet...' 
              : (relayerStats && relayerStats.balance < 0.01)
              ? '💰 Relayer Low Balance'
              : '🚀 Mint NFT on Devnet'}
          </NeonButton>
        </GlowEffect>
      </div>

      {/* NFT Collection */}
      {claimedNFTs.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <h4 style={{ 
            textAlign: 'center',
            marginBottom: '24px',
            color: 'var(--text-primary)',
            fontSize: '20px'
          }}>
            🎨 Your Devnet NFTs ({claimedNFTs.length})
          </h4>
          
          <div style={{ 
            display: 'grid',
            gap: '16px',
            maxHeight: '400px',
            overflowY: 'auto',
            paddingRight: '8px'
          }}>
            {claimedNFTs.slice(0, 5).map((nft, index) => (
              <FloatingElement key={nft.mint} delay={index * 0.1} duration={3 + index * 0.5} distance={5}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.05)'
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <div style={{ 
                        fontWeight: 'bold', 
                        fontSize: '16px',
                        color: '#10b981',
                        marginBottom: '4px'
                      }}>
                        🎨 {nft.metadata.name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {new Date(nft.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <StatusBadge status="success">Minted</StatusBadge>
                  </div>
                  
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.4',
                    marginBottom: '12px'
                  }}>
                    <div>📍 Mint: <code>{nft.mint.slice(0, 16)}...{nft.mint.slice(-16)}</code></div>
                    <div>📦 TX: <code>{nft.transaction.slice(0, 16)}...{nft.transaction.slice(-16)}</code></div>
                    <div>💰 Gas Cost: {nft.gasCost} lamports (paid by relayer)</div>
                  </div>
                  
                  <a 
                    href={`https://explorer.solana.com/tx/${nft.transaction}?cluster=devnet`} 
                    target="_blank" 
                    style={{
                      color: '#10b981',
                      textDecoration: 'none',
                      fontSize: '12px',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#059669'
                      e.currentTarget.style.textShadow = '0 0 8px rgba(16, 185, 129, 0.5)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#10b981'
                      e.currentTarget.style.textShadow = 'none'
                    }}
                  >
                    🔗 View on Devnet Explorer
                  </a>
                </div>
              </FloatingElement>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}