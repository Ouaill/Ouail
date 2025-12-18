# 🎮 Le Donjon des Ténèbres - RPG Tour par Tour

Un jeu RPG complet développé en React avec Tailwind CSS dans un fichier unique HTML.

## 🎯 Comment Jouer

1. Ouvrir le fichier `dungeon-rpg.html` dans un navigateur web (Chrome, Firefox, Safari, etc.)
2. Cliquer sur "Nouvelle Partie" pour commencer l'aventure
3. Utiliser les boutons pour explorer, combattre, et gérer ton inventaire

## 📖 Concept du Jeu

Tu incarnes un héros solitaire qui s'enfonce dans les profondeurs d'un donjon maudit. À travers 5 étages de plus en plus dangereux, tu devras combattre des monstres, gagner en puissance, et affronter les gardiens de chaque niveau pour finalement vaincre le Seigneur des Ténèbres.

## 🎮 Fonctionnalités Complètes

### ⚔️ Système de Combat Tour par Tour
- Combat stratégique avec choix d'actions
- 9 compétences débloquées progressivement (niveau 1 à 10)
- Système de dégâts physiques et magiques
- Critiques (10% + bonus), esquive, drain de vie
- Boss avec capacités spéciales uniques

### 📊 Progression du Personnage
- Système de niveau avec montée de stats
- +15 HP, +5 MP, +3 ATK, +2 DEF, +2 MAG, +1 SPD par niveau
- XP requis augmente exponentiellement
- Déblocage de nouvelles compétences

### 🎒 Inventaire & Équipements
- **10 objets consommables** : Potions (4 types), Éthers (3 types), Élixir, Antidote, Plume de Phénix
- **6 armes** : De l'épée de bois à Excalibur
- **5 armures** : Des habits de voyage à l'armure légendaire
- **6 accessoires** : Anneaux, amulettes, bottes, talismans...

### 🏰 5 Étages de Donjon
1. **Cavernes Sombres** (Niv. 1-2) - Slimes, gobelins, chauves-souris
2. **Cryptes Maudites** (Niv. 3-4) - Squelettes, fantômes, zombies
3. **Égouts Infernaux** (Niv. 5-6) - Rats géants, vases toxiques, crocodiles
4. **Salles de Torture** (Niv. 7-8) - Armures maudites, bourreaux, spectres
5. **Salle du Trône** (Niv. 9-10) - Gardes d'élite, mages noirs, chevaliers de la mort

### 👹 20+ Ennemis Uniques
- 3 types d'ennemis par étage
- 5 boss avec capacités spéciales :
  - **Roi Gobelin** - Boss d'introduction
  - **Nécromancien** - Invoque des squelettes
  - **Hydre des Égouts** - Attaque 2 fois par tour
  - **Tortionnaire** - Boss puissant
  - **Seigneur des Ténèbres** - Boss final avec phase d'enragement

### 🗺️ Exploration
- Navigation salle par salle
- Rencontres aléatoires avec des monstres
- Coffres au trésor (or, objets, équipements)
- Marchands ambulants pour acheter des objets
- Événements spéciaux (fontaines magiques, pièges, etc.)

### 🎨 Interface Utilisateur
- Design moderne avec Tailwind CSS
- Animations fluides (pulse, shake, fade, float)
- Barres de vie/mana avec transitions
- Log de combat en temps réel
- Gestion d'inventaire intuitive
- Écrans dédiés pour chaque état du jeu

## 🎯 Objectif

Descendre les 5 étages du donjon, vaincre tous les boss, et triompher du Seigneur des Ténèbres pour sauver le royaume !

## 💡 Conseils de Jeu

1. **Gère ton MP** - Les compétences puissantes coûtent cher en MP
2. **Achète des potions** - Visite les marchands régulièrement
3. **Équipe-toi** - Change d'équipement pour améliorer tes stats
4. **Monte en niveau** - N'hésite pas à combattre pour gagner de l'XP
5. **Utilise la défense** - Face aux boss, la défense peut sauver ta vie
6. **Stratégie** - Concentration + Coup Fatal = combo dévastateur

## 🛠️ Technologies Utilisées

- React 18 (via CDN)
- Tailwind CSS (via CDN)
- Babel Standalone (pour JSX)
- Vanilla JavaScript

## 📝 Spécifications Techniques

- **Fichier unique** : Tout le jeu dans `dungeon-rpg.html`
- **Aucune installation** : Fonctionne directement dans le navigateur
- **Responsive** : Optimisé pour écrans desktop
- **Performances** : Pas de game loop, système tour par tour léger
- **État du jeu** : Géré avec React hooks (useState)

## 🎮 Commandes

- **Souris** : Clique sur les boutons pour interagir
- **Navigation** : Utilise les boutons à l'écran pour toutes les actions

## 🏆 Crédits

Développé par Claude (Anthropic) - Jeu RPG complet créé selon les spécifications demandées.

---

**Bonne aventure, héros ! Le donjon t'attend... ⚔️🛡️**
