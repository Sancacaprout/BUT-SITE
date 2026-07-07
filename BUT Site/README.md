# BUT Info Starter

Plateforme d'apprentissage interactive pour transformer le PDF "Programme d'apprentissage BUT Info" en vraie expérience de préparation à la semaine de lancement du BUT Informatique.

## Objectif

L'application aide un débutant à apprendre progressivement :

- cours courts le matin ;
- exercices avec indices progressifs ;
- réponses personnelles sauvegardées ;
- corrections masquées et séparées ;
- quiz interactifs ;
- mini-projet "Boîte à outils étudiant" ;
- checkpoint final ;
- fiches, recherche, ressources et mode révision.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React
- Zod
- Supabase JS, optionnel pour une future persistance cloud
- Vercel-ready

## Installation locale

```bash
pnpm install
pnpm dev
```

Puis ouvrir `http://localhost:3000`.

Commandes utiles :

```bash
pnpm lint
pnpm build
```

## Configuration Supabase

L'application fonctionne sans Supabase grâce au localStorage. Pour préparer la persistance cloud :

1. Créer un projet Supabase.
2. Exécuter `supabase/schema.sql` dans l'éditeur SQL Supabase.
3. Copier `.env.example` en `.env.local`.
4. Renseigner :

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Ne jamais exposer de service role key côté client.

## Sécurité

- RLS est activé sur `profiles`, `progress`, `quiz_attempts`, `notes`, `settings`.
- Les policies limitent lecture, écriture, mise à jour et suppression aux données de l'utilisateur connecté.
- Le client n'utilise que les variables publiques Supabase.
- Le site ne dépend pas d'une connexion Supabase obligatoire.
- Le contenu pédagogique est typé en TypeScript, pas injecté comme HTML arbitraire.

## Structure du contenu

Le contenu principal se trouve dans :

- `src/content/week-1.ts` : semaine, jours, cours, exercices, quiz, corrections, fiches, checkpoint.
- `src/content/glossary.ts` : notions recherchables.
- `src/content/resources.ts` : liens externes utiles.

Les corrections sont liées par `correctionId` et affichées uniquement dans `/corrections`.

## Ajouter une semaine 2

1. Créer `src/content/week-2.ts` avec les mêmes types que `week-1.ts`.
2. Ajouter les jours et corrections séparées.
3. Étendre les helpers dans `src/lib/content.ts`.
4. Ajouter `generateStaticParams` pour les nouvelles routes.
5. Ajouter les fiches ou cartes de révision associées.

## Déploiement Vercel

1. Pousser le projet sur GitHub.
2. Importer le dépôt dans Vercel.
3. Ajouter les variables Supabase si utilisées.
4. Lancer le déploiement.

Le build local validé est :

```bash
pnpm build
```

## Roadmap

V1 :

- semaine 1 complète ;
- progression locale ;
- exercices, indices, corrections, quiz ;
- mini-projet et checkpoint ;
- design responsive.

V2 :

- Supabase Auth ;
- progression cloud ;
- notes personnelles synchronisées ;
- dashboard avancé.

V3 :

- semaines 2 à 8 ;
- recherche globale enrichie ;
- statistiques par compétence ;
- erreurs fréquentes consolidées.

V4 :

- mini IDE ou zone d'exécution encadrée ;
- correction semi-automatique ;
- sandbox Python externe.

## Limites actuelles

- Supabase est prêt côté schéma et client, mais la synchronisation cloud n'est pas encore branchée aux actions locales.
- Le mode révision est volontairement simple.
- Les exercices Python ne sont pas exécutés dans le navigateur.
