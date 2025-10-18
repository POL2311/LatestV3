// src/services/image-upload.service.ts
import { StorageService } from './storage.service';
import { ImageValidationService } from './image-validation.service';

export class ImageUploadService {
  private storage: StorageService;

  constructor() {
    this.storage = new StorageService();
  }

  async handle(file: Express.Multer.File): Promise<{ imageUrl: string }> {
    if (!file) {
      throw new Error('No se recibió el archivo de imagen.');
    }
    ImageValidationService.validate(file.mimetype, file.size);

    const stored = await this.storage.saveBuffer(file.buffer, file.originalname);
    return { imageUrl: stored.uri };
  }
}
