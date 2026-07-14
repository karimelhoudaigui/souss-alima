# Institut Souss Alima

MVP Next.js de plateforme e-learning pour un institut d'enseignement coranique traditionnel. Le coeur métier remplace le flux Telegram manuel : disponibilités déclarées par les élèves, passages proposés par l'administration, confirmation, réalisation et suivi de progression.

## Stack

- Next.js App Router, TypeScript strict, Tailwind CSS.
- Auth.js credentials avec sessions JWT et rôles `ADMIN`, `TEACHER`, `STUDENT`.
- PostgreSQL + Prisma.
- Stockage S3 compatible via URLs signées, avec MinIO en développement.
- Emails transactionnels via SMTP/Nodemailer.
- Vitest pour les règles métier, Playwright pour les parcours critiques.

## Lancement local

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Application : `http://localhost:3000`

## Comptes de démonstration

Mot de passe commun : `SoussAlima2026!`

- Admin : `admin@souss-alima.test`
- Enseignant : `abdellah@souss-alima.test`
- Enseignante : `maryam@souss-alima.test`
- Élève : `youssef@example.test`
- Élève : `salma@example.test`

## Architecture

Le projet suit l'arborescence demandée : pages publiques, espace élève sous `/dashboard`, back-office sous `/admin`, routes API sous `/api`, modèle Prisma dans `prisma/schema.prisma`.

Décisions MVP :

- Les pages back-office exposent les listes et actions essentielles. Les CRUD complets de modules/leçons passent par API et peuvent être enrichis avec des formulaires dédiés.
- Les documents/vidéos utilisent des clés ou URLs de démonstration dans le seed. En production, `/api/upload` fournit une URL signée S3 pour envoyer les fichiers.
- La suppression RGPD est traitée par demande administrative via contact pour le MVP.
- Le fuseau métier par défaut est `Africa/Casablanca`, configurable via `APP_TIME_ZONE`.

## Flux métier principal

1. Un visiteur crée un compte depuis `/inscription`, avec une ou plusieurs inscriptions `PENDING`.
2. Un admin valide l'inscription dans `/admin/inscriptions`.
3. L'élève déclare un créneau dans `/dashboard/disponibilites`.
4. Un admin/enseignant transforme ce créneau en passage proposé depuis `/admin/disponibilites`.
5. L'élève confirme ou décline depuis `/dashboard/calendrier`.
6. L'enseignant marque le passage `DONE` depuis `/admin/calendrier`, ce qui crée un `MemorizationLog`.
7. L'élève retrouve sa progression sur `/dashboard/programmes/[slug]`.

## Commandes

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run test:e2e
npm run db:migrate
npm run db:seed
```

## Roadmap V2

- Paiement en ligne des frais de scolarité.
- Connexion via widget Telegram.
- Quiz et auto-évaluations.
- Application mobile native.
- Messagerie interne temps réel.
- Statistiques avancées et reporting.
- Interface multilingue complète.
