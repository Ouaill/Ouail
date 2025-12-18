# 🐦 Flappy Bird - 5 Niveaux

Un jeu Flappy Bird complet et interactif avec 5 niveaux de difficulté croissante, construit avec React et Tailwind CSS.

## 🎮 Fonctionnalités

- **5 Niveaux de Difficulté** : Du Tutoriel au niveau Maître
- **Système de Progression** : Débloquez les niveaux en atteignant les objectifs
- **Physique Réaliste** : Gravité, vélocité et collisions précises
- **Design Unique par Niveau** : Chaque niveau a son propre thème visuel
- **Contrôles Multiples** : Compatible AZERTY et QWERTY
- **Score et Records** : Système de points avec multiplicateurs par niveau

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/Ouaill/Ouail.git
cd Ouail

# Installer les dépendances
npm install

# Lancer le jeu en mode développement
npm run dev
```

Le jeu sera disponible sur `http://localhost:5173`

## 🎯 Les 5 Niveaux

1. **Tutoriel - Découverte** : Vitesse lente, gaps larges (5 obstacles)
2. **Échauffement** : Vitesse moyenne, gaps standards (10 obstacles)
3. **Challenge** : Vitesse rapide, gaps réduits (15 obstacles)
4. **Expert** : Vitesse très rapide, gaps serrés (20 obstacles)
5. **Maître** : Vitesse maximale, gaps minimaux (25 obstacles)

## ⌨️ Contrôles

### Sauter
- **Barre ESPACE**
- **Flèche HAUT (↑)**
- **Touche W** (QWERTY)
- **Touche Z** (AZERTY)
- **ENTRÉE**
- **Clic Souris**

### Autres Commandes
- **ÉCHAP / P** : Pause / Reprendre
- **R** : Recommencer le niveau en cours

## 🏗️ Technologies Utilisées

- **React 18** : Framework UI
- **Vite** : Build tool ultra-rapide
- **Tailwind CSS** : Styling utilitaire
- **requestAnimationFrame** : Game loop à 60 FPS

## 📦 Build Production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

## 🎨 Architecture du Jeu

### États du Jeu
- `MENU` : Écran d'accueil
- `PLAYING` : Jeu en cours
- `LEVEL_COMPLETE` : Transition entre niveaux avec compte à rebours
- `GAME_OVER` : Écran de défaite
- `VICTORY` : Victoire après avoir complété les 5 niveaux
- `PAUSED` : Jeu en pause

### Physique
- Gravité constante appliquée au personnage
- Impulsion vers le haut lors du saut
- Vélocité avec accélération progressive
- Paramètres ajustables par niveau

### Système de Collision
- Détection précise avec hitbox tolérante (80% du sprite)
- Collision avec obstacles, sol et plafond
- Game Over immédiat lors d'une collision

## 🏆 Système de Score

- **Points par obstacle franchi** : Variable selon le niveau
- **Multiplicateurs** :
  - Niveau 1 : x1
  - Niveau 2 : x1.5
  - Niveau 3 : x2
  - Niveau 4 : x2.5
  - Niveau 5 : x3
- **Record personnel** : Sauvegardé pendant la session

## 🎯 Objectifs par Niveau

Chaque niveau a un objectif d'obstacles à franchir pour passer au suivant :
- Niveau 1 : 5 obstacles
- Niveau 2 : 10 obstacles
- Niveau 3 : 15 obstacles
- Niveau 4 : 20 obstacles
- Niveau 5 : 25 obstacles

## 📱 Compatibilité

- **Desktop uniquement** : Optimisé pour les navigateurs desktop
- **Claviers supportés** : AZERTY et QWERTY
- **Navigateurs modernes** : Chrome, Firefox, Safari, Edge

## 🛠️ Développement

```bash
# Mode développement avec hot reload
npm run dev

# Build de production
npm run build

# Preview du build de production
npm run preview
```

## 📄 Licence

Ce projet est open source et disponible sous licence MIT.

## 👨‍💻 Auteur

**Ouaill** - Développeur de jeux frontend

---

**Bon jeu ! 🎮**
