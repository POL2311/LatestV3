import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, Express as ExpressNS } from 'express';
import { PrismaClient } from '@prisma/client';
import type { Multer } from 'multer';            // 👈 importa el tipo de Multer

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    organizerId: string;
    role: string;
  };
  organizer?: {
    id: string;
    email: string;
    tier: string;
    name: string;
  };
  apiKey?: {
    id: string;
    organizerId: string;
    name: string;
  };
  // ✅ soporte Multer (sin namespaces)
  file?: Express.Multer.File;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

// JWT Authentication (for dashboard/organizer operations)
export const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, error: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    const organizer = await prisma.organizer.findUnique({ where: { id: decoded.organizerId } });
    if (!organizer || !organizer.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid or inactive organizer' });
    }

    req.organizer = {
      id: organizer.id,
      email: organizer.email,
      tier: organizer.tier,
      name: organizer.name
    };

    req.user = {
      id: organizer.id,
      email: organizer.email,
      role: 'admin',
      organizerId: organizer.id,
    };

    next();
  } catch {
    return res.status(403).json({ success: false, error: 'Invalid token' });
  }
};

// API Key Authentication (for POAP claiming operations)
export const authenticateApiKey = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const apiKey = authHeader && authHeader.startsWith('ApiKey ')
    ? authHeader.substring(7)
    : null;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required. Use header: Authorization: ApiKey <your-key>'
    });
  }

  try {
    const keyRecord = await prisma.apiKey.findFirst({
      where: { key: apiKey, isActive: true },
      include: { organizer: true }
    });

    if (!keyRecord || !keyRecord.organizer.isActive) {
      return res.status(401).json({ success: false, error: 'Invalid or inactive API key' });
    }

    await prisma.apiKey.update({ where: { id: keyRecord.id }, data: { lastUsedAt: new Date() } });

    req.apiKey = { id: keyRecord.id, organizerId: keyRecord.organizerId, name: keyRecord.name };
    req.organizer = {
      id: keyRecord.organizer.id,
      email: keyRecord.organizer.email,
      tier: keyRecord.organizer.tier,
      name: keyRecord.organizer.name
    };

    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    return res.status(500).json({ success: false, error: 'Authentication error' });
  }
};

export const authenticateToken = authenticate;

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: 'Insufficient permissions' });
    }
    next();
  };
};

export const requireOrganization = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.organizer) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    const organizer = await prisma.organizer.findUnique({ where: { id: req.organizer.id } });
    if (!organizer || !organizer.isActive) {
      return res.status(403).json({ success: false, error: 'Organizer not found or inactive' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Database error' });
  }
};
