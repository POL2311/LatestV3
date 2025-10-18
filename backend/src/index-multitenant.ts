// src/index-multitenant.ts - ENHANCED VERSION WITH SYSTEM MONITORING
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path'; // ✅ nuevo

// Controllers
import { AuthController } from './controllers/auth.controller';
import { CampaignController } from './controllers/campaign.controller';
import { MultiTenantNFTController } from './controllers/multi-tenant-nft.controller';
import { NFTClaimController } from './controllers/nft-claim.controller';
import { SystemController } from './controllers/system.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { CampaignImageController } from './controllers/campaign-image.controller'; // ✅ nuevo

// Middleware
import { authenticate, authenticateApiKey } from './middleware/auth.middleware';

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));

// ✅ servir /uploads como estático (URLs públicas)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests from this IP, please try again later.' },
});
app.use('/api/', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many authentication attempts, please try again later.' },
});

// ===== INITIALIZE CONTROLLERS =====
let multiTenantNFTController: MultiTenantNFTController;
let legacyNFTController: NFTClaimController;
let analyticsController: AnalyticsController;

try {
  multiTenantNFTController = new MultiTenantNFTController();
  legacyNFTController = new NFTClaimController();
  analyticsController = new AnalyticsController();
  console.log('✅ Controllers initialized');
} catch (error) {
  console.error('❌ Error initializing controllers:', error);
  process.exit(1);
}

// ===== SYSTEM MONITORING ROUTES =====
app.get('/health', SystemController.healthCheck);
app.get('/api/system/stats', SystemController.getSystemStats);
app.get('/api/system/migration-status', SystemController.getMigrationStatus);
app.get('/api/system/test-db', SystemController.testDatabaseOperations);

// ===== AUTHENTICATION ROUTES =====
app.post('/api/auth/register', authLimiter, AuthController.register);
app.post('/api/auth/login', authLimiter, AuthController.login);
app.get('/api/auth/profile', authenticate, AuthController.getProfile);

app.post('/api/auth/api-keys', authenticate, AuthController.createApiKey);
app.get('/api/auth/api-keys', authenticate, AuthController.listApiKeys);
app.delete('/api/auth/api-keys/:keyId', authenticate, AuthController.deactivateApiKey);

// ===== CAMPAIGN MANAGEMENT ROUTES (JWT Auth) =====
app.post('/api/campaigns', authenticate, CampaignController.createCampaign);
app.get('/api/campaigns', authenticate, CampaignController.listCampaigns);
app.get('/api/campaigns/:campaignId', authenticate, CampaignController.getCampaign);
app.put('/api/campaigns/:campaignId', authenticate, CampaignController.updateCampaign);
app.delete('/api/campaigns/:campaignId', authenticate, CampaignController.deleteCampaign);
app.get('/api/campaigns/:campaignId/analytics', authenticate, CampaignController.getCampaignAnalytics);
app.get('/api/campaigns/:campaignId/claims', authenticate, CampaignController.getCampaignClaims);

// ✅ CAMPAIGN IMAGE ROUTE (JWT)
app.use('/api/campaigns', authenticate, CampaignImageController.router());

// ===== ANALYTICS ROUTES =====
app.get('/api/analytics/dashboard', authenticate, (req, res) => analyticsController.getDashboardStats(req, res));
app.get('/api/analytics/claims/daily', authenticate, (req, res) => analyticsController.getDailyClaims(req, res));
app.get('/api/analytics/trend/monthly', authenticate, (req, res) => analyticsController.getMonthlyTrend(req, res));

// ===== PUBLIC CLAIMING ROUTES =====
app.post('/api/poap/claim', CampaignController.claimPOAP); // <-- pública
app.get('/api/campaigns/:campaignId/public', multiTenantNFTController.getPublicCampaign);
app.get('/api/poap/user/:userPublicKey', multiTenantNFTController.getUserPOAPs);

// ✅ (Opcional) Fallback simple para página de claim si tu frontend ya no la sirve
app.get('/claim/:campaignId', (req, res) => {
  const { campaignId } = req.params;
  res.send(`
    <html>
      <head><title>Claim</title></head>
      <body style="font-family: sans-serif; max-width: 680px; margin: 40px auto;">
        <h1>Claim de Campaña</h1>
        <p>Campaign ID: <b>${campaignId}</b></p>
        <p>Tu frontend debería llamar <code>POST /api/poap/claim</code> con <code>userPublicKey</code> y opcional <code>secretCode</code>.</p>
      </body>
    </html>
  `);
});

// ===== RELAYER / LEGACY =====
app.get('/api/relayer/stats', multiTenantNFTController.getRelayerStats);
app.post('/api/nft/claim-magical', legacyNFTController.claimNFTMagical);
app.post('/api/nft/claim-with-signature', legacyNFTController.claimNFTWithSignature);
app.get('/api/nft/user/:userPublicKey', legacyNFTController.getUserNFTs);

// ===== DOCS =====
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Multi-Tenant Gasless infrastructure API',
    version: '2.0.0',
    description: 'SaaS platform for gasless NFT minting on Solana with secret code validation',
    baseUrl: `${req.protocol}://${req.get('host')}/api`,
    endpoints: {
      campaigns: {
        'POST /campaigns': 'Create campaign',
        'GET /campaigns': 'List campaigns',
        'GET /campaigns/:campaignId': 'Get campaign',
        'PUT /campaigns/:campaignId': 'Update campaign',
        'DELETE /campaigns/:campaignId': 'Delete campaign',
        'GET /campaigns/:campaignId/analytics': 'Campaign analytics',
        'GET /campaigns/:campaignId/claims': 'Campaign claims',
        'POST /campaigns/:campaignId/image': 'Upload campaign image', // ✅ doc
      },
      analytics: {
        'GET /analytics/dashboard': 'Dashboard analytics overview',
        'GET /analytics/claims/daily': 'Daily claims',
        'GET /analytics/trend/monthly': 'Monthly trend',
      },
      poap: {
        'POST /poap/claim': 'Public claim endpoint',
        'GET /campaigns/:campaignId/public': 'Public campaign info',
        'GET /poap/user/:userPublicKey': 'User NFTs',
      },
    },
  });
});

// ===== ERRORS =====
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ success: false, error: 'Internal server error', timestamp: new Date().toISOString() });
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: ['GET /health', 'GET /api/docs', 'POST /api/poap/claim'],
  });
});

// ===== START =====
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log('🚀 MULTI-TENANT Gasless infrastructure STARTED');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
});
