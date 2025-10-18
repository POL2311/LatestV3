// src/services/solana.service.ts
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';

// Opcional/Anchor: solo si usas tu programa (no interfiere con minting)
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import idl from '../idl/gasless_infrastructure.json';
import type { GaslessInfrastructure } from '../types/anchor-types';

export class SolanaService {
  public connection: Connection;
  public relayer: Keypair;

  // Opcional/Anchor
  public program?: Program<GaslessInfrastructure>;
  public programId?: PublicKey;
  public provider?: AnchorProvider;

  constructor() {
    const rpc = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet');
    this.connection = new Connection(rpc, { commitment: 'confirmed' });

    const relayerSecret = process.env.RELAYER_SECRET_KEY;
    if (!relayerSecret) {
      throw new Error('RELAYER_SECRET_KEY no está definido en .env (en base58)');
    }
    this.relayer = Keypair.fromSecretKey(bs58.decode(relayerSecret));

    console.log('🌐 Connected to:', rpc);
    console.log('⚡ Relayer loaded:', this.relayer.publicKey.toBase58());

    // Inicializa Anchor solo si hay PROGRAM_ID (no es necesario para mintear NFTs)
    const maybeProgramId = process.env.PROGRAM_ID;
    if (maybeProgramId) {
      try {
        this.programId = new PublicKey(maybeProgramId);
        // Wallet “dummy” para lecturas; el relayer se usa para firmar cuando proceda
        const dummy = Keypair.generate();
        const wallet = new Wallet(dummy);
        this.provider = new AnchorProvider(this.connection, wallet, { commitment: 'confirmed' });
        this.program = new Program(idl as any, this.programId, this.provider);
      } catch (e) {
        console.warn('⚠️ Anchor/PROGRAM_ID no inicializado:', e);
      }
    }
  }
}
