# Architecture de Données & Persistance Locale

Ce document explique comment **Acquisition Framework OS** stocke, structure et gère les données de l'utilisateur sans Backend (Serverless / Local-First).

## 1. Philosophie "Local-First"

L'application fonctionne entièrement dans le navigateur du client. Aucune donnée n'est envoyée à un serveur externe. Cela garantit :
1.  **Confidentialité totale** : Les stratégies business restent sur la machine du client.
2.  **Vitesse** : Pas de temps de chargement réseau.
3.  **Portabilité** : Le dossier complet peut être zippé et envoyé.

## 2. Structure de la Base de Données (JSON)

Toutes les données sont centralisées dans un objet unique `ClientData` (défini dans `types.ts`).

### Schéma JSON

```json
{
  "clientName": "String - Nom du projet",
  "clientDomain": "String - URL racine",
  "identity": {
    "version": "String - V1, V2...",
    "mission": "String - Le Pourquoi",
    "targetAudienceSummary": "String - Résumé court",
    "selectedDomainPrefix": "String - go, get, start..."
  },
  "unlockedPhases": ["Array of Strings - IDs des modules débloqués"],
  "activePhaseId": "String - Module en cours",
  "completedItems": [
    "String - Format: {phaseId}-{strategyId}", 
    "String - Format: {phaseId}-{subModuleId}-{taskId}"
  ],
  "userInputs": {
    "offre-avatar-def-persona-1": "String (Markdown/Text) - Contenu saisi par l'utilisateur",
    "offre-market-research-competitors": "String..."
  },
  "branding": [
    {
      "id": "String - Timestamp",
      "name": "String",
      "value": "String (Hex, URL, Font)",
      "type": "color | link | text"
    }
  ]
}
```

## 3. Persistance (LocalStorage)

Le service `services/storage.ts` gère la synchronisation.

*   **Clé de stockage** : `acquisition_framework_os_v2`
*   **Lecture** : Au chargement de l'app (`App.tsx`), on lit le localStorage. Si vide, on charge `DEFAULT_CLIENT_DATA`.
*   **Écriture** : À chaque modification (Input, Checkbox, Settings), l'état React est mis à jour ET sauvegardé instantanément dans le localStorage via `JSON.stringify()`.

## 4. Sauvegarde & Export (Futur)

Pour permettre au client de "Sauvegarder" son travail physiquement ou de le transférer :
1.  Créer une fonction qui dump le `localStorage` dans un fichier `.json`.
2.  Créer une fonction d'import qui lit un fichier `.json` et remplace le `localStorage`.

## 5. Structuration des Inputs

L'élément clé est l'objet `userInputs`.
Contrairement à une base de données relationnelle classique, nous utilisons un stockage Clé-Valeur pour les réponses aux tâches.
*   **Clé** : ID unique composé (`phase-submodule-task`).
*   **Valeur** : Texte riche (l'utilisateur est guidé par des placeholders pour structurer ce texte).

Cela permet une flexibilité totale : si nous changeons le Framework demain, la structure de données n'a pas besoin de migration complexe, seules les clés changent.
