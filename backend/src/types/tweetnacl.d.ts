declare module 'tweetnacl' {
  // Tipado mínimo que necesitamos
  namespace nacl {
    namespace sign {
      namespace detached {
        function verify(
          message: Uint8Array,
          sig: Uint8Array,
          publicKey: Uint8Array
        ): boolean;
      }
    }
  }
  const nacl: typeof import('tweetnacl'); // fallback
  export = nacl;
}
