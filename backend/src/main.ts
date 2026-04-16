import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as compression from 'compression';
import helmet from 'helmet';
import * as express from 'express';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:5173');

  // ── Sécurité ───────────────────────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(compression());

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: [frontendUrl, `http://localhost:${port}`, 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    credentials: true,
  });

  // ── Dossier uploads (créé si nécessaire) ─────────────────────────────────
  const uploadsDir = join(process.cwd(), 'uploads');
  mkdirSync(uploadsDir, { recursive: true });

  // ── Fichiers statiques (avant le préfixe API) ──────────────────────────────
  const httpAdapter = app.getHttpAdapter();
  const expressApp = httpAdapter.getInstance() as express.Application;

  // ── Limites de payload pour images 3D (configurer AVANT les routes) ─────────
  expressApp.use(express.json({ limit: '50mb' }));
  expressApp.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Fichiers uploadés (images logements)
  expressApp.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));

  // Landing page au root
  const publicDir = join(__dirname, '..', 'public');
  expressApp.use(
    express.static(publicDir, {
      index: 'index.html',
      maxAge: '1d',
    }),
  );

  // React Admin — SPA fallback pour les routes client-side (/admin/logements, /admin/login…)
  // Les fichiers statiques (JS/CSS/assets) sont servis par express.static(publicDir) ci-dessus
  // car le build Vite écrit directement dans backend/public/admin/
  expressApp.get('/admin/*', (_req, res) =>
    res.sendFile(join(publicDir, 'admin', 'index.html')),
  );

  // ── Préfixe API ─────────────────────────────────────────────────────────────
  app.setGlobalPrefix('api');

  // ── Validation globale ─────────────────────────────────────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // ── Swagger ─────────────────────────────────────────────────────────────────
  const swaggerConfig = new DocumentBuilder()
    .setTitle('KaayDeuk API')
    .setDescription('API REST — Plateforme immobilière KaayDeuk · Thiès, Sénégal')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .addTag('auth', 'Authentification admin')
    .addTag('logements', 'CRUD Logements')
    .addTag('uploads', 'Upload images')
    .addTag('admins', 'Gestion des admins')
    .addTag('reservations', 'Gestion des réservations')
    .addTag('utilisateurs', 'Gestion des utilisateurs')
    .addTag('paiements', 'Gestion des paiements')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(port);

  Logger.log(`\n══════════════════════════════════════`, 'KaayDeuk');
  Logger.log(`🚀 Serveur   : http://localhost:${port}`, 'KaayDeuk');
  Logger.log(`🏠 Landing   : http://localhost:${port}`, 'KaayDeuk');
  Logger.log(`⚙️  Admin     : http://localhost:${port}/admin`, 'KaayDeuk');
  Logger.log(`📡 API       : http://localhost:${port}/api`, 'KaayDeuk');
  Logger.log(`📖 Swagger   : http://localhost:${port}/api/docs`, 'KaayDeuk');
  Logger.log(`══════════════════════════════════════\n`, 'KaayDeuk');
}

bootstrap();
