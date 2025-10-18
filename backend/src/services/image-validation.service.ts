// src/services/image-validation.service.ts
export class ImageValidationService {
  static validate(mime: string, size: number) {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    const max = 5 * 1024 * 1024; // 5MB
    if (!allowed.includes(mime)) throw new Error('Tipo de imagen no permitido');
    if (size > max) throw new Error('La imagen excede el tamaño máximo');
  }
}


