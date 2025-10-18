// src/controllers/campaign-image.controller.ts
import { Response, Router } from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { ImageUploadService } from '../services/image-upload.service';

const prisma = new PrismaClient();

// Multer en memoria (luego lo guardamos en disco/IPFS/S3 desde el servicio)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const imageService = new ImageUploadService();

export class CampaignImageController {
  static router(): Router {
    const r = Router();

    // POST /api/campaigns/:campaignId/image   (field: "image")
    r.post(
      '/:campaignId/image',
      upload.single('image'),
      async (req: AuthenticatedRequest, res: Response) => {
        try {
          const organizerId = req.user?.organizerId ?? req.organizer?.id;
          if (!organizerId) {
            return res.status(401).json({ success: false, error: 'Autenticación requerida' });
          }

          const { campaignId } = req.params;

          const campaign = await prisma.campaign.findFirst({
            where: { id: campaignId, organizerId },
          });
          if (!campaign) {
            return res.status(404).json({ success: false, error: 'Campaña no encontrada' });
          }

          if (!req.file) {
            return res.status(400).json({ success: false, error: 'No se adjuntó imagen' });
          }

          const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
          if (!allowed.includes(req.file.mimetype)) {
            return res.status(400).json({ success: false, error: 'Tipo de imagen no permitido' });
          }

          // 👇 el servicio devuelve { imageUri }
          const { imageUrl } = await imageService.handle(req.file);

          const updated = await prisma.campaign.update({
            where: { id: campaignId },
            data: { imageUrl, updatedAt: new Date() },
          });

          return res.json({
            success: true,
            data: { id: updated.id, imageUrl: updated.imageUrl },
          });
        } catch (err: any) {
          console.error('Error en upload de imagen:', err);
          return res.status(400).json({
            success: false,
            error: err?.message || 'Fallo al subir imagen',
          });
        }
      }
    );

    return r;
  }
}
