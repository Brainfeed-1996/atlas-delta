# Atlas Delta - Démarrage rapide

## Lancement en une commande

Ouvrez PowerShell dans ce dossier et exécutez :

```powershell
.\start-servers.ps1
```

Cela ouvrira **deux fenêtres** :
- API sur http://localhost:8100
- Frontend sur http://localhost:3000

## Ou lancement manuel

**Terminal 1 (API) :**
```powershell
pnpm dev:api
```

**Terminal 2 (Frontend) :**
```powershell
pnpm dev:web
```

## Arrêt

Fermez les fenêtres PowerShell ou appuyez sur `Ctrl+C` dans chaque terminal.
