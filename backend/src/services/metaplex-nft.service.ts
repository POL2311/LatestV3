// src/services/metaplex-nft.service.ts
import { Metaplex, keypairIdentity, toBigNumber } from '@metaplex-foundation/js';
import { PublicKey } from '@solana/web3.js';
import { SolanaService } from './solana.service';

/**
 * Servicio simple y robusto para mintear un NFT 1/1 y enviarlo al usuario.
 * - Usa @metaplex-foundation/js
 * - Firma con el relayer (gasless para usuario)
 */
export class MetaplexNFTService {
  private mx: Metaplex;

  constructor(private solana: SolanaService) {
    this.mx = Metaplex
      .make(this.solana.connection)
      .use(keypairIdentity(this.solana.relayer));
  }

  /**
   * Mint de NFT 1/1 y transfer directo al owner `to`.
   * @param params
   *  - to: public key del usuario (string base58)
   *  - name: nombre del NFT (ej: nombre de campaña)
   *  - symbol: opcional (default "POAP")
   *  - uri: metadata URI http/ipfs (si no pasas, usa placeholder)
   */
  async mintTo(params: {
    to: string;
    name: string;
    symbol?: string;
    uri?: string;
  }): Promise<{ mint: string; signature: string; uri: string }> {
    const owner = new PublicKey(params.to);

    // Si no tienes metadata ya “bonita”, usa un JSON estático/placeholder
    const metadataUri =
      params.uri ||
      'https://raw.githubusercontent.com/solana-developers/solana-cookbook/main/assets/nft-placeholder.json';

    const { nft, response } = await this.mx.nfts().create({
      name: params.name,
      symbol: params.symbol ?? 'POAP',
      uri: metadataUri,
      sellerFeeBasisPoints: 0,
      maxSupply: toBigNumber(1),
      tokenOwner: owner, // el NFT se envía al wallet del usuario
      isMutable: true,
    });

    return {
      mint: nft.address.toBase58(),
      signature: response.signature,
      uri: metadataUri,
    };
  }
}
