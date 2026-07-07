# BUT Info Starter

Plateforme d'apprentissage interactive pour transformer le programme BUT Informatique en vraie experience de preparation.

## Ce que fait le site

- cours courts organises par jour ;
- exercices avec indices progressifs ;
- notes personnelles sauvegardees ;
- corrections separees pour eviter de les voir trop tot ;
- quiz interactifs ;
- mini-projet "Boite a outils etudiant" ;
- checkpoint final ;
- fiches, recherche, ressources et mode revision ;
- progression locale, puis synchronisation Supabase quand la configuration est complete.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React
- Zod
- Supabase JS
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

L'application fonctionne sans Supabase grace au localStorage. Quand Supabase est configure, elle cree une session anonyme et synchronise la progression dans la table `learning_state`.

1. Creer un projet Supabase.
2. Activer les connexions anonymes dans Supabase Auth si elles ne le sont pas deja.
3. Executer `supabase/schema.sql` dans l'editeur SQL Supabase.
4. Copier `.env.example` en `.env.local`.
5. Renseigner :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` reste supporte pour les anciens projets Supabase.

Ne jamais exposer de `service_role` key cote client.

## Securite

- RLS est active sur les tables Supabase.
- Les policies limitent lecture, ecriture, mise a jour et suppression aux donnees de l'utilisateur connecte.
- Le client n'utilise que les variables publiques Supabase.
- Le site ne depend pas d'une connexion Supabase obligatoire.
- Le contenu pedagogique est type en TypeScript, pas injecte comme HTML arbitraire.

## Structure du contenu

- `src/content/week-1.ts` : semaine, jours, cours, exercices, quiz, corrections, fiches, checkpoint.
- `src/content/glossary.ts` : notions recherchables.
- `src/content/resources.ts` : liens externes utiles.

Les corrections sont liees par `correctionId` et affichees uniquement dans `/corrections`.

## Deploiement Vercel

1. Pousser le projet sur GitHub.
2. Importer le depot dans Vercel.
3. Ajouter les variables Supabase dans Vercel si la synchronisation cloud doit etre activee.
4. Lancer le deploiement.

Le build local valide est :

```bash
pnpm build
```

## Roadmap

V1 :

- semaine 1 complete ;
- progression locale et synchronisation Supabase optionnelle ;
- exercices, indices, corrections, quiz ;
- mini-projet et checkpoint ;
- design responsive.

V2 :

- compte utilisateur explicite ;
- dashboard avance ;
- semaines 2 a 8 ;
- statistiques par competence.

V3 :

- mini IDE ou zone d'execution encadree ;
- correction semi-automatique ;
- sandbox Python externe.
