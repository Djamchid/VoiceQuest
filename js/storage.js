/**
 * VoiceQuest - Storage Module
 * Handles all localStorage operations and data persistence
 */

const STORAGE_KEY = 'voiceQuestData';

/**
 * Load saved data from localStorage
 * @returns {Object} - The loaded application data or default data
 */
function loadSavedData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            // Verify version to prevent crashes from schema changes
            if (parsed.version === DATA_VERSION) {
                console.log('✓ Données chargées depuis le stockage local');
                return parsed;
            } else {
                console.warn('Version de données obsolète. Utilisation des données par défaut.');
                return JSON.parse(JSON.stringify(defaultData));
            }
        }
        console.log('Aucune donnée sauvegardée. Initialisation avec les données par défaut.');
        return JSON.parse(JSON.stringify(defaultData));
    } catch (e) {
        console.error('Erreur lors du chargement des données:', e);
        return JSON.parse(JSON.stringify(defaultData));
    }
}

/**
 * Save data to localStorage
 * @param {Object} data - The application data to save
 * @returns {boolean} - Success status
 */
function saveData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        console.log('✓ Données sauvegardées');
        return true;
    } catch (e) {
        console.error('Erreur de sauvegarde (quota dépassé?):', e);
        return false;
    }
}

/**
 * Reset all data by removing from localStorage
 * @returns {boolean} - Success status
 */
function resetData() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('✓ Données réinitialisées');
        return true;
    } catch (e) {
        console.error('Erreur lors de la réinitialisation:', e);
        return false;
    }
}

/**
 * Check if this is a new day and update login streak
 * @param {Object} appData - The application data
 * @returns {boolean} - True if it's a new day
 */
function checkDailyLogin(appData) {
    const today = new Date().toDateString();
    const lastLogin = appData.user.lastLogin;

    if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        // Check if login was yesterday (continue streak) or earlier (reset streak)
        if (lastLogin === yesterdayStr) {
            appData.user.streak++;
        } else if (lastLogin !== null) {
            // Missed days, reset streak
            appData.user.streak = 1;
        } else {
            // First ever login
            appData.user.streak = 1;
        }

        appData.user.lastLogin = today;
        appData.user.energy = 100; // Restore energy

        console.log(`Nouvelle journée! Série: ${appData.user.streak} jours`);
        return true;
    }

    return false;
}

/**
 * Export for use in other modules
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STORAGE_KEY,
        loadSavedData,
        saveData,
        resetData,
        checkDailyLogin
    };
}
