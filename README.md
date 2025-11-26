# 📋 Todo App - Application de Gestion de Tâches

Une application web moderne de gestion de tâches et de personnes, développée avec Angular 15, Material Design et Tailwind CSS.

![Angular](https://img.shields.io/badge/Angular-15-red)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue)
![Material](https://img.shields.io/badge/Material-15-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-cyan)

## Fonctionnalités

### Gestion des Tâches
- Créer, modifier et supprimer des tâches
- Assigner des tâches à des personnes
- Définir la priorité (Facile, Moyen, Difficile)
- Ajouter plusieurs labels (HTML, CSS, Node.js, jQuery)
- Dates de début et de fin
- Marquer une tâche comme terminée
- Filtrer par priorité et labels
- Pagination automatique

### Gestion des Personnes
- Créer, modifier et supprimer des personnes
- Validation des données (nom unique, email valide)
- Filtrer par nom et email
- Pagination automatique

### Internationalisation
- Support Français et Anglais
- Changement de langue en temps réel
- Traduction complète de l'interface

### Export de Données
- Export Excel (.xlsx)
- Export PDF
- Export des données filtrées

## Technologies Utilisées

- **Framework** : Angular 15
- **Langage** : TypeScript
- **UI Components** : Angular Material 15
- **CSS Framework** : Tailwind CSS 3
- **Tables** : ng2-smart-table
- **Internationalisation** : Transloco
- **Export Excel** : xlsx
- **Export PDF** : jsPDF + jspdf-autotable
- **Mock API** : json-server

## Prérequis

- Node.js (version 16 ou supérieure)
- npm (version 8 ou supérieure)
- Angular CLI 15

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/cheikh785/todo-app.git
cd todo-app
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Lancer l'API Mock (json-server)

Dans un premier terminal :
```bash
npm run json-server
```

L'API sera disponible sur `http://localhost:3000`

### 4. Lancer l'application Angular

Dans un second terminal :
```bash
npm start
```

L'application sera disponible sur `http://localhost:4200`

---

## Auteur

**Cheikh Oumar Ba**

- GitHub: [@cheikh785](https://github.com/cheikh785)
