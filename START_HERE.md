# Atlas Delta - Guide de démarrage

## 🚀 Lancer l'application en local

### Option 1 : Démarrer tout (recommandé)

```bash
cd atlas-delta-master
pnpm install
pnpm dev
```

Cela démarre à la fois l'API (port 8094) et le frontend (port 3000).

### Option 2 : Démarrer séparément

**Terminal 1 - API :**
```bash
cd atlas-delta-master
pnpm dev:api
```

**Terminal 2 - Frontend :**
```bash
cd atlas-delta-master
pnpm dev:web
```

### Accéder à l'application

Une fois les serveurs démarrés :

- **Frontend** : http://localhost:3000
- **API** : http://localhost:8100/api/v1
- **Documentation API** : Voir README.md pour les endpoints

## ✨ Nouvelles fonctionnalités ajoutées

### Interface moderne
- 🎨 **Tailwind CSS** : Design system complet avec variables CSS
- 🌓 **Thème sombre/clair** : Toggle dans la sidebar
- 🔔 **Notifications Toast** : Feedback visuel pour les actions
- 📊 **Graphiques interactifs** : Dashboard avec Recharts (Pie + Area charts)
- 📱 **Responsive** : Adaptation mobile et tablette

### Améliorations Dashboard
- Cartes statistiques animées avec tendances
- Graphique de répartition des statuts de datasets
- Graphique d'activité hebdomadaire
- Liste des alertes récentes
- Liste des datasets récents

### Gestion des Datasets
- Création/édition via modale moderne
- Vue détaillée avec snapshots
- Pagination et filtres (recherche, statut)
- Actions rapides (voir, éditer, snapshot, supprimer)
- Badges de fraîcheur avec icônes

### Expérience utilisateur
- Animations de transition fluides (fade-in, slide-up)
- Effets hover sur les cartes et tableaux
- Indicateurs de chargement (spinner)
- États vides illustrés
- Icônes Lucide React cohérentes

## 📦 Scripts utiles

```bash
# Développement
pnpm dev              # Tous les services
pnpm dev:web          # Frontend seulement
pnpm dev:api          # API seulement

# Qualité du code
pnpm lint             # Linter
pnpm lint:fix         # Linter + auto-fix
pnpm typecheck        # Vérification TypeScript
pnpm test             # Tests

# Base de données
pnpm db:generate      # Générer client Prisma
pnpm db:push          # Appliquer schéma
pnpm db:studio        # Ouvrir Prisma Studio

# Build
pnpm build            # Build tous les packages
```

## 🔧 Configuration

### Variables d'environnement

**API (.env) :**
```
PORT=8094
NODE_ENV=development
DATABASE_URL=file:./data/atlas-delta.db
LOG_LEVEL=debug
CORS_ORIGINS=*
```

**Frontend (.env.local) :**
```
VITE_API_URL=http://localhost:8100/api/v1
```

## 🎨 Palette de couleurs

- **Primary** : `#3b82f6` (bleu)
- **Success** : `#22c55e` (émeraude)
- **Warning** : `#f59e0b` (ambre)
- **Danger** : `#ef4444` (rouge)
- **Dark** : Palette de gris sombre

## 📁 Structure du projet

```
atlas-delta/
├── apps/
│   ├── api/          # Express.js REST API (port 8094)
│   └── web/          # React dashboard (port 3000)
├── packages/
│   ├── core/         # Utilitaires partagés
│   └── models/       # Modèles et types
└── docs/             # Documentation
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir CONTRIBUTING.md.

## 📄 Licence

Apache License 2.0 - voir LICENSE

---

**Made with ❤️ by the Atlas Delta Team**
