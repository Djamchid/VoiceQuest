# Spécifications Fonctionnelles \- "Voice Quest" MVP

## 🎯 Vue d'ensemble technique

**Stack:** HTML5, CSS3, JavaScript natif **Stockage:** Local Storage **Export:** CSV **MVP:** Sans détection vocale avancée **V2:** Avec système de détection vocale technique

---

## 📱 Fonctionnalités MVP (Version 1.0)

### 1\. **Architecture Générale**

voice-quest/

├── index.html          \# Page d'accueil / tableau de bord

├── modules/            \# Pages des modules thématiques

├── parcours/           \# Pages des parcours guidés

├── profil/             \# Page profil et progression

├── css/

│   └── style.css       \# Styles principaux

├── js/

│   ├── app.js          \# Logique principale

│   ├── gamification.js \# Système de points/badges

│   ├── storage.js      \# Gestion Local Storage

│   └── export.js       \# Export CSV

└── assets/             \# Images, icônes

### 2\. **Pages et Navigation**

#### Page d'Accueil (`index.html`)

- **Header:** Logo \+ navigation (Accueil, Modules, Parcours, Profil)  
- **Section "État du Jour":**  
  - Score énergie vocale (jauge visuelle)  
  - Série actuelle (jours consécutifs)  
  - Badges récemment débloqués  
- **Section "Accès Rapide":**  
  - Boutons modules principaux (Souffle, Voix, Articulation, Renforcement)  
  - Boutons parcours (Découverte, Complet, Apaisant, Détente)  
- **Section "Quête du Jour":**  
  - Objectif quotidien personnalisé  
  - Récompense à gagner

#### Page Modules (`modules.html`)

- **Cartes modules interactives:**  
  - Forêt des Souffles (Module Souffle)  
  - Vallée des Résonances (Module Voix)  
  - Temple de l'Articulation (Module Articulation)  
  - Montagne Oro-Faciale (Module Renforcement)  
  - Source de la Déglutition (Module Déglutition)  
- **Indicateurs de progression par module**  
- **Niveau débloqué et prochain objectif**

#### Page Parcours (`parcours.html`)

- **Parcours Découverte** (15min) \- 🔵 Débutant  
- **Parcours Complet** (45min) \- 🟡 Intermédiaire  
- **Parcours Apaisant** (10min) \- 🟢 Tous niveaux  
- **Parcours Détente** (15min) \- 🟢 Tous niveaux  
- **Parcours Maintenance** (rotatifs) \- 🟡 Intermédiaire

#### Page Profil (`profil.html`)

- **Avatar personnalisable** (couleurs basiques MVP)  
- **Statistiques:**  
  - Niveau actuel & XP  
  - Jours consécutifs  
  - Temps total d'entraînement  
  - Modules complétés  
- **Collection de badges**  
- **Historique des sessions**  
- **Bouton export CSV**

### 3\. **Système d'Exercices**

#### Structure d'un Exercice

{

  id: "souffle-bougie-douce",

  module: "souffle",

  nom: "Bougie douce",

  instructions: "Soufflez doucement pour faire vaciller la flamme...",

  duree: 30, // secondes

  type: "minuteur|repetitions|tenue",

  objectif: 25, // valeur cible

  xp: 50,

  difficulte: "debutant"

}

#### Interface Exercice

- **Timer visuel** avec progression  
- **Boutons contrôle** (Démarrer/Pause/Stop)  
- **Zone instructions** avec exemple audio optionnel  
- **Saisie manuelle** du résultat (pour MVP)  
- **Validation** et attribution XP  
- **Feedback visuel** (succès/échec)

### 4\. **Gamification MVP**

#### Système de Niveaux

// Structure niveau

niveaux: \[

  { niveau: 1, xpRequired: 0, badge: "novice" },

  { niveau: 2, xpRequired: 500, badge: "apprenti" },

  { niveau: 3, xpRequired: 1200, badge: "adepte" },

  // ... jusqu'au niveau 20

\]

#### Badges à Débloquer

- **🟢 Badges de Persévérance:**  
  - "Écho Persistant" (3 jours consécutifs)  
  - "Rythme Régulier" (7 jours)  
  - "Maître de la Routine" (30 jours)  
- **🔵 Badges de Compétence:**  
  - "Souffle du Vent" (Module Souffle complété)  
  - "Voix Cristalline" (Module Voix complété)  
  - "Articulation Parfaite" (Module Articulation complété)  
- **🟡 Badges Spéciaux:**  
  - "Explorateur" (Tous modules essayés)  
  - "Marathonien" (Session de 45min complétée)

#### Économie Virtuelle

- **XP** (Expérience) \- progression de niveau  
- **Pièces** (monnaie virtuelle) \- customisation avatar  
- **Énergie vocale** \- jauge qui se remplit/recharge

### 5\. **Stockage des Données (Local Storage)**

#### Schéma de Données

// Utilisateur

userData: {

  id: "uuid",

  pseudo: "Joueur",

  niveau: 1,

  xp: 0,

  xpTotal: 0,

  pièces: 100,

  energie: 80,

  serie: 3, // jours consécutifs

  dernierLogin: "2024-01-15",

  avatar: { couleur: "blue", accessoires: \[\] }

}

// Progression

progressData: {

  badges: \["novice", "explorateur"\],

  modules: {

    souffle: { complété: false, score: 65, exercicesComplétés: 3/9 },

    voix: { complété: false, score: 40, exercicesComplétés: 2/6 }

  },

  historique: \[

    { date: "2024-01-15", module: "souffle", xpGagne: 150, duree: 12 }

  \]

}

### 6\. **Fonctionnalités d'Export**

#### Export CSV

- **Bouton "Exporter mes données"** dans le profil  
- **Fichier CSV avec:**  
  - Historique des sessions (date, durée, module, XP gagné)  
  - Progression par module  
  - Badges débloqués avec dates  
  - Statistiques globales

### 7\. **Design et UX**

#### Thème Visuel

- **Palette:** Verts (forêt), bleus (ciel), violets (magie)  
- **Typographie:** Lisible (Open Sans ou système)  
- **Cartes** avec bordures arrondies et ombres  
- **Indicateurs visuels** de progression

#### Composants Réutilisables

- **Cartes de module** avec barre de progression  
- **Timer circulaire** pour exercices  
- **Jauges** d'énergie et XP  
- **Modals** pour instructions détaillées

---

## 🔮 Fonctionnalités V2 (Détection Vocale)

### 1\. **Intégration Web Audio API**

- **Analyseur de fréquence** pour volume et stabilité  
- **Détection de silence** pour calcul durée phonation  
- **Visualisation en temps réel** (graphiques simples)

### 2\. **Exercices avec Détection Automatique**

#### Souffle

- **Mesure durée expiration** (bougie, bulles)  
- **Stabilité du flux** (moulin à vent)

#### Voix

- **Tenue de note** (stabilité fréquence)  
- **Volume constant** pendant phonation  
- **Transition douce** entre notes

#### Articulation

- **Reconnaissance basique** de syllabes cibles  
- **Précision temporelle** (rythme pa-ta-ka)

### 3\. **Scoring Automatisé**

- **Pourcentage de précision** calculé automatiquement  
- **Feedback immédiat** sur les aspects à améliorer  
- **Historique détaillé** des performances

---

## 📋 Checklist de Développement MVP

### Phase 1 \- Structure de Base

- [ ] Architecture HTML de base  
- [ ] Système de navigation entre pages  
- [ ] Styles CSS fondamentaux  
- [ ] Système de routing SPA simple

### Phase 2 \- Données et Stockage

- [ ] Modèles de données Local Storage  
- [ ] CRUD exercices et progression  
- [ ] Système de sauvegarde automatique  
- [ ] Export CSV fonctionnel

### Phase 3 \- Gamification

- [ ] Système de niveaux et XP  
- [ ] Attribution de badges  
- [ ] Jauges visuelles (énergie, progression)  
- [ ] Calcul des récompenses

### Phase 4 \- Exercices et Modules

- [ ] Pages modules avec exercices  
- [ ] Timer interactif pour exercices  
- [ ] Saisie manuelle des résultats  
- [ ] Validation et feedback

### Phase 5 \- Polissage

- [ ] Responsive design  
- [ ] Gestion des erreurs  
- [ ] Performance optimisation  
- [ ] Documentation utilisateur

---

## 🎯 Métriques de Succès MVP

- **Temps moyen par session:** \> 8 minutes  
- **Rétention 7 jours:** \> 60%  
- **Completion rate parcours découverte:** \> 70%  
- **Utilisation export CSV:** \> 20% des utilisateurs

**Prochaines étapes après validation:**

1. Prototypage des interfaces  
2. Développement itératif par composant  
3. Tests utilisateur early access  
4. Intégration progressive V2

*Cette spécification couvre l'essentiel pour un MVP fonctionnel sans détection vocale avancée. La V2 pourra intégrer l’analyse audio une fois le cœur de l'application validé.*  
