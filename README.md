## Fonctionnalités
- Ajout de todos (titre obligatoire, description et date optionnels)
- Modification en direct : cliquez sur un champ pour le modifier sans navigation
- Suppression : individuelle par tâche, ou groupée via le bouton "Delete All" (rouge, avec confirmation)
- Tri et filtrage des todos (par nom, date, statut)
- Persistance des données via API (les todos restent sauvegardés)
## Comment lancer le projet
### Prérequis
- Node.js installé
- pnpm (`npm install -g pnpm` si ce n'est pas fait)

### Installation
```bash
pnpm install
```

### Lancer en développement
```bash
pnpm run dev
```
L'application s'ouvre automatiquement sur `http://localhost:3000`.

### Commandes
| Commande | Description |
|-----------|-------------|
| `pnpm run build` | Compile l'appli pour la production |
| `pnpm run lint` | Vérifie la qualité du code |
| `pnpm run format` | Formate le code avec Prettier |
