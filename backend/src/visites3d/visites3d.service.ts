import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class Visites3DService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Vérifie si l'utilisateur peut accéder à une visite 3D
   * La première visite est gratuite, les suivantes nécessitent un abonnement
   */
  async verifierAccesVisite3D(chercheurId: number) {
    // Compter le nombre de visites 3D effectuées par le chercheur
    const nombreVisites = await this.prisma.visite3D.count({
      where: { chercheurId },
    });

    // La première visite est gratuite
    if (nombreVisites === 0) {
      return {
        acces: true,
        gratuit: true,
        nombreVisitesEffectuees: 0,
        message: 'Première visite 3D gratuite',
      };
    }

    // Vérifier si l'utilisateur a un abonnement actif
    // Pour l'instant, on vérifie s'il est locataire (a un contrat)
    const chercheur = await this.prisma.chercheur.findUnique({
      where: { id: chercheurId },
      include: {
        locataire: true,
      },
    });

    if (!chercheur) {
      throw new NotFoundException('Chercheur introuvable');
    }

    const aAbonnement = chercheur.locataire !== null;

    return {
      acces: aAbonnement,
      gratuit: false,
      nombreVisitesEffectuees: nombreVisites,
      message: aAbonnement
        ? 'Accès autorisé avec abonnement'
        : 'Abonnement requis pour continuer les visites 3D',
    };
  }

  /**
   * Enregistre une nouvelle visite 3D
   */
  async enregistrerVisite3D(chercheurId: number, logementId: number, dureeVisite: number = 0) {
    // Vérifier que le logement existe
    const logement = await this.prisma.logement.findUnique({
      where: { id: logementId },
    });

    if (!logement) {
      throw new NotFoundException('Logement introuvable');
    }

    // Vérifier que le chercheur existe
    const chercheur = await this.prisma.chercheur.findUnique({
      where: { id: chercheurId },
    });

    if (!chercheur) {
      throw new NotFoundException('Chercheur introuvable');
    }

    // Vérifier l'accès avant d'enregistrer
    const verification = await this.verifierAccesVisite3D(chercheurId);

    if (!verification.acces) {
      throw new ForbiddenException(verification.message);
    }

    // Enregistrer la visite
    const visite = await this.prisma.visite3D.create({
      data: {
        chercheurId,
        logementId,
        dureeVisite,
      },
    });

    // Recalculer la vérification APRÈS création pour avoir les données à jour
    const verificationAfter = await this.verifierAccesVisite3D(chercheurId);

    return {
      visite,
      ...verificationAfter,
    };
  }

  /**
   * Récupère l'historique des visites 3D d'un chercheur
   */
  async getHistoriqueVisites(chercheurId: number) {
    const visites = await this.prisma.visite3D.findMany({
      where: { chercheurId },
      include: {
        logement: {
          select: {
            id: true,
            titre: true,
            ville: true,
            prix: true,
            images: true,
          },
        },
      },
      orderBy: {
        dateVisite: 'desc',
      },
    });

    const nombreVisites = visites.length;
    const verification = await this.verifierAccesVisite3D(chercheurId);

    return {
      visites,
      nombreVisites,
      ...verification,
    };
  }

  /**
   * Récupère toutes les visites 3D (pour l'admin)
   */
  async getAllVisites3D(skip: number = 0, take: number = 50) {
    const [visites, total] = await Promise.all([
      this.prisma.visite3D.findMany({
        skip,
        take,
        include: {
          chercheur: {
            include: {
              utilisateur: {
                select: {
                  nom: true,
                  email: true,
                },
              },
            },
          },
          logement: {
            select: {
              id: true,
              titre: true,
              ville: true,
              prix: true,
            },
          },
        },
        orderBy: {
          dateVisite: 'desc',
        },
      }),
      this.prisma.visite3D.count(),
    ]);

    return {
      data: visites,
      total,
    };
  }
}
