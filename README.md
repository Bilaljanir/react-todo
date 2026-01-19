# Architecture des Composants


## Conteneur Principal

        TodoList -->|Affiche Erreurs| ErrorNotification ErrorNotification.tsx
        TodoList -->|Crée Tâches| TodoForm[TodoForm.tsx
        TodoList -->|Contrôle Vue| TodoFilters TodoFilters.tsx
        TodoList -->|Itère Liste| TodoItem TodoItem.tsx

## Détails de la Tâche

        TodoItem -->|Édition Titre| EditableField[EditableField.tsx
        TodoItem -->|Édition Contenu| EditableField
        TodoItem -->|Édition Date| EditableField

App : Le point d'entrée qui contient la structure globale.

TodoList : Le composant qui se connecte au store, gère la logique de tri/filtre et orchestre l'affichage.

TodoItem : Un composant représentant une tâche unique.

EditableField : Un composant utilitaire qui bascule entre un affichage texte et un champ de saisie (input/textarea).

### Installation
        npm install

### Lancer l'app
        npm run dev

### Construire pour la prod

        npm run build
