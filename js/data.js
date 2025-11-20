/**
 * VoiceQuest - Data Module
 * Contains all exercises, parcours, and default data structures
 */

const DATA_VERSION = "1.0";

// Default application data structure
const defaultData = {
    version: DATA_VERSION,
    user: {
        name: "Joueur",
        level: 1,
        xp: 0,
        coins: 0,
        energy: 100,
        streak: 0,
        totalTime: 0,
        sessionCount: 0,
        lastLogin: null,
        objectives: []
    },
    modules: {
        souffle: {
            name: "Forêt des Souffles",
            completed: false,
            progress: 0,
            exercisesCompleted: 0,
            totalExercises: 5
        },
        voix: {
            name: "Vallée des Résonances",
            completed: false,
            progress: 0,
            exercisesCompleted: 0,
            totalExercises: 5
        },
        articulation: {
            name: "Temple de l'Articulation",
            completed: false,
            progress: 0,
            exercisesCompleted: 0,
            totalExercises: 5
        },
        renforcement: {
            name: "Montagne Oro-Faciale",
            completed: false,
            progress: 0,
            exercisesCompleted: 0,
            totalExercises: 8
        },
        deglutition: {
            name: "Source de la Déglutition",
            completed: false,
            progress: 0,
            exercisesCompleted: 0,
            totalExercises: 3
        }
    },
    badges: {
        novice: {
            name: "Novice",
            earned: false,
            description: "Compléter votre premier exercice",
            icon: "🎯"
        },
        explorateur: {
            name: "Explorateur",
            earned: false,
            description: "Essayer tous les modules",
            icon: "🧭"
        },
        souffle_maitre: {
            name: "Maître du Souffle",
            earned: false,
            description: "Compléter le module Souffle",
            icon: "💨"
        },
        voix_cristalline: {
            name: "Voix Cristalline",
            earned: false,
            description: "Compléter le module Voix",
            icon: "🎵"
        },
        articulation_parfaite: {
            name: "Articulation Parfaite",
            earned: false,
            description: "Compléter le module Articulation",
            icon: "🗣️"
        },
        perseverance: {
            name: "Persévérance",
            earned: false,
            description: "7 jours d'activité consécutifs",
            icon: "🔥"
        },
        marathonien: {
            name: "Marathonien",
            earned: false,
            description: "Compléter un parcours de 45min",
            icon: "🏃"
        }
    },
    history: [],
    dailyQuest: null,
    modulesAttempted: [] // Track which modules have been attempted
};

// All exercises organized by module
const exercises = {
    souffle: [
        {
            id: 1,
            name: "Bougie douce",
            instructions: "Soufflez doucement pour faire vaciller une flamme imaginaire sans l'éteindre.",
            duration: 30,
            xp: 50,
            type: "timer"
        },
        {
            id: 2,
            name: "Bulles de savon",
            instructions: "Soufflez doucement pour créer des bulles régulières et stables.",
            duration: 45,
            xp: 60,
            type: "timer"
        },
        {
            id: 3,
            name: "Bougie éloignée",
            instructions: "Éteignez une bougie que vous éloignez progressivement.",
            duration: 40,
            xp: 70,
            type: "timer"
        },
        {
            id: 4,
            name: "Moulin à vent",
            instructions: "Soufflez de manière régulière pour faire tourner un moulinet.",
            duration: 60,
            xp: 80,
            type: "timer"
        },
        {
            id: 5,
            name: "Ballons",
            instructions: "Gonflez un ballon en plusieurs expirations contrôlées.",
            duration: 90,
            xp: 100,
            type: "timer"
        }
    ],
    voix: [
        {
            id: 1,
            name: "Posture",
            instructions: "Tenez-vous droit, sternum ouvert, respiration abdominale.",
            duration: 60,
            xp: 40,
            type: "timer"
        },
        {
            id: 2,
            name: "Bâillement voisé",
            instructions: "Inspirez bouche grande ouverte, expirez sur un 'A' doux.",
            duration: 45,
            xp: 60,
            type: "repetition",
            reps: 5
        },
        {
            id: 3,
            name: "Ronronnement (Fry)",
            instructions: "Produisez un son grave et crépitant, comme un ronron.",
            duration: 30,
            xp: 50,
            type: "timer"
        },
        {
            id: 4,
            name: "Le Cheval",
            instructions: "Faites vibrer vos lèvres en produisant un 'Brrrr'.",
            duration: 40,
            xp: 55,
            type: "timer"
        },
        {
            id: 5,
            name: "Sons graves",
            instructions: "Tenez un 'hoooo' très grave et détendu.",
            duration: 60,
            xp: 65,
            type: "timer"
        }
    ],
    articulation: [
        {
            id: 1,
            name: "Répétitions",
            instructions: "Prononcez clairement : 'pa-ta-ka', 'ma-na-la'.",
            duration: 60,
            xp: 50,
            type: "repetition",
            reps: 10
        },
        {
            id: 2,
            name: "Grrrr et Crrrr",
            instructions: "Insistez sur les consonnes : 'Grrrr', 'Crrrr'.",
            duration: 45,
            xp: 55,
            type: "repetition",
            reps: 8
        },
        {
            id: 3,
            name: "Le Chêne et le Roseau",
            instructions: "Lisez en alternant une ligne forte et une ligne douce.",
            duration: 120,
            xp: 80,
            type: "timer"
        },
        {
            id: 4,
            name: "La Cigale et la Fourmi",
            instructions: "Récitez en articulant chaque syllabe clairement.",
            duration: 120,
            xp: 80,
            type: "timer"
        },
        {
            id: 5,
            name: "Virelangues",
            instructions: "Les chaussettes de l'archiduchesse sont-elles sèches ?",
            duration: 90,
            xp: 70,
            type: "repetition",
            reps: 5
        }
    ],
    renforcement: [
        {
            id: 1,
            name: "Bisous sonores",
            instructions: "Envoyez des bisous bien claquants.",
            duration: 45,
            xp: 40,
            type: "repetition",
            reps: 15
        },
        {
            id: 2,
            name: "Sourires alternés",
            instructions: "Souriez largement à gauche, puis à droite.",
            duration: 60,
            xp: 45,
            type: "repetition",
            reps: 10
        },
        {
            id: 3,
            name: "OU-I exagéré",
            instructions: "Alternez 'OU' et 'I' de façon exagérée.",
            duration: 90,
            xp: 60,
            type: "repetition",
            reps: 20
        },
        {
            id: 4,
            name: "Claquements de langue",
            instructions: "Claquez la langue ('clac clac clac').",
            duration: 45,
            xp: 40,
            type: "repetition",
            reps: 15
        },
        {
            id: 5,
            name: "Balayage du palais",
            instructions: "Passez le bout de la langue du palais dur au voile.",
            duration: 60,
            xp: 45,
            type: "repetition",
            reps: 10
        },
        {
            id: 6,
            name: "Élastique en équilibre",
            instructions: "Tenez un élastique sur le bout de votre langue.",
            duration: 30,
            xp: 50,
            type: "timer"
        },
        {
            id: 7,
            name: "Ouverture/Fermeture",
            instructions: "Ouvrez et fermez la bouche lentement.",
            duration: 90,
            xp: 45,
            type: "repetition",
            reps: 10
        },
        {
            id: 8,
            name: "Gonflement résisté",
            instructions: "Gonflez les joues et résistez à la pression.",
            duration: 30,
            xp: 50,
            type: "timer"
        }
    ],
    deglutition: [
        {
            id: 1,
            name: "Déglutition volontaire",
            instructions: "Avalez votre salive en sentant le larynx.",
            duration: 90,
            xp: 50,
            type: "repetition",
            reps: 10
        },
        {
            id: 2,
            name: "Manœuvre de Masako",
            instructions: "Langue entre les dents, avalez.",
            duration: 120,
            xp: 70,
            type: "repetition",
            reps: 10
        },
        {
            id: 3,
            name: "Manœuvre de Mendelson",
            instructions: "Avalez et maintenez le larynx en haut.",
            duration: 120,
            xp: 80,
            type: "repetition",
            reps: 8
        }
    ]
};

// Guided parcours with sequential steps
const parcours = {
    decouverte: {
        name: "Parcours Découverte",
        duration: 15,
        difficulty: "débutant",
        description: "Idéal pour débuter",
        steps: [
            { exercise: "Posture", module: "voix", duration: 60 },
            { exercise: "Bougie douce", module: "souffle", duration: 45 },
            { exercise: "Bisous sonores", module: "renforcement", duration: 30 }
        ],
        xp: 200,
        validation: "Je prends soin de ma voix."
    },
    complet: {
        name: "Parcours Complet",
        duration: 45,
        difficulty: "intermédiaire",
        description: "Session intégrative",
        steps: [
            { exercise: "Posture", module: "voix", duration: 60 },
            { exercise: "Moulin à vent", module: "souffle", duration: 180 },
            { exercise: "Le Cheval", module: "voix", duration: 150 }
        ],
        xp: 500,
        validation: "Je retrouve ma voix."
    },
    apaisant: {
        name: "Parcours Apaisant",
        duration: 10,
        difficulty: "tous niveaux",
        description: "Pour la fatigue vocale",
        steps: [
            { exercise: "Ronronnement (Fry)", module: "voix", duration: 60 },
            { exercise: "Sons graves", module: "voix", duration: 60 }
        ],
        xp: 100,
        validation: "Repos vocal."
    },
    detente: {
        name: "Parcours Détente",
        duration: 15,
        difficulty: "tous niveaux",
        description: "Pour relâcher les tensions",
        steps: [
            { exercise: "Bâillement voisé", module: "voix", duration: 120 },
            { exercise: "Sons graves", module: "voix", duration: 120 }
        ],
        xp: 150,
        validation: "Détente."
    },
    maintenance: {
        name: "Parcours Maintenance",
        duration: 20,
        difficulty: "intermédiaire",
        description: "Session d'entretien",
        steps: [
            { exercise: "Répétitions", module: "articulation", duration: 120 },
            { exercise: "OU-I exagéré", module: "renforcement", duration: 90 }
        ],
        xp: 200,
        validation: "Maintenance."
    }
};

// Level progression thresholds
const levels = [
    { level: 1, xpRequired: 0 },
    { level: 2, xpRequired: 500 },
    { level: 3, xpRequired: 1200 },
    { level: 4, xpRequired: 2000 },
    { level: 5, xpRequired: 3000 },
    { level: 6, xpRequired: 4200 },
    { level: 7, xpRequired: 5600 },
    { level: 8, xpRequired: 7200 },
    { level: 9, xpRequired: 9000 },
    { level: 10, xpRequired: 11000 },
    { level: 11, xpRequired: 13500 },
    { level: 12, xpRequired: 16500 },
    { level: 13, xpRequired: 20000 },
    { level: 14, xpRequired: 24000 },
    { level: 15, xpRequired: 28500 },
    { level: 16, xpRequired: 33500 },
    { level: 17, xpRequired: 39000 },
    { level: 18, xpRequired: 45000 },
    { level: 19, xpRequired: 52000 },
    { level: 20, xpRequired: 60000 }
];

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DATA_VERSION, defaultData, exercises, parcours, levels };
}
