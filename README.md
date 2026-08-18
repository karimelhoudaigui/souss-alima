# Souss Alima

Plateforme documentaire Next.js consacree aux madrassas, savants et publications editoriales autour du patrimoine scientifique traditionnel du Souss.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS.
- Supabase Postgres pour les madrassas, savants, themes et articles.
- Row Level Security activee : lecture publique, ecriture reservee au serveur.
- Espace moderateur sous `/moderateur` pour publier madrassas, articles et savants.
- Carte interactive MapLibre sur `/madrassas`.

## Configuration

Copier l'exemple puis renseigner les variables :

```bash
cp .env.example .env
```

Variables principales :

```bash
NEXT_PUBLIC_SUPABASE_URL="https://ptdxwxmrfdupmdgvdnyh.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."
MODERATOR_KEY="..."
```

`NEXT_PUBLIC_SUPABASE_*` sert aux lectures publiques. `SUPABASE_SERVICE_ROLE_KEY` doit rester cote serveur uniquement et permet aux routes `/api/moderateur/*` d'ecrire dans Supabase. `MODERATOR_KEY` est le code demande dans l'interface moderateur.

## Lancement Local

```bash
npm install
npm run dev
```

Application : `http://localhost:3000`

## Commandes

```bash
npm run lint
npm run build
npm run dev
```

## Donnees

Supabase contient actuellement :

- 5 madrassas sourcees.
- 1 fiche savant sourcee.
- 8 themes editoriaux.
- 0 article publie.

Le fichier `data/content-store.json` reste un fallback local et sert aussi au build statique GitHub Pages. Pour une version totalement dynamique avec publication immediate, deployer sur un hebergement serveur Next.js avec les variables Supabase configurees.
