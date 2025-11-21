/**
 * VoiceQuest - Gamification Module
 * Handles XP, levels, badges, and daily objectives
 */

/**
 * Calculate current level based on XP
 * @param {number} xp - Current XP amount
 * @returns {number} - Current level
 */
function calculateLevel(xp) {
    for (let i = levels.length - 1; i >= 0; i--) {
        if (xp >= levels[i].xpRequired) {
            return levels[i].level;
        }
    }
    return 1;
}

/**
 * Get XP required for next level
 * @param {number} currentLevel - Current player level
 * @returns {number} - XP required for next level
 */
function getXPForNextLevel(currentLevel) {
    const nextLevel = Math.min(currentLevel + 1, levels.length);
    return levels[nextLevel - 1].xpRequired;
}

/**
 * Get XP progress to next level
 * @param {number} currentXP - Current XP
 * @param {number} currentLevel - Current level
 * @returns {Object} - { current, required, percentage }
 */
function getLevelProgress(currentXP, currentLevel) {
    const currentLevelXP = levels[currentLevel - 1].xpRequired;
    const nextLevelXP = getXPForNextLevel(currentLevel);
    const xpIntoLevel = currentXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const percentage = Math.round((xpIntoLevel / xpNeededForLevel) * 100);

    return {
        current: xpIntoLevel,
        required: xpNeededForLevel,
        remaining: xpNeededForLevel - xpIntoLevel,
        percentage: percentage
    };
}

/**
 * Check and award badges based on current progress
 * @param {Object} appData - Application data
 * @returns {Array} - Array of newly earned badge keys
 */
function checkBadges(appData) {
    const newBadges = [];

    // Novice badge - Complete first exercise
    if (appData.history.length >= 1 && !appData.badges.novice.earned) {
        appData.badges.novice.earned = true;
        newBadges.push('novice');
    }

    // Perseverance badge - 7 consecutive days
    if (appData.user.streak >= 7 && !appData.badges.perseverance.earned) {
        appData.badges.perseverance.earned = true;
        newBadges.push('perseverance');
    }

    // Explorateur badge - Try all 5 modules
    if (!appData.badges.explorateur.earned) {
        const modulesAttempted = new Set();
        appData.history.forEach(entry => {
            if (entry.module) modulesAttempted.add(entry.module);
        });
        if (modulesAttempted.size >= 5) {
            appData.badges.explorateur.earned = true;
            newBadges.push('explorateur');
        }
    }

    // Module completion badges
    const modulesBadges = {
        souffle: 'souffle_maitre',
        voix: 'voix_cristalline',
        articulation: 'articulation_parfaite'
    };

    Object.entries(modulesBadges).forEach(([moduleKey, badgeKey]) => {
        if (appData.modules[moduleKey].completed && !appData.badges[badgeKey].earned) {
            appData.badges[badgeKey].earned = true;
            newBadges.push(badgeKey);
        }
    });

    // Marathonien badge - Complete 45min parcours
    // This will be checked in parcours.js when completing the 'complet' parcours

    if (newBadges.length > 0) {
        console.log('🏆 Nouveaux badges débloqués:', newBadges);
    }

    return newBadges;
}

/**
 * Generate daily objectives
 * @param {Object} appData - Application data
 * @returns {Array} - Array of daily objectives
 */
function generateDailyObjectives(appData) {
    const objectives = [];

    // Find modules with least progress for variety
    const moduleProgress = Object.entries(appData.modules)
        .map(([key, data]) => ({ key, progress: data.progress }))
        .sort((a, b) => a.progress - b.progress);

    const targetModule = moduleProgress[0];

    // Objective 1: Complete specific number of exercises
    objectives.push({
        description: `Compléter 2 exercices`,
        required: 2,
        progress: 0,
        completed: false,
        type: 'exercises'
    });

    // Objective 2: Earn XP
    const xpGoal = 100 + (appData.user.level * 20);
    objectives.push({
        description: `Gagner ${xpGoal} XP`,
        required: xpGoal,
        progress: 0,
        completed: false,
        type: 'xp'
    });

    // Objective 3: Try a specific module
    const moduleNames = {
        souffle: 'Souffle',
        voix: 'Voix',
        articulation: 'Articulation',
        renforcement: 'Renforcement',
        deglutition: 'Déglutition'
    };

    objectives.push({
        description: `Essayer le module ${moduleNames[targetModule.key]}`,
        required: 1,
        progress: 0,
        completed: false,
        type: 'module',
        targetModule: targetModule.key
    });

    return objectives;
}

/**
 * Update progress of daily objectives
 * @param {Object} appData - Application data
 * @param {string} moduleName - Module that was just completed
 * @param {number} xpEarned - XP just earned
 */
function updateObjectivesProgress(appData, moduleName, xpEarned) {
    if (!appData.user.objectives) return;

    appData.user.objectives.forEach(obj => {
        if (obj.completed) return;

        switch (obj.type) {
            case 'exercises':
                obj.progress++;
                break;
            case 'xp':
                obj.progress += xpEarned;
                break;
            case 'module':
                if (obj.targetModule === moduleName) {
                    obj.progress = 1;
                }
                break;
        }

        // Check if objective is completed
        if (obj.progress >= obj.required) {
            obj.completed = true;
            console.log('✓ Objectif complété:', obj.description);
        }
    });
}

/**
 * Calculate exercise completion rewards
 * @param {Object} exercise - The completed exercise
 * @param {number} completionRatio - Completion ratio (0-1)
 * @returns {Object} - { xp, coins }
 */
function calculateRewards(exercise, completionRatio = 1) {
    const xpEarned = Math.round(exercise.xp * completionRatio);
    const coinsEarned = Math.round(xpEarned / 5);
    return { xp: xpEarned, coins: coinsEarned };
}

/**
 * Export for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateLevel,
        getXPForNextLevel,
        getLevelProgress,
        checkBadges,
        generateDailyObjectives,
        updateObjectivesProgress,
        calculateRewards
    };
}
