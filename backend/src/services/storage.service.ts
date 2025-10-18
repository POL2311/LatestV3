// src/services/storage.service.ts
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export class StorageService {
  private baseDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.baseDir)) fs.mkdirSync(this.baseDir, { recursive: true });
  }

  async saveBuffer(buf: Buffer, originalName: string): Promise<{ uri: string; path: string }> {
    const ext = path.extname(originalName) || '.png';
    const name = crypto.randomBytes(8).toString('hex') + ext;
    const full = path.join(this.baseDir, name);
    await fs.promises.writeFile(full, buf);
    // Lo servimos estático con app.use('/uploads', express.static(...))
    return { uri: `/uploads/${name}`, path: full };
  }
}
